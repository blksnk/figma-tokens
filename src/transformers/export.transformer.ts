// functions in this file are used to convert token data to a typescript file

import {
  RootTokenCollection,
  Token,
  TokenValues
} from "../types/global/export.types";
import {
  LIB_INDEX,
  tsConst,
  tsFileData,
  writeFile
} from "../utils/export.utils";
import { Logger } from "../utils/log.utils";

const TS_CONST_TEMPLATE = (constName: string) => `export const ${constName} = `

export const stringifyRootCollection = (rootCollection: RootTokenCollection) => {
  const constants = Object.entries(rootCollection).map(([constName, value]) => tsConst(constName, value))
  return tsFileData(constants);
}

export const stringifyTokenValues = (tokenValues: TokenValues) => {
  const constants = Object.entries(tokenValues).map(([constName, value]) => tsConst(constName, value));
  return tsFileData(constants);
}

export const stringifyTokens = (tokens: Token[]) => {
  return tsConst("tokens", tokens);
}

export const generateExportedTS = async (
  rootCollection: RootTokenCollection,
  tokenValues: TokenValues,
  allTokens: Token[],
  logger = Logger(),
) => {
  logger.info("Converting tokens to string...")
  const tokenValuesStr = stringifyTokenValues(tokenValues);
  const rootCollectionStr = stringifyRootCollection(rootCollection);
  const allTokensStr = stringifyTokens(allTokens)


  logger.info("Constructing file data...")
  const fileStr = tsFileData([
    tokenValuesStr,
    rootCollectionStr,
    allTokensStr
  ])
  logger.info(`Writing contents to ${LIB_INDEX}`)
  try {
    await writeFile(LIB_INDEX, fileStr);
    logger.info("Done !")
  }
  catch (e) {
    logger.error(e)
  }
}