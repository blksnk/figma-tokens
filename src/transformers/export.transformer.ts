// functions in this file are used to convert token data to a typescript file

import {
  FileDescription,
  RootTokenCollection,
  Token,
  TokenValues
} from "../types/global/export.types";
import {
  LIB_COLLECTION,
  LIB_INDEX, LIB_TOKENS, LIB_VALUES,
  tsFileData, tsReadonlyConst,
  writeFile
} from "../utils/export.utils";
import { Logger } from "../utils/log.utils";

export const stringifyRootCollection = (rootCollection: RootTokenCollection) => {
  const constants = Object.entries(rootCollection)
    .map(([constName, value]) => tsReadonlyConst(constName, value))
  return tsFileData(constants);
}

export const stringifyTokenValues = (tokenValues: TokenValues) => {
  const constants = Object.entries(tokenValues)
    .map(([constName, value]) => tsReadonlyConst(constName, value));
  return tsFileData(constants);
}

export const stringifyTokens = (tokens: Token[]) => {
  return tsReadonlyConst("tokens", tokens);
}

export const generateLibIndex = (
  files: FileDescription[],
): FileDescription => {
  const content = tsFileData(files.map(({ path }) => {
    const localPath = path.split("/lib").join("").split(".ts")[0];
    return `export * from "${localPath}";`
  }));
  return {
    path: LIB_INDEX,
    content,
  };
}

export const generateLibRootTokenCollection = (
  rootCollection: RootTokenCollection,
): FileDescription => {
  return {
    path: LIB_COLLECTION,
    content: stringifyRootCollection(rootCollection),
  };
}

export const generateLibTokenValues = (
  tokenValues: TokenValues,
): FileDescription => {
  return {
    path: LIB_VALUES,
    content: stringifyTokenValues(tokenValues),
  };
}

export const generateLibAllTokens = (
  allTokens: Token[],
): FileDescription => {
  return {
    path: LIB_TOKENS,
    content: stringifyTokens(allTokens),
  };
}

export const generateMultipleFiles = async (
  fileDescriptions: FileDescription[],
  logger = Logger(),
) => {
  logger.info(`Generating ${fileDescriptions.length} files: ${
    fileDescriptions
      .map(({ path }) => path)
      .join(", ")
  }`)
  try {
    await Promise.all(fileDescriptions.map(({ path, content}) => {
      logger.info(`Generating ${path}...`)
      return writeFile(path, content);
    }))
    logger.info(`Generated ${fileDescriptions.length} files.`)
  } catch(e) {
    logger.error(e)
  }
}

export const generateExportedTS = async (
  rootCollection: RootTokenCollection,
  tokenValues: TokenValues,
  allTokens: Token[],
  logger = Logger(),
) => {
  logger.info("Constructing file data...")
  let libFiles = [
    generateLibAllTokens(allTokens),
    generateLibRootTokenCollection(rootCollection),
    generateLibTokenValues(tokenValues),
  ]
  libFiles = [
    ...libFiles,
    generateLibIndex(libFiles),
  ]

  await generateMultipleFiles(libFiles);
}