import { extractConfigFileKeys, validateConfig } from "../utils/config.utils";
import {
  FIGMA_TEAM_ID,
  FIGMA_TOKEN,
  FIGMA_FILE_URLS
} from "../api/config";
import { Logger } from "../utils/log.utils";
import { FigmaApiClient } from "../api/client";
import {
  FigmaFileKey,
  FigmaTeamId
} from "../types/figma/figma.properties.types";
import { tokenizeStyles } from "../transformers/style.transformer";
import {
  groupTokens,
  unwrapTokenValues
} from "../transformers/token.transfomer";
import { Token } from "../types/global/export.types";
import { generateExportedTS } from "../transformers/export.transformer";

const logger = Logger({
  spacing: 1,
  throwOnError: true,
  mode: "simple"
})
const { info, debug, warn } = logger;

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
  debug("Fetching team styles...");
  const teamStylesResponse = await figmaApiClient.getTeamStyles(teamId, {
    page_size: 10000,
  });
  const teamStyles = teamStylesResponse?.meta.styles;
  if (!teamStyles ?? teamStyles.length === 0) {
    warn("No styles found for team");
    return [];
  }
  // restrict to design system & client types
  debug("Extracting Ublo team styles...");
  const filteredStyles = fileKeyFilters && fileKeyFilters.length > 0
    ? teamStyles.filter(teamStyle => fileKeyFilters.includes(teamStyle.file_key))
    : teamStyles;
  info("Fetched team styles");
  return await tokenizeStyles(figmaApiClient, filteredStyles, logger);
}

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
): Promise<Token[]> => {
  info("Starting team styles update...");
  const teamStyleTokens = await fetchAndFormatTeamStyles(figmaApiClient, teamId, fileKeyFilters);
  const rootTokenCollection = groupTokens(teamStyleTokens, logger)
  const tokenValues = unwrapTokenValues(rootTokenCollection)
  await generateExportedTS(rootTokenCollection, tokenValues, teamStyleTokens);
  return teamStyleTokens;
}

/**
 * Async function that initialized the Figma api client, fetches up-to-date Figma files and returns generated tokens.
 * @returns {Promise<Token[]>} - Array containing all generated tokens according to env config
 */
export const generate = async (): Promise<Token[]> => {
  debug("Validating config...");
  const config = validateConfig({
    FIGMA_TOKEN,
    FIGMA_FILE_URLS,
    FIGMA_TEAM_ID,
  }, logger)
  info("Config validated");
  debug("Initializing Figma API client...")
  const figmaApiClient = new FigmaApiClient(config.FIGMA_TOKEN);
  info("Figma API client initialized");
  const allTokens = await generateAndExportTokens(
    figmaApiClient, config.FIGMA_TEAM_ID,
    extractConfigFileKeys(config.FIGMA_FILE_URLS, logger)
  )
  return allTokens;
}
