import { LIB_TOKENS, UPDATE_OUTPUT, writeFile } from "../utils/export.utils";
import { Logger } from "../utils/log.utils";
import { Diff, Icon, Token } from "../types/global/export.types";
import { generate } from "./generate";
import { objectEntries } from "@ubloimmo/front-util";

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

type KeyOfType<TData extends Record<string, unknown>, TKeyType> = {
  [TKey in keyof TData & string]: TData[TKey] extends TKeyType ? TKey : never;
}[keyof TData & string];

const formatListLog = <TData extends Record<string, unknown>>(
  list: TData[],
  logKey: KeyOfType<TData, string | number>
) => list.map((item) => `          - "${item[logKey]}"`).join(",\n");

/**
 * Compares two arrays of objects and returns the added, removed, and updated items along with the total number of changes.
 *
 * @param {TData[]} previousData - array of previous data objects
 * @param {TData[]} freshData - array of fresh data objects
 * @param {keyof TData} compareKey - key to compare the data objects
 * @param {string} label - label for the data objects
 * @return {{ changes: number, added: TData[], removed: TData[], updated: TData[] }} object with changes, added, removed, and updated items
 */
const compareDiff = <TData extends Record<string, unknown>>(
  previousData: TData[],
  freshData: TData[],
  label: string,
  compareKey: keyof TData,
  logKey: KeyOfType<TData, string | number>
): Diff<TData> => {
  logger.info(`Comparing new ${label}s to old ${label}s`);
  const previousDataValues = previousData.map((data) => data[compareKey]);
  const freshDataValues = freshData.map((data) => data[compareKey]);

  const added = [...freshData].filter(
    (freshToken) => !previousDataValues.includes(freshToken[compareKey])
  );
  logger.info(
    `Generated ${added.length} new ${label}s.\n${formatListLog(added, logKey)}`
  );
  const removed = [...previousData].filter(
    (prevToken) => !freshDataValues.includes(prevToken[compareKey])
  );
  logger.info(
    `Removed ${removed.length} previous ${label}s.\n${formatListLog(
      removed,
      logKey
    )}`
  );
  const updated = [...freshData].filter((freshToken) => {
    const correspondingToken = previousData.find(
      (prevToken) => prevToken.name === freshToken.name
    );
    if (!correspondingToken) return false;
    return JSON.stringify(correspondingToken) !== JSON.stringify(freshToken);
  });
  logger.info(
    `Updated ${updated.length} existing ${label}s.\n ${formatListLog(
      updated,
      logKey
    )}`
  );

  const changes = added.length + removed.length + updated.length;

  return {
    changes,
    added,
    removed,
    updated,
  };
};

/**
 * Generates a commit message based on the differences between tokens and icons as well as the version.
 *
 * @param {Diff<Token>} tokenDiffs - The differences between tokens.
 * @param {Diff<Icon>} iconDiffs - The differences between icons.
 * @param {string} version - The version of the commit message.
 * @return {string} The generated commit message.
 */
const generateCommitMessage = (
  tokenDiffs: Diff<Token>,
  iconDiffs: Diff<Icon>,
  version: string
) => {
  const prefix = `build(${version}):`;
  const titleParts: string[] = [];
  const changelogParts: string[] = [];

  /**
   * A function that adds differences to the changelog.
   *
   * @param {Diff<TData>} diff - the differences to be added
   * @return {void} no return value
   */
  const addDiffToChangeLog = <TData extends Record<string, unknown>>({
    updated,
    added,
    removed,
    changes,
  }: Diff<TData>) => {
    if (!changes) return;
    objectEntries({ updated, added, removed }).forEach(([label, items]) => {
      if (items.length > 0) {
        titleParts.push(`${label} ${items.length}`);
        const names = items.map(({ name }) => ` - ${name}`).join("\n");
        changelogParts.push(`${label} ${items.length}:\n${names}`);
      }
    });
  };

  addDiffToChangeLog(tokenDiffs);
  addDiffToChangeLog(iconDiffs);

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
  const tokenDiffs = compareDiff(
    previousTokens,
    freshTokens,
    "token",
    "name",
    "name"
  );
  const iconDiffs = compareDiff(
    previousIcons,
    freshIcons,
    "icon",
    "nodeId",
    "name"
  );
  const currentVersion = await getCurrentVersion();

  if (!tokenDiffs.changes && !iconDiffs.changes)
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
