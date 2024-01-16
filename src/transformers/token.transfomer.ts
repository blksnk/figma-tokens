import { StyleNode } from "../types/global/transformer.types";
import {
  FigmaStyleTypeToToken,
  RootTokenCollection,
  Token,
  TokenGroup,
  TokenOrGroupCollection,
  TokenOrTokenGroup,
  TokenType,
  tokenTypes,
  TokenValues,
} from "../types/global/export.types";
import {
  FigmaPaintType,
  FigmaStyleType,
} from "../types/figma/figma.enums.types";
import { Nullable } from "../types/global/global.types";
import { stringifyCssRules, styleNodeToCssRules } from "./css.transformer";
import { Logger } from "../utils/log.utils";
import { transformObject } from "../utils/transform.utils";
import { camelCase, saneCamel, sanitize } from "../utils/string.utils";
import { Optional, isString } from "@ubloimmo/front-util";

const paintTypeToTokenTypeMap: Record<FigmaPaintType, Nullable<TokenType>> = {
  GRADIENT_ANGULAR: "GRADIENT",
  GRADIENT_RADIAL: "GRADIENT",
  GRADIENT_DIAMOND: "GRADIENT",
  GRADIENT_LINEAR: "GRADIENT",
  IMAGE: "ASSET",
  VIDEO: "ASSET",
  EMOJI: null,
  SOLID: "COLOR",
} as const;

const styleTypeToTokenTypeMap: Record<FigmaStyleType, Nullable<TokenType>> = {
  GRID: null,
  EFFECT: "EFFECT",
  TEXT: "TEXT",
  FILL: "COLOR",
};

/**
 * Determines the type of token based on the given style node.
 *
 * @template TStyleType {FigmaStyleType}
 * @param {StyleNode<TStyleType>} styleNode - The style node object containing the type and style properties.
 * @return {Nullable<TokenType>} The type of token, or null if it cannot be determined.
 */
const tokenType = <TStyleType extends FigmaStyleType>(
  styleNode: StyleNode<TStyleType>
): Nullable<TokenType> => {
  let tokenType = styleTypeToTokenTypeMap[styleNode.type];
  // if we have a color token, we refine it based on its style properties
  if (tokenType === "COLOR") {
    const paintType = (styleNode as StyleNode<"FILL">).styleProperties.type;
    tokenType = paintTypeToTokenTypeMap[paintType];
  }
  return tokenType;
};

/**
 * Maps a token style to the style property that holds its main value.
 * Properties starting with index 1 are fallbacks.
 */
const tokenValueFallbackMap: Record<TokenType, (keyof CSSStyleDeclaration)[]> =
  {
    COLOR: ["background"],
    GRADIENT: ["background"],
    ASSET: ["background"],
    EFFECT: ["boxShadow", "textShadow", "filter", "backdropFilter"],
    TEXT: ["fontSize"],
  };

/**
 * Returns the value of a given token based on its type and style.
 *
 * @param {TokenType} tokenType - The type of the token.
 * @param {Partial<CSSStyleDeclaration>} tokenStyle - The style of the token.
 * @return {Nullable<string>} The value of the token, or null if not found.
 */
const tokenValue = (
  tokenType: TokenType,
  tokenStyle: Partial<CSSStyleDeclaration>
): Nullable<string> => {
  const properties = tokenValueFallbackMap[tokenType];
  for (let i = 0; i < properties.length; i++) {
    const propValue = tokenStyle[properties[i]];
    if (isString(propValue)) return propValue;
  }
  return null;
};

/**
 * Converts a style node to a token.
 *
 * @param {StyleNode<TStyleType>} styleNode - The style node to convert to a token.
 * @param {Logger} [logger=Logger()] - The logger to use for warning messages. Defaults to a new instance of Logger.
 * @return {Nullable<FigmaStyleTypeToToken<Token, typeof styleNode.nodeType>>} - The converted token, or null if the style node is not supported.
 */
export const styleNodeToToken = <TStyleType extends FigmaStyleType>(
  styleNode: StyleNode<TStyleType>,
  logger: Logger = Logger()
): Nullable<FigmaStyleTypeToToken<TStyleType>> => {
  const type = tokenType(styleNode);
  if (!type) {
    logger.warn(
      `Style node with key ${styleNode.styleKey} type ${styleNode.type} is not supported. Skipping.`
    );
    return null;
  }
  const tokenCssRules = styleNodeToCssRules(styleNode);
  const tokenCss = tokenCssRules
    ? {
        style: tokenCssRules,
        rules: stringifyCssRules(tokenCssRules),
      }
    : undefined;

  const value = tokenCssRules ? tokenValue(type, tokenCssRules) : null;

  const name = sanitize(styleNode.name)
    .split("/")
    .map((part) => camelCase(part))
    .join("/");

  return {
    name,
    type,
    value,
    css: tokenCss,
  } as Nullable<FigmaStyleTypeToToken<TStyleType>>;
};

/**
 * Groups the given array of tokens by name and returns a collection of tokens and token groups.
 * The function takes an optional logger object for logging messages.
 *
 * The function first sorts the tokens based on their nesting level (depth of the token name).
 * It then maps each token to a simplified object with the name set to the last segment of the path.
 *
 * If there are no tokens with nesting, an empty group is returned.
 * If there is only one level of nesting, a group is created using the token name as the key and the token as the value.
 *
 * For deeper nesting, the function creates a `slices` object to represent the nested structure.
 * It uses the `findNestedSlice` helper function to find the appropriate nested slice for a given path.
 *
 * Finally, the function iterates through the token paths and creates the nested token structure using the `nestToken` helper function.
 * The resulting group object contains all the tokens and token groups grouped by their paths.
 *
 * @param {Token[]} tokens - An array of tokens to be grouped.
 * @param {Logger} logger - (Optional) A logger object for logging messages.
 * @return {TokenOrGroupCollection} - A collection of tokens and token groups.
 */
export const groupTokensByName = (
  tokens: Token[],
  logger = Logger()
): TokenOrGroupCollection => {
  const splitTokenName = (token: Token) => token.name.split("/");
  let groups: TokenOrGroupCollection = {};
  // sort tokens by nesting
  const sortedTokens = tokens.sort((a, b) => {
    const aPathLength = splitTokenName(a).length;
    const bPathLength = splitTokenName(b).length;
    return aPathLength === bPathLength ? 0 : aPathLength > bPathLength ? -1 : 1;
  });

  const tokenPaths = sortedTokens.map((token) => ({
    path: splitTokenName(token),
    token: {
      ...token,
      name: splitTokenName(token).reverse()[0],
    },
  }));
  // abort early if no nesting
  const maxTokenPathLength = tokenPaths.reduce(
    (acc: number, { path }) => Math.max(path.length, acc),
    0
  );
  if (maxTokenPathLength === 0) return groups;
  if (maxTokenPathLength === 1) {
    return Object.fromEntries(
      sortedTokens.map((token): [string, Token] => [token.name, token])
    );
  }

  let slices: TokenOrGroupCollection = {};

  /**
   * Finds a nested slice in the given slice.
   *
   * @param {string[]} slice - The slice to search in.
   * @return {Nullable<TokenOrGroupCollection>} The nested slice if found, otherwise null.
   */
  const findNestedSlice = (slice: string[]) => {
    logger.debug(`Finding slice "${slice.join(", ")}"`);
    let temp: Nullable<TokenOrGroupCollection> = slices;
    for (let i = 0; i < slice.length; i++) {
      const currentSlicePath = slice[i];
      const candidate: Optional<TokenOrTokenGroup> = temp[currentSlicePath];
      temp = candidate?.tokens ?? null;
      if (temp === null) return null;
    }
    return temp;
  };

  /**
   * Generates a nested token based on a given token path.
   *
   * @param {{path: string[], token: Token }} tokenPath - The token path containing the path and the token.
   * @return {TokenOrGroupCollection} The nested token generated from the token path.
   */
  const nestToken = (tokenPath: { path: string[]; token: Token }) => {
    const items = tokenPath.path.reverse();
    const nestedToken = items.reduce(
      (acc, part, level): TokenOrGroupCollection => {
        const currentSlicePath = items.slice(level + 1).reverse();
        const otherSlice =
          currentSlicePath.length === 0
            ? null
            : findNestedSlice(currentSlicePath);

        return {
          ...(otherSlice || {}),
          [part]:
            level === 0
              ? tokenPath.token
              : {
                  name: camelCase(part),
                  type: tokenPath.token.type,
                  tokens: acc,
                },
        };
      },
      {}
    );
    // assign to slices
    slices = {
      ...slices,
      ...nestedToken,
    };
    return nestedToken;
  };
  // group all tokens paths
  groups = Object.assign(
    {},
    ...tokenPaths.map((tokenPath) => nestToken(tokenPath))
  );

  return groups;
};

/**
 * Groups an array of tokens by their type.
 *
 * @param {Token[]} tokens - The array of tokens to be grouped.
 * @return {Record<TokenType, Token[]>} The grouped tokens, where the keys are the token types and the values are arrays of tokens.
 */
export const groupTokensByType = (tokens: Token[]) => {
  return tokens.reduce<Record<TokenType, Token[]>>(
    <TType extends TokenType>(
      acc: Record<TType, Token<TType>[]>,
      token: Token<TType>
    ) => {
      acc[token.type].push(token);
      return acc;
    },
    Object.fromEntries(
      tokenTypes.map((tokenType: TokenType) => [tokenType, [] as Token[]])
    ) as Record<TokenType, Token[]>
  );
};

/**
 * Groups the given tokens by name and type.
 *
 * @param {Token[]} tokens - The array of tokens to be grouped.
 * @param {Logger} [logger=Logger()] - The logger to use for logging information.
 * @return {RootTokenCollection} - The grouped tokens.
 */
export const groupTokens = (
  tokens: Token[],
  logger: Logger = Logger()
): RootTokenCollection => {
  logger.info(`Grouping ${tokens.length} tokens by name and type...`);
  const tokensByType = groupTokensByType(tokens);
  const tokensByTypeAndName = Object.fromEntries<TokenOrGroupCollection>(
    Object.entries(tokensByType).map(
      (group): [TokenType, TokenOrGroupCollection] => [
        group[0] as TokenType,
        groupTokensByName(group[1], logger),
      ]
    )
  ) as Record<TokenType, TokenOrGroupCollection>;
  const groupCount = Object.keys(tokensByTypeAndName).length;
  logger.info(`Created ${groupCount} groups from ${tokens.length} tokens.`);
  return tokensByTypeAndName;
};

/**
 * Predicate that checks if the given data is a Token.
 *
 * @param {TokenGroup | Token | TokenOrGroupCollection} data - The data to be checked.
 * @return {boolean} True if the data is a Token, false otherwise.
 */
const isToken = (
  data: TokenGroup | Token | TokenOrGroupCollection
): data is Token => {
  return data && isString(data?.type) && tokenTypes.includes(data.type);
};

/**
 * Predicate that checks if the given data is a TokenGroup.
 *
 * @param {TokenGroup | Token | TokenOrGroupCollection} data - The data to be checked.
 * @returns {boolean} True if the data is a TokenGroup, false otherwise.
 */
const isTokenGroup = (
  data: TokenGroup | Token | TokenOrGroupCollection
): data is TokenGroup => {
  return data && !!data.tokens && typeof data.tokens === "object";
};

/**
 * Unwraps a token or a collection of tokens.
 * If the input is a token group, it recursively unwraps each token in the group.
 * If the input is a token, it returns the token itself.
 * If the input is a collection of tokens, it recursively unwraps each token in the collection.
 *
 * @param {TokenGroup | Token | TokenOrGroupCollection} tokenOrCollection - The token or collection of tokens to unwrap.
 * @return {TokenValues | Token} - The unwrapped token or collection of tokens.
 */
const unwrapTokenOrGroup = (
  tokenOrCollection: TokenGroup | Token | TokenOrGroupCollection
): TokenValues | Token => {
  // token group
  if (isTokenGroup(tokenOrCollection)) {
    return transformObject(
      tokenOrCollection.tokens,
      unwrapTokenOrGroup,
      saneCamel
    );
  }
  // token
  if (isToken(tokenOrCollection)) {
    return tokenOrCollection;
  }
  // token collection
  return transformObject(tokenOrCollection, unwrapTokenOrGroup, saneCamel);
};

/**
 * Extracts the token values from the root token collection.
 *
 * @param {RootTokenCollection} rootTokenCollection - The root token collection to extract values from.
 * @param {Logger} logger - (Optional) The logger to use for logging progress and information. Defaults to a new Logger instance.
 * @return {TokenValues} The extracted token values.
 */
export const unwrapTokenValues = (
  rootTokenCollection: RootTokenCollection,
  logger: Logger = Logger()
): TokenValues => {
  logger.info("Extracting token values...");
  const typeToKey = (type: string) => `${type.toLowerCase()}s`;
  const rootCollectionValues = transformObject(
    rootTokenCollection,
    unwrapTokenOrGroup,
    typeToKey
  );
  logger.info("Done.");
  return rootCollectionValues;
};
