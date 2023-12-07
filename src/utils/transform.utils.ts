export const transformObject = <
  TObj extends Record<string, infer TItem>,
  TTransformer extends ((item: infer T extends TObj[keyof TObj]) => infer V)
>(object: TObj,
  itemTransformer: TTransformer,
  keyTransformer?: ((key: string) => string)
): Record<string, ReturnType<TTransformer>> => {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [keyTransformer ? keyTransformer(key) : key, itemTransformer(value)]))
}