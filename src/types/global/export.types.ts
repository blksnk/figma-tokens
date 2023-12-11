import { FigmaPaintType, FigmaStyleType } from "../figma/figma.enums.types";
import { Nullable } from "./global.types";

export const tokenTypes = [
  "TEXT",
  "COLOR",
  "GRADIENT",
  "ASSET",
  "EFFECT",
] as const;

export type TokenType = (typeof tokenTypes)[number];

export type FigmaStyleTypeToToken<TStyleType extends FigmaStyleType, TPaintType extends FigmaPaintType | never = never> =
  TStyleType extends "TEXT"
    ? Token<"TEXT">
    : TStyleType extends "EFFECT"
    ? Token<"EFFECT">
    : TStyleType extends "FILL"
    ? TPaintType extends "SOLID"
    ? Token<"COLOR">
    : TPaintType extends "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
    ? Token<"GRADIENT">
    : TPaintType extends "IMAGE" | "VIDEO"
    ? Token<"ASSET">
    : Token
    : Token;


export type Token<TType extends TokenType = TokenType> = {
  name: string;
  type: TType;
  css?: {
    style: Partial<CSSStyleDeclaration>;
    rules: string;
  }
  value?: Nullable<string>;
  tokens?: never;
}

export type TokenOrTokenGroup<TType extends TokenType = TokenType> = Token<TType> | TokenGroup<TType>;

export type TokenOrGroupCollection<TType extends TokenType = TokenType> = Record<string, TokenOrTokenGroup<TType>>;

export type RootTokenCollection = Record<string, TokenOrGroupCollection>;

export type TokenGroup<TType extends TokenType = TokenType, TName extends string = string> = {
  name: TName;
  type: TType;
  tokens: TokenOrGroupCollection<TType>;
}

export type TokenExports = {
  globalColors: TokenOrGroupCollection<"COLOR">;
  clientColors: TokenOrGroupCollection<"COLOR">;
  effects: TokenOrGroupCollection<"EFFECT">;
  gradients: TokenOrGroupCollection<"GRADIENT">;
  textStyles: TokenOrGroupCollection<"TEXT">;
  allTokens: TokenOrGroupCollection;
}

export type TokenValues = Record<string, Nullable<TokenValues | Token>>;

export type FileDescription = {
  /**
   * Path of the file
   */
  path: string;
  /**
   * String content of the file
   */
  content: string;
}
