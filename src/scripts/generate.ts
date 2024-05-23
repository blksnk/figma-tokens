import { extractConfigFileKeys, validateConfig } from "../utils/config.utils";
import {
  FIGMA_FILE_URLS,
  FIGMA_TEAM_ID,
  FIGMA_TOKEN,
  FIGMA_ICONS_FILE_URL,
} from "../api/config";
import { Logger } from "../utils/log.utils";
import { FigmaApiClient } from "../api/client";
import {
  FigmaFileKey,
  FigmaTeamId,
} from "../types/figma/figma.properties.types";
import { tokenizeStyles } from "../transformers/style.transformer";
import {
  groupTokens,
  unwrapTokenValues,
} from "../transformers/token.transfomer";
import { Icon, Token } from "../types/global/export.types";
import { generateExportedTS } from "../transformers/export.transformer";
import { fetchIconSvgs } from "../transformers/icon.transformer";

const logger = Logger({
  spacing: 1,
  throwOnError: true,
  mode: "simple",
});
const { info, warn } = logger;

/**
 * Fetches and formats team styles into tokens.
 *
 * @param {FigmaApiClient} figmaApiClient - The Figma API client.
 * @param {FigmaTeamId} teamId - The ID of the Figma team.
 * @param {FigmaFileKey[]} [fileKeyFilters] - An optional array of Figma file keys to filter the team styles.
 * @return {Promise<Token[]>} A promise that resolves to an array of tokens representing the team styles.
 */
const fetchAndFormatTeamStyles = async (
  figmaApiClient: FigmaApiClient,
  teamId: FigmaTeamId,
  fileKeyFilters?: FigmaFileKey[]
): Promise<Token[]> => {
  info("Fetching team styles...");
  const teamStylesResponse = await figmaApiClient.getTeamStyles(teamId, {
    page_size: 10000,
  });
  const teamStyles = teamStylesResponse?.meta?.styles;
  if (!teamStyles || teamStyles.length === 0) {
    warn("No styles found for team");
    return [];
  }
  // restrict to design system & client types
  info("Extracting Ublo team styles...");
  const filteredStyles =
    fileKeyFilters && fileKeyFilters.length > 0
      ? teamStyles.filter((teamStyle) =>
          fileKeyFilters.includes(teamStyle.file_key)
        )
      : teamStyles;
  info("Fetched team styles");
  return await tokenizeStyles(figmaApiClient, filteredStyles, logger);
};

/**
 * Generates and exports tokens from the Figma API.
 *
 * @param {FigmaApiClient} figmaApiClient - The Figma API client.
 * @param {FigmaTeamId} teamId - The ID of the Figma team.
 * @param {FigmaFileKey[]} fileKeyFilters - Optional array of file keys to filter the tokens.
 * @return {Promise<Token[]>} A promise that resolves to an array of tokens.
 */
const generateAndExportTokens = async (
  figmaApiClient: FigmaApiClient,
  teamId: FigmaTeamId,
  fileKeyFilters?: FigmaFileKey[]
) => {
  info("Starting team styles update...");
  const tokens = await fetchAndFormatTeamStyles(
    figmaApiClient,
    teamId,
    fileKeyFilters
  );
  const rootTokenCollection = groupTokens(tokens, logger);
  const tokenValues = unwrapTokenValues(rootTokenCollection);
  return {
    tokens,
    rootTokenCollection,
    tokenValues,
  };
};

/**
 * Fetches icons metadata from Figma API and filters them based on the icon file key.
 *
 * @param {FigmaApiClient} figmaApiClient - the Figma API client
 * @param {FigmaTeamId} teamId - the ID of the Figma team
 * @param {FigmaFileKey} iconFileKey - the key of the Figma file containing icons
 * @return {Promise<Component[]>} an array of components representing the icons metadata
 */
const fetchIconsMetadata = async (
  figmaApiClient: FigmaApiClient,
  teamId: FigmaTeamId,
  iconFileKey: FigmaFileKey
) => {
  info("Fetching all components in the exported team styles...");
  const componentsResponse = await figmaApiClient.getTeamComponents(teamId, {
    page_size: 10000,
  });

  if (!componentsResponse) return [];
  if (componentsResponse.error) {
    warn(componentsResponse.error);
    return [];
  }
  if (componentsResponse.meta.components.length === 0) {
    return [];
  }
  info(
    `Filtering ${componentsResponse.meta.components.length} components based on the icon file key...`
  );
  const filteredComponents = componentsResponse.meta.components.filter(
    (item) => item.file_key === iconFileKey
  );
  return filteredComponents;
};

/**
 * Generate and export icons from Figma.
 *
 * @param {FigmaApiClient} figmaApiClient - The Figma API client
 * @param {FigmaTeamId} teamId - The team ID in Figma
 * @param {FigmaFileKey[]} iconFileKey - The key of the Figma file containing the icons
 * @return {Promise<Icon[]>} A promise that resolves to an array of icons
 */
const generateAndExportIcons = async (
  figmaApiClient: FigmaApiClient,
  teamId: FigmaTeamId,
  [iconFileKey]: FigmaFileKey[]
): Promise<Icon[]> => {
  info("Starting icons update...");
  const iconComponentsMetadata = await fetchIconsMetadata(
    figmaApiClient,
    teamId,
    iconFileKey
  );
  return await fetchIconSvgs(
    figmaApiClient,
    iconComponentsMetadata,
    iconFileKey,
    logger
  );
};

/**
 * Async function that initialized the Figma api client, fetches up-to-date Figma files and returns generated tokens and icons.
 * @returns {Promise<{tokens: Token[], icons: Icon[]}>} - Array containing all generated tokens according to env config
 */
export const generate = async () => {
  info("Validating config...");
  const config = validateConfig(
    {
      FIGMA_TOKEN,
      FIGMA_FILE_URLS,
      FIGMA_TEAM_ID,
      FIGMA_ICONS_FILE_URL,
    },
    logger
  );
  info("Config validated");
  info("Initializing Figma API client...");
  const figmaApiClient = new FigmaApiClient(config.FIGMA_TOKEN);
  info("Figma API client initialized");
  const icons = await generateAndExportIcons(
    figmaApiClient,
    config.FIGMA_TEAM_ID,
    extractConfigFileKeys(config.FIGMA_ICONS_FILE_URL)
  );
  const { tokens, tokenValues, rootTokenCollection } =
    await generateAndExportTokens(
      figmaApiClient,
      config.FIGMA_TEAM_ID,
      extractConfigFileKeys(config.FIGMA_FILE_URLS, logger)
    );
  await generateExportedTS(
    rootTokenCollection,
    tokenValues,
    tokens,
    icons,
    logger
  );

  return {
    tokens,
    icons,
  };
};
