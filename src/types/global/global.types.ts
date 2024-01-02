/**
 * Represents a type that can be either the specified type or null.
 * @template T - The specified type.
 * @typedef {T | null} Nullable
 */
export type Nullable<T> = T | null;

/**
 * Represents a type that can be either the specified type or undefined.
 * @template T - The specified type.
 * @typedef {T | undefined} Optional
 */
export type Optional<T> = T | undefined;

/**
 * Represents a type that can be either the specified type, null, or undefined.
 * @template T - The specified type.
 * @typedef {Optional<Nullable<T>>} Nullish
 */
export type Nullish<T> = Optional<Nullable<T>>;

/**
 * Represents a type that excludes null from the specified type.
 * @template T - The specified type.
 * @typedef {Exclude<T, null>} NonNullable
 */
export type NonNullable<T> = Exclude<T, null>;

/**
 * Represents a type that excludes undefined from the specified type.
 * @template T - The specified type.
 * @typedef {Exclude<T, undefined>} NonNullable
 */
export type NonOptional<T> = Exclude<T, undefined>;

/**
 * Represents a type that excludes null and undefined from the specified type.
 * @template T - The specified type.
 * @typedef {NonNullable<NonOptional<T>>} NonNullish
 */
export type NonNullish<T> = NonNullable<NonOptional<T>>;

/**
 * Represents a type that makes all properties of an object required, recursively.
 * @template T - The specified type.
 * @typedef {T extends object ? {[TKey in keyof T]-?: T[TKey]} : T} DeepRequired
 */
export type DeepRequired<T> = T extends object ? {
  [TKey in keyof T]-?: T[TKey];
} : T;

/**
 * Represents a type that excludes null and undefined from all properties of an object, recursively.
 * @template T - The specified type.
 * @typedef {T extends object ? {[TKey in keyof T]: DeepNonNullable<T[TKey]>} : NonNullable<T>} DeepNonNullable
 */
export type DeepNonNullable<T> = T extends object ? {
  [TKey in keyof T]: DeepNonNullable<T[TKey]>;
} : NonNullable<T>

/**
 * Represents a type that excludes undefined from all properties of an object, recursively.
 * @template T - The specified type.
 * @typedef {T extends object ? {[TKey in keyof T]: DeepNonOptional<T[TKey]>} : NonOptional<T>} DeepNonOptional
 */
export type DeepNonOptional<T> = T extends object ? {
  [TKey in keyof T]: DeepNonOptional<T[TKey]>;
} : NonOptional<T>

/**
 * Represents a type that excludes null and undefined recursively from all properties of an object.
 * @template T - The specified type.
 * @typedef {T extends object ? {[TKey in keyof T]: DeepNonNullish<T[TKey]>} : NonNullish<T>} DeepNonNullish
 */
export type DeepNonNullish<T> = T extends object ? DeepRequired<{
  [TKey in keyof T]: DeepNonNullish<T[TKey]>;
}> : NonNullish<T>;
