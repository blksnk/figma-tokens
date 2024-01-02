/**
 * Transforms an object by applying a transformer function to each item and an optional key transformer function to each key.
 *
 * @param {Record<string, infer TItem>} object - The object to be transformed.
 * @param {((item: infer T extends TObj[keyof TObj]) => infer V)} itemTransformer - The function to transform each item in the object.
 * @param {((key: string) => string)?} keyTransformer - (Optional) The function to transform each key in the object.
 * @return {Record<string, ReturnType<TTransformer>>} - The transformed object.
 */
export const transformObject = <
  TObj extends Record<string, infer TItem>,
  TTransformer extends ((item: infer T extends TObj[keyof TObj]) => infer V)
>(object: TObj,
  itemTransformer: TTransformer,
  keyTransformer?: ((key: string) => string)
): Record<string, ReturnType<TTransformer>> => {
  return Object.fromEntries(
    Object.entries(object)
      .map(([key, value]) => [
        keyTransformer ? keyTransformer(key) : key,
        itemTransformer(value)
      ])
  )
}