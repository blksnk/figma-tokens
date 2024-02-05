import { LIB_TOKENS, UPDATE_OUTPUT, writeFile } from "../utils/export.utils";
import { Logger } from "../utils/log.utils";
import { Icon, Token } from "../types/global/export.types";
import { generate } from "./generate";

const logger = Logger();

/**
 * Fetches the previously generated tokens.
 *
 * @return {Promise<Token[]>} Promise that resolves to an array of Token objects.
 */
const fetchPreviousTokens = async (): Promise<Token[]> => {
  logger.info("Fetching previouly generated tokens...");
  try {
    const { tokens } = await import(`../.${LIB_TOKENS}`);
    logger.info(`Found ${tokens.length} previously generated tokens.`);
    return [...tokens] as Token[];
  } catch (e) {
    logger.warn("No previously generated tokens found");
    return [];
  }
};

/**
 * Fetches the previously generated icons.
 *
 * @return {Promise<Icon[]>} Array of previously generated icons
 */
const fetchPreviousIcons = async (): Promise<Icon[]> => {
  logger.info("Fetching previouly generated icons...");
  try {
    const { icons } = await import(`../.${LIB_TOKENS}`);
    logger.info(`Found ${icons.length} previously generated icons.`);
    return [...icons] as Icon[];
  } catch (e) {
    logger.warn("No previously generated icons found");
    return [];
  }
};

/**
 * Retrieves the current version from the package.json file.
 *
 * @return {Promise<string>} The current version.
 */
const getCurrentVersion = async () => {
  const { version } = await import("../../package.json");
  return version;
};

/**
 * Increments the revision number of a given version.
 *
 * @param {string} currentVersion - The current version to increment.
 * @return {string} The updated version with the incremented revision number.
 *
 * @example
 * incrementRevision("1.2.3") // returns "1.2.4"
 * incrementRevision("1.9.9") // returns "1.9.10"
 * incrementRevision("2.0.0") // returns "2.0.1"
 */
const incrementRevision = (currentVersion: string) => {
  const [major, minor, revision] = currentVersion
    .split(".")
    .map((num) => parseInt(num));
  return [major, minor, revision + 1].map(String).join(".");
};

/**
 * Compares two arrays of tokens and returns the differences between them.
 *
 * @param {Token[]} previousTokens - The array of previous tokens.
 * @param {Token[]} freshTokens - The array of fresh tokens.
 * @return {Object} - An object containing the added tokens, removed tokens, updated tokens, and the total count of changes.
 */
const diffTokens = (previousTokens: Token[], freshTokens: Token[]) => {
  logger.info("Comparing new tokens to old tokens");
  const previousTokenNames = previousTokens.map(({ name }) => name);
  const freshTokenNames = freshTokens.map(({ name }) => name);

  const addedTokens = [...freshTokens].filter(
    (freshToken) => !previousTokenNames.includes(freshToken.name)
  );
  logger.info(`Generated ${addedTokens.length} new tokens.`);
  const removedTokens = [...previousTokens].filter(
    (prevToken) => !freshTokenNames.includes(prevToken.name)
  );
  logger.info(`Deleted ${removedTokens.length} previous tokens.`);
  const updatedTokens = [...freshTokens].filter((freshToken) => {
    const correspondingToken = previousTokens.find(
      (prevToken) => prevToken.name === freshToken.name
    );
    if (!correspondingToken) return false;
    return JSON.stringify(correspondingToken) !== JSON.stringify(freshToken);
  });
  logger.info(`Updated ${updatedTokens.length} existing tokens.`);
  const tokenChanges =
    addedTokens.length + removedTokens.length + updatedTokens.length;
  return {
    addedTokens,
    removedTokens,
    updatedTokens,
    tokenChanges,
  };
};

const diffIcons = (previousIcons: Icon[], freshIcons: Icon[]) => {
  logger.info("Comparing new icons to old icons");
  const previousIconIds = previousIcons.map(({ nodeId }) => nodeId);
  const freshIconIds = freshIcons.map(({ nodeId }) => nodeId);

  const addedIcons = [...freshIcons].filter(
    (freshIcon) => !previousIconIds.includes(freshIcon.nodeId)
  );
  logger.info(`Generated ${addedIcons.length} new icons.`);
  const removedIcons = [...previousIcons].filter(
    (prevIcon) => !freshIconIds.includes(prevIcon.nodeId)
  );
  logger.info(`Deleted ${removedIcons.length} previous icons.`);
  const updatedIcons = [...freshIcons].filter((freshIcon) => {
    const correspondingIcon = previousIcons.find(
      (prevIcon) => prevIcon.nodeId === prevIcon.nodeId
    );
    if (!correspondingIcon) return false;
    return JSON.stringify(correspondingIcon) !== JSON.stringify(freshIcon);
  });
  logger.info(`Updated ${updatedIcons.length} existing icons.`);
  const iconChanges =
    addedIcons.length + removedIcons.length + updatedIcons.length;
  return {
    addedIcons,
    removedIcons,
    updatedIcons,
    iconChanges,
  };
};

/**
 * Generates a commit message based on the differences between tokens and the version.
 *
 * @param {ReturnType<typeof diffTokens>} tokenDiffs - The differences between tokens.
 * @param {string} version - The version of the commit message.
 * @return {string} The generated commit message.
 */
const generateCommitMessage = (
  tokenDiffs: ReturnType<typeof diffTokens>,
  iconDiffs: ReturnType<typeof diffIcons>,
  version: string
) => {
  const prefix = `build(${version}):`;
  const titleParts: string[] = [];
  const changelogParts: string[] = [];

  /**
   * Adds a label and the number of tokens to the change log.
   *
   * @param {string} label - The label to add to the change log.
   * @param {Token[]} items - The tokens to add to the change log.
   * @return {void} This function does not return a value.
   */
  const addToChangeLog = (label: string, items: Token[] | Icon[]) => {
    if (items.length === 0) return;
    titleParts.push(`${label} ${items.length}`);
    const names = items.map(({ name }) => ` - ${name}`).join("\n");
    changelogParts.push(`${label} ${items.length}:\n${names}`);
  };

  if (tokenDiffs.tokenChanges) {
    changelogParts.push("Tokens\n\n");
    addToChangeLog("Updated", tokenDiffs.updatedTokens);
    addToChangeLog("Added", tokenDiffs.addedTokens);
    addToChangeLog("Removed", tokenDiffs.removedTokens);
  }

  if (iconDiffs.iconChanges) {
    changelogParts.push("\nIcons\n\n");
    addToChangeLog("Updated", iconDiffs.updatedIcons);
    addToChangeLog("Added", iconDiffs.addedIcons);
    addToChangeLog("Removed", iconDiffs.removedIcons);
  }

  const title = [prefix, titleParts.join(", ")].join(" ");
  const changelog = changelogParts.join("\n");

  return [title, changelog].join("\n\n");
};

/**
 * Writes the provided output object to a file.
 *
 * @param {object} output - The output object to be written.
 * @return {Promise<void>} - A promise that resolves once the write operation is complete.
 */
const writeOutput = async (output: object) => {
  await writeFile(UPDATE_OUTPUT, JSON.stringify(output));
};

/**
 * Generates a fresh batch of tokens from figma api
 * and compares them with previously generated tokens.
 *
 * @returns commit message for version bump
 */
export const update = async () => {
  const previousTokens = await fetchPreviousTokens();
  const previousIcons = await fetchPreviousIcons();
  const { tokens: freshTokens, icons: freshIcons } = await generate();
  const tokenDiffs = diffTokens(previousTokens, freshTokens);
  const iconDiffs = diffIcons(previousIcons, freshIcons);
  const currentVersion = await getCurrentVersion();

  if (!tokenDiffs.tokenChanges && !iconDiffs.iconChanges)
    return writeOutput({
      changes: false,
      version: currentVersion,
      message: null,
    });

  const version = incrementRevision(currentVersion);
  const message = generateCommitMessage(tokenDiffs, iconDiffs, version);

  return writeOutput({
    changes: true,
    version,
    message,
  });
};

await update();
