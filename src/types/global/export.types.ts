import { FigmaPaintType, FigmaStyleType } from "../figma/figma.enums.types";
import { FigmaNodeId } from "../figma/figma.properties.types";
import { Nullable } from "./global.types";

/**
 * Represents the possible types for a token. Derived from {@link FigmaStyleType}
 */
export const tokenTypes = [
  "TEXT",
  "COLOR",
  "GRADIENT",
  "ASSET",
  "EFFECT",
] as const;

export type TokenType = (typeof tokenTypes)[number];

/**
 * Represents a mapping from Figma style type to token type.
 */
export type FigmaStyleTypeToToken<
  TStyleType extends FigmaStyleType,
  TPaintType extends FigmaPaintType | never = never
> = TStyleType extends "TEXT"
  ? Token<"TEXT">
  : TStyleType extends "EFFECT"
  ? Token<"EFFECT">
  : TStyleType extends "FILL"
  ? TPaintType extends "SOLID"
    ? Token<"COLOR">
    : TPaintType extends
        | "GRADIENT_LINEAR"
        | "GRADIENT_RADIAL"
        | "GRADIENT_ANGULAR"
        | "GRADIENT_DIAMOND"
    ? Token<"GRADIENT">
    : TPaintType extends "IMAGE" | "VIDEO"
    ? Token<"ASSET">
    : Token
  : Token;

/**
 * Represents a token with a specific type, including CSS style and rules.
 */
export type Token<TType extends TokenType = TokenType> = {
  name: string;
  type: TType;
  css?: {
    style: Partial<CSSStyleDeclaration>;
    rules: string;
  };
  value?: Nullable<string>;
  tokens?: never;
};

/**
 * Represents a union type that can be either a single token or a group of tokens.
 * @typedef {Token | TokenGroup} TokenOrTokenGroup
 */
export type TokenOrTokenGroup<TType extends TokenType = TokenType> =
  | Token<TType>
  | TokenGroup<TType>;

/**
 * Represents a collection of tokens or token groups, mapped by their type.
 */
export type TokenOrGroupCollection<TType extends TokenType = TokenType> =
  Record<string, TokenOrTokenGroup<TType>>;

/**
 * Represents an object that contains {@link TokenOrGroupCollection}s
 */
export type RootTokenCollection = Record<string, TokenOrGroupCollection>;

/**
 * Represents a group of tokens.
 */
export type TokenGroup<
  TType extends TokenType = TokenType,
  TName extends string = string
> = {
  name: TName;
  type: TType;
  tokens: TokenOrGroupCollection<TType>;
};

/**
 * Represents a nested object that contains token values.
 */
export type TokenValues = {
  [k: string]: Token | TokenValues;
};

/**
 * Represents a file description with its path and content.
 */
export type FileDescription = {
  /**
   * Path of the file
   */
  path: string;
  /**
   * String content of the file
   */
  content: string;
};

export type Icon = {
  componentName: string;
  name: string;
  nodeId: FigmaNodeId;
  svg: string;
  unknown?: boolean;
};

export type IconCollection = Record<string, Icon>;
