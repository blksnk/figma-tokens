import { LIB_TOKENS, readFile } from "../utils/export.utils";
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

const getNewVersion = (previousVersion: string) => {

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

  return {
    addedTokens,
    removedTokens,
    updatedTokens,
  }
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
  logger.debug(diffs)
}

update();