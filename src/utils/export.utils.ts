export const LIB_INDEX = "./lib/index.ts"
export const LIB_COLLECTION = "./lib/tokens.collection.ts"
export const LIB_TOKENS = "./lib/tokens.all.ts"
export const LIB_VALUES = "./lib/tokens.values.ts"

const TS_CONST_TEMPLATE = (constName: string) => `export const ${constName}`


export const writeFile = async (path: string, data: string) => {
  await Bun.write(path, data)
}

export const tsConst = (
  constName: string,
  constValue: object
) => {
  const constValueStr = JSON.stringify(constValue, null, 2);
  return `${TS_CONST_TEMPLATE(constName)} = ${constValueStr}`
}

export const tsReadonlyConst = (
  constName: string,
  constValue: object,
) => {
  return `${tsConst(constName, constValue)} as const;`
}

export const tsFileData = (strings: string[]) => {
  return strings.join("\n\n");
}

