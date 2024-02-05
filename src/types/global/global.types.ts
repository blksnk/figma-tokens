export type * from "@ubloimmo/front-util";

/**
 * Replaces a specific key in an object with a new value;
 */
export type Replace<
  TObj extends Record<string, unknown>,
  TKey extends keyof TObj & string,
  TValue
> = Omit<TObj, TKey> & {
  [Key in TKey]: TValue;
};
