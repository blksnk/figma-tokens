import { RootTokenCollection, TokenValues } from "../types/global/export.types";

export const LIB_INDEX = "./lib/index.ts"
export const LIB_TOKENS = "./lib/tokens.ts"
export const LIB_VALUES = "./lib/values.ts"

export const writeFile = async (path: string, data: string) => {
  await Bun.write(path, data)
}

export const tsConst = (constName: string, constValue: object) => {
  const constValueStr = JSON.stringify(constValue, null, 2);
  return `export const ${constName} = ${constValueStr};`
}

export const tsFileData = (strings: string[]) => {
  return strings.join("\n\n");
}

