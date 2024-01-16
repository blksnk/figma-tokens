import { LIB_TOKENS, UPDATE_OUTPUT, writeFile } from "../utils/export.utils";
import { Logger } from "../utils/log.utils";
import { Token } from "../types/global/export.types";
import { generate } from "./generate";

const logger = Logger();

/**
 * Fetches previously generated tokens
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
  let [major, minor, revision] = currentVersion
    .split(".")
    .map((num) => parseInt(num));
  revision++;
  return [major, minor, revision].map(String).join(".");
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
    return correspondingToken.value !== freshToken.value;
  });
  logger.info(`Updated ${updatedTokens.length} existing tokens.`);
  const changesCount =
    addedTokens.length + removedTokens.length + updatedTokens.length;
  return {
    addedTokens,
    removedTokens,
    updatedTokens,
    changesCount,
  };
};

/**
 * Generates a commit message based on the differences between tokens and the version.
 *
 * @param {ReturnType<typeof diffTokens>} diffs - The differences between tokens.
 * @param {string} version - The version of the commit message.
 * @return {string} The generated commit message.
 */
const generateCommitMessage = (
  diffs: ReturnType<typeof diffTokens>,
  version: string
) => {
  const prefix = `build(${version}):`;
  const titleParts: string[] = [];
  const changelogParts: string[] = [];

  /**
   * Adds a label and the number of tokens to the change log.
   *
   * @param {string} label - The label to add to the change log.
   * @param {Token[]} tokens - The tokens to add to the change log.
   * @return {void} This function does not return a value.
   */
  const addToChangeLog = (label: string, tokens: Token[]) => {
    if (tokens.length === 0) return;
    titleParts.push(`${label} ${tokens.length}`);
    const names = tokens.map(({ name }) => ` - ${name}`).join("\n");
    changelogParts.push(`${label}: ${names}`);
  };

  addToChangeLog("Updated", diffs.updatedTokens);
  addToChangeLog("Added", diffs.addedTokens);
  addToChangeLog("Removed", diffs.removedTokens);

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
  const freshTokens = await generate();
  const diffs = diffTokens(previousTokens, freshTokens);
  const currentVersion = await getCurrentVersion();

  if (!diffs.changesCount)
    return writeOutput({
      changes: false,
      version: currentVersion,
      message: null,
    });

  const version = incrementRevision(currentVersion);
  const message = generateCommitMessage(diffs, version);

  return writeOutput({
    changes: true,
    version,
    message,
  });
};

await update();
