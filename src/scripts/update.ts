import {
  LIB_TOKENS,
  UPDATE_OUTPUT,
  writeFile
} from "../utils/export.utils";
import { Logger } from "../utils/log.utils";
import { Token } from "../types/global/export.types";
import { generate } from "./generate";

const logger = Logger();

/**
 * Fetches previously generated tokens
 */
const fetchPreviousTokens = async (): Promise<Token[]> => {
  logger.info("Fetching previouly generated tokens...")
  try {
    const { tokens } = await import(`../.${LIB_TOKENS}`);
    logger.info(`Found ${tokens.length} previously generated tokens.`)
    return [...tokens] as Token[];
  } catch(e) {
    logger.warn("No previously generated tokens found")
    return [];
  }
}

const getCurrentVersion = async () => {
  const { version } = await import("../../package.json");
  return version;
}

const incrementRevision = (currentVersion: string) => {
  let [major, minor, revision] = currentVersion.split('.').map(parseInt);
  revision++
  return [major, minor, revision].map(String).join('.');
}

const diffTokens = (previousTokens: Token[], freshTokens: Token[]) => {
  logger.info("Comparing new tokens to old tokens");
  const previousTokenNames = previousTokens.map(({ name }) => name);
  const freshTokenNames = freshTokens.map(({ name }) => name);

  const addedTokens = [...freshTokens].filter((freshToken) => !previousTokenNames.includes(freshToken.name))
  logger.info(`Generated ${addedTokens.length} new tokens.`)
  const removedTokens = [...previousTokens].filter((prevToken) => !freshTokenNames.includes(prevToken.name))
  logger.info(`Deleted ${removedTokens.length} previous tokens.`)
  const updatedTokens = [...freshTokens].filter((freshToken) => {
    const correspondingToken = previousTokens.find(prevToken => prevToken.name === freshToken.name)
    if (!correspondingToken) return false;
    return correspondingToken.value !== freshToken.value;
  })
  logger.info(`Updated ${updatedTokens.length} existing tokens.`)
  const changesCount = addedTokens.length + removedTokens.length + updatedTokens.length
  return {
    addedTokens,
    removedTokens,
    updatedTokens,
    changesCount,
  }
}

const generateCommitMessage = (diffs: ReturnType<typeof diffTokens>, version: string) => {
  const prefix = `build(${version}):`;
  const titleParts: string[] = [];
  const changelogParts: string[] = [];

  const addToChangeLog = (label: string, tokens: Token[]) => {
    if(tokens.length === 0) return;
    titleParts.push(`${label} ${tokens.length}`)
    const names = tokens.map(({ name }) => name).join(", ");
    changelogParts.push(`${label}: ${names}`);
  }

  addToChangeLog("Updated", diffs.updatedTokens)
  addToChangeLog("Added", diffs.addedTokens)
  addToChangeLog("Removed", diffs.removedTokens)

  const title = [prefix, titleParts.join(", ")].join(" ");
  const changelog = changelogParts.join("\n");

  return [title, changelog].join("\n\n");
}

const writeOutput = async (output: object) => {
  await writeFile(UPDATE_OUTPUT, JSON.stringify(output))
}

/**
 * Generates a fresh batch of tokens from figma api
 * and compares them with previously generated tokens.
 *
 * @returns commit message for version bump
 */
export const update = async () => {
  const previousTokens = await fetchPreviousTokens();
  const freshTokens = await generate();
  const diffs = diffTokens(previousTokens, freshTokens)
  const currentVersion = await getCurrentVersion()

  if (!diffs.changesCount) return writeOutput({
    changes: false,
    version: currentVersion,
    message: null,
  })

  const version = incrementRevision(currentVersion);
  const message = generateCommitMessage(diffs, version);

  return writeOutput({
    changes: true,
    version,
    message,
  })
}

await update();