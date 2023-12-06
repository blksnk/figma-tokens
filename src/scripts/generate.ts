import { validateConfig } from "../utils/config.utils";
import {
  FIGMA_TEAM_ID,
  FIGMA_TOKEN,
  FILE_URL_CLIENT_THEMES,
  FILE_URL_DESIGN_SYSTEM
} from "../api/config";
import { Logger } from "../utils/log.utils";
import { FigmaApiClient } from "../api/client";
import { extractFileKeyFromUrl } from "../utils/figma.utils";
import {
  FigmaFileKey,
  FigmaTeamId
} from "../types/figma/figma.properties.types";
import { tokenizeStyles } from "../transformers/style.transformer";

const logger = Logger({
  spacing: 1,
  throwOnError: true,
  mode: "simple"
})
const { info, debug, warn, error, log, } = logger;

const fetchAndFormatTeamStyles = async (figmaApiClient: FigmaApiClient, teamId: FigmaTeamId, fileKeyFilters?: FigmaFileKey[]) => {
  debug("Fetching team styles...")
  const teamStylesResponse = await figmaApiClient.getTeamStyles(teamId, {
    page_size: 10000,
  });
  const teamStyles = teamStylesResponse?.meta.styles;
  if (!teamStyles ?? teamStyles.length === 0) {
    logger.warn("No styles found for team")
    return;
  }
  // restrict to design system & client types
  debug("Extracting Ublo team styles...");
  const filteredStyles = fileKeyFilters && fileKeyFilters.length > 0
    ? teamStyles.filter(teamStyle => fileKeyFilters.includes(teamStyle.file_key))
    : teamStyles;
  log(filteredStyles)
  info("Fetched team styles")
  const tokens = await tokenizeStyles(figmaApiClient, filteredStyles, logger);
}

const updateTeamStyles = async (figmaApiClient: FigmaApiClient, teamId: FigmaTeamId, fileKeyFilters?: FigmaFileKey[]) => {
  info("Staring team styles update...")
  await fetchAndFormatTeamStyles(figmaApiClient, teamId, fileKeyFilters);
}

/**
 * Fetches up to date figma files and Updates exported theme values.
 */
const main = async () => {
  debug("Validating config...");
  const config = validateConfig({
    FIGMA_TOKEN,
    FILE_URL_DESIGN_SYSTEM,
    FILE_URL_CLIENT_THEMES,
    FIGMA_TEAM_ID,
  }, logger)
  info("Config validated");
  debug("Initializing Figma API client...")
  const figmaApiClient = new FigmaApiClient(config.FIGMA_TOKEN);
  info("Figma API client initialized");
  await updateTeamStyles(figmaApiClient, config.FIGMA_TEAM_ID, [
    extractFileKeyFromUrl(config.FILE_URL_DESIGN_SYSTEM),
    extractFileKeyFromUrl(config.FILE_URL_CLIENT_THEMES),
  ])
  // debug("Fetching design system file...");
  // const designSystemFile = await figmaApiClient.getFile(extractFileKeyFromUrl(config.FILE_URL_DESIGN_SYSTEM));
  // log(designSystemFile);
}

main();