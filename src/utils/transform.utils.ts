/**
 * Transforms an object by applying a transformer function to each item and an optional key transformer function to each key.
 *
 * @template TObj {Record<string, unknown>}
 * @param {Record<string, infer TItem>} object - The object to be transformed.
 * @param {((item: infer T extends TObj[keyof TObj]) => infer V)} itemTransformer - The function to transform each item in the object.
 * @param {((key: string) => string)?} keyTransformer - (Optional) The function to transform each key in the object.
 * @return {Record<string, ReturnType<TTransformer>>} - The transformed object.
 */
export const transformObject = <
  TObj extends Record<string, unknown>,
  TTransformedKey extends string = keyof TObj & string,
  TTransformedItem = TObj[keyof TObj & string]
>(
  object: TObj,
  itemTransformer: (item: TObj[keyof TObj & string]) => TTransformedItem,
  keyTransformer?: (key: keyof TObj & string) => TTransformedKey
): typeof keyTransformer extends undefined
  ? {
      [k in keyof TObj]: TTransformedItem;
    }
  : {
      [Key in TTransformedKey]: TTransformedItem;
    } => {
  const objectEntries = Object.entries(object) as [
    keyof TObj & string,
    TObj[keyof TObj & string]
  ][];
  const transformedEntries = objectEntries.map(([key, value]) => [
    keyTransformer ? keyTransformer(key) : key,
    itemTransformer(value),
  ]);
  if (keyTransformer) {
    return Object.fromEntries(transformedEntries);
  }
  return Object.fromEntries(transformedEntries);
};
