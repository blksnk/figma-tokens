export const LIB_INDEX = "./lib/index.ts"
export const LIB_COLLECTION = "./lib/tokens.collection.ts"
export const LIB_TOKENS = "./lib/tokens.all.ts"
export const LIB_VALUES = "./lib/tokens.values.ts"

export const UPDATE_OUTPUT = "./temp/output.json";

const TS_CONST_TEMPLATE = (constName: string) => `export const ${constName}`

/**
 * Writes data to a file at the specified path.
 *
 * @param {string} path - The path of the file to write to.
 * @param {string} data - The data to write to the file.
 * @return {Promise<void>} A promise that resolves when the data has been written to the file.
 */
export const writeFile = async (path: string, data: string) => {
  await Bun.write(path, data)
}

/**
 * Reads the contents of a file and returns it as a string.
 *
 * @param {string} path - The path of the file to read.
 * @return {Promise<string>} A promise that resolves to the contents of the file as a string.
 */
export const readFile = async (path: string): Promise<string> => {
  const file = Bun.file(path)
  return await file.text();
};

/**
 * Generates a TypeScript constant declaration with the given name and value.
 *
 * @param {string} constName - The name of the constant.
 * @param {object} constValue - The value of the constant.
 * @returns {string} The TypeScript constant declaration.
 */
export const tsConst = (
  constName: string,
  constValue: object
) => {
  const constValueStr = JSON.stringify(constValue, null, 2);
  return `${TS_CONST_TEMPLATE(constName)} = ${constValueStr}`
}

/**
 * Generates a readonly constant in TypeScript using {@link tsConst}.
 *
 * @param {string} constName - The name of the constant.
 * @param {object} constValue - The value of the constant.
 * @return {string} - The readonly constant as a string.
 */
export const tsReadonlyConst = (
  constName: string,
  constValue: object,
) => {
  return `${tsConst(constName, constValue)} as const;`
}

export const tsFileData = (strings: string[]) => {
  return strings.join("\n\n");
}

