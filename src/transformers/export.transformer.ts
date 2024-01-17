// functions in this file are used to convert token data to a typescript file

import {
  FileDescription,
  RootTokenCollection,
  Token,
  TokenValues,
} from "../types/global/export.types";
import {
  LIB_COLLECTION,
  LIB_INDEX,
  LIB_TOKENS,
  LIB_VALUES,
  tsFileData,
  tsReadonlyConst,
  writeFile,
} from "../utils/export.utils";
import { Logger } from "../utils/log.utils";

/**
 * Generate a string representation of the root collection.
 *
 * @param {RootTokenCollection} rootCollection - The root collection to stringify.
 * @return {string} The string representation of the root collection.
 */
export const stringifyRootCollection = (
  rootCollection: RootTokenCollection
) => {
  const constants = Object.entries(rootCollection).map(([constName, value]) =>
    tsReadonlyConst(constName, value)
  );
  return tsFileData(constants);
};

/**
 * Generates a string representation of the token values.
 *
 * @param {TokenValues} tokenValues - The token values to stringify.
 * @return {string} The string representation of the token values.
 */
export const stringifyTokenValues = (tokenValues: TokenValues) => {
  const constants = Object.entries(tokenValues).map(([constName, value]) =>
    tsReadonlyConst(constName, value)
  );
  return tsFileData(constants);
};

/**
 * Convert an array of tokens to a string representation.
 *
 * @param {Token[]} tokens - The array of tokens to stringify.
 * @return {string} The string representation of the tokens.
 */
export const stringifyTokens = (tokens: Token[]) => {
  return tsReadonlyConst("tokens", tokens);
};

/**
 * Generates the index file for the library.
 *
 * @param {FileDescription[]} files - The list of file descriptions.
 * @return {FileDescription} - The generated index file description.
 */
export const generateLibIndex = (files: FileDescription[]): FileDescription => {
  const content = tsFileData(
    files.map(({ path }) => {
      const localPath = path.split("/lib").join("").split(".ts")[0];
      return `export * from "${localPath}";`;
    })
  );
  return {
    path: LIB_INDEX,
    content,
  };
};

/**
 * Generates a FileDescription for the root token collection.
 *
 * @param {RootTokenCollection} rootCollection - The root token collection.
 * @return {FileDescription} The generated FileDescription.
 */
export const generateLibRootTokenCollection = (
  rootCollection: RootTokenCollection
): FileDescription => {
  return {
    path: LIB_COLLECTION,
    content: stringifyRootCollection(rootCollection),
  };
};

/**
 * Generates the file description for the given token values.
 *
 * @param {TokenValues} tokenValues - The token values to generate the description for.
 * @return {FileDescription} The generated file description.
 */
export const generateLibTokenValues = (
  tokenValues: TokenValues
): FileDescription => {
  return {
    path: LIB_VALUES,
    content: stringifyTokenValues(tokenValues),
  };
};

/**
 * Generates a `FileDescription` object for all tokens.
 *
 * @param {Token[]} allTokens - An array of tokens.
 * @return {FileDescription} The generated `FileDescription` object.
 */
export const generateLibAllTokens = (allTokens: Token[]): FileDescription => {
  return {
    path: LIB_TOKENS,
    content: stringifyTokens(allTokens),
  };
};

/**
 * Writes multiple files based on the provided file descriptions.
 *
 * @param {FileDescription[]} fileDescriptions - An array of objects containing information about the files to be written.
 * @param {Logger} logger - An optional logger object for logging messages.
 * @return {Promise<void>} A promise that resolves when all the files have been written.
 */
export const writeMultipleFiles = async (
  fileDescriptions: FileDescription[],
  logger = Logger()
) => {
  logger.info(
    `Generating ${fileDescriptions.length} files: ${fileDescriptions
      .map(({ path }) => path)
      .join(", ")}`
  );
  try {
    await Promise.all(
      fileDescriptions.map(({ path, content }) => {
        logger.debug(`Generating ${path}...`);
        return writeFile(path, content);
      })
    );
    logger.info(`Generated ${fileDescriptions.length} files.`);
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Generates the exported TypeScript files.
 * This function constructs the file data by generating the necessary TypeScript
 * for the root collection, token values, and all tokens.
 *
 * It then generates an index file that exports all the generated TypeScript files.
 * Finally, it uses the `writeMultipleFiles` function to write the multiple TypeScript files to `/lib`.
 *
 * @param {RootTokenCollection} rootCollection - The root token collection.
 * @param {TokenValues} tokenValues - The token values.
 * @param {Token[]} allTokens - The list of all tokens.
 * @param {Logger} [logger=Logger()] - The logger instance.
 * @returns {Promise<void>} A promise that resolves when the TypeScript files are generated.
 */
export const generateExportedTS = async (
  rootCollection: RootTokenCollection,
  tokenValues: TokenValues,
  allTokens: Token[],
  logger = Logger()
) => {
  logger.info("Constructing file data...");
  let libFiles = [
    generateLibAllTokens(allTokens),
    generateLibRootTokenCollection(rootCollection),
    generateLibTokenValues(tokenValues),
  ];
  libFiles = [...libFiles, generateLibIndex(libFiles)];

  await writeMultipleFiles(libFiles);
};
