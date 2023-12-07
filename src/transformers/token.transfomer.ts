import { StyleNode } from "../types/global/transformer.types";
import {
  FigmaStyleTypeToToken, RootTokenCollection,
  Token, TokenGroup, TokenOrGroupCollection,
  TokenType, tokenTypes, TokenValues
} from "../types/global/export.types";
import { FigmaStyleType } from "../types/figma/figma.enums.types";
import { Nullable, Optional } from "../types/global/global.types";
import { stringifyCssRules, styleNodeToCssRules } from "./css.transformer";
import { Logger } from "../utils/log.utils";
import { transformObject } from "../utils/transform.utils";

const tokenType = <TStyleType extends FigmaStyleType>({ type, styleProperties }: StyleNode<TStyleType>): Nullable<TokenType> => {
  if(type === "TEXT" || type === "EFFECT") return type;
  if(type === "FILL") {
    const paintType = (styleProperties as StyleNode<"FILL">["styleProperties"]).type
    switch (paintType) {
      case "GRADIENT_ANGULAR":
      case "GRADIENT_RADIAL":
      case "GRADIENT_DIAMOND":
      case "GRADIENT_LINEAR":
        return "GRADIENT";
      case "IMAGE":
      case "VIDEO":
        return "ASSET";
      case "SOLID":
        return "COLOR";
      default:
        return null;
    }
  }
}

const tokenValue = (tokenType: TokenType, tokenStyle: Partial<CSSStyleDeclaration>): Nullable<string> => {
  switch(tokenType) {
    case "COLOR":
    case "GRADIENT":
    case "ASSET":
      return tokenStyle.background ?? null;
    case "EFFECT":
      return tokenStyle.boxShadow ?? tokenStyle.textShadow ?? tokenStyle.filter ?? tokenStyle.backdropFilter ?? null;
    case "TEXT": return tokenStyle.fontSize ?? null;
  }
  return null
}

export const styleNodeToToken = <TStyleType extends FigmaStyleType>(styleNode: StyleNode<TStyleType>, logger: Logger = Logger()): Nullable<FigmaStyleTypeToToken<Token, typeof styleNode.nodeType>> => {
  const type = tokenType(styleNode)
  if (!type) {
    logger.warn(`Style node with key ${styleNode.styleKey} type ${styleNode.type} is not supported. Skipping.`)
    return null
  }
  const tokenCssRules = styleNodeToCssRules(styleNode);
  const tokenCss = tokenCssRules ? {
    style: tokenCssRules,
    rules: stringifyCssRules(tokenCssRules),
  } : undefined;

  const value = tokenCssRules ? tokenValue(type, tokenCssRules) : null;

  return {
    name: styleNode.name,
    type,
    value,
    css: tokenCss,
  }
}

export const groupTokensByName = (tokens: Token[], logger = Logger()): TokenOrGroupCollection => {
  const splitTokenName = (token: Token) => token.name.split("/");
  let groups: TokenOrGroupCollection = {};
  // sort tokens by nesting
  const sortedTokens = tokens.sort((a, b) => {
    const aPathLength = splitTokenName(a).length;
    const bPathLength = splitTokenName(a).length;
    return aPathLength === bPathLength ? 0 : aPathLength > bPathLength ? -1 : 1;
  })

  const tokenPaths = sortedTokens.map((token) => ({
    path: splitTokenName(token),
    token: {
      ...token,
      name: splitTokenName(token).reverse()[0],
    },
  }))
  // abort early if no nesting
  const maxTokenPathLength = tokenPaths.reduce((acc: number, { path }) => Math.max(path.length, acc), 0)
  if (maxTokenPathLength === 0) return groups;
  if (maxTokenPathLength === 1) {
    return Object.fromEntries(sortedTokens.map((token): [string, Token] => [ token.name, token ]))
  }

  let slices: TokenOrGroupCollection = {};
  const findNestedSlice = (slice: string[]) => {
    logger.log(`Finding slice "${slice.join(", ")}"`)
    let temp: Nullable<TokenOrGroupCollection> = slices;
    for (let i = 0; i < slice.length; i++) {
      const currentSlicePath = slice[i];
      const candidate = temp[currentSlicePath]
      temp = candidate?.tokens ?? null;
      if (temp === null) return null;
    }
    return temp;
  }

  const nestToken = (tokenPath: {path: string[], token: Token }) => {
    const items = tokenPath.path.reverse();
    const nestedToken = items.reduce((acc, part, level): TokenOrGroupCollection => {
      const currentSlicePath = (items as string[]).slice(level + 1).reverse();
      const otherSlice = currentSlicePath.length === 0
        ? null
        : findNestedSlice(currentSlicePath);

      return {
        ...(otherSlice || {}),
        [part]: level === 0
          ? tokenPath.token
          : {
            name: part,
            type: tokenPath.token.type,
            tokens: acc
          },
      }
    }, {})
    // assign to slices
    slices = {
      ...slices,
      ...nestedToken,
    }
    return nestedToken
  }
  // group all tokens paths
  groups = Object.assign({}, ...tokenPaths.map((tokenPath) => nestToken(tokenPath)))
  logger.log(groups, "GROUPS")


  return groups;
}

export const groupTokensByType = (tokens: Token[]) => {
  return tokens.reduce<Record<TokenType, Token[]>>(
    <TType extends TokenType>(acc: Record<TType, Token<TType>[]>, token: Token<TType>) => {
      acc[token.type].push(token)
      return acc
    },
    Object.fromEntries(
      tokenTypes.map((tokenType: TokenType) => [tokenType, []])
    ) as Record<TokenType, Token[]>
  )
}

export const groupTokens = (tokens: Token[], logger: Logger = Logger()): RootTokenCollection => {
  logger.info(`Grouping ${tokens.length} tokens by name and type...`);
  const tokensByType = groupTokensByType(tokens);
  const tokensByTypeAndName = Object.fromEntries<TokenOrGroupCollection>(
    Object.entries(tokensByType).map((group: [TokenType, Token[]]) =>
      [group[0], groupTokensByName(group[1], logger)]
    )
  )
  const groupCount = Object.keys(tokensByTypeAndName).length
  logger.info(`Created ${groupCount} groups from ${tokens.length} groups.`)
  return tokensByTypeAndName;
}

const isToken = (data: TokenGroup | Token | TokenOrGroupCollection): data is Token => {
  return data && !!data.type && typeof data.type === "string" && tokenTypes.includes(data.type)
}

const isTokenGroup = (data: TokenGroup | Token | TokenOrGroupCollection): data is TokenGroup => {
  return data && !!data.tokens && typeof data.tokens === "object"
}

const unwrapTokenOrGroup = (tokenOrCollection: TokenGroup | Token | TokenOrGroupCollection): TokenValues | Token => {
  // token group
  if(isTokenGroup(tokenOrCollection)) {
    return transformObject(tokenOrCollection.tokens, unwrapTokenOrGroup)
  }
  // token
  if(isToken(tokenOrCollection)) {
    return tokenOrCollection
  }
  // token collection
  return transformObject(tokenOrCollection, unwrapTokenOrGroup)
}

export const unwrapTokenValues = (rootTokenCollection: RootTokenCollection, logger: Logger = Logger()): TokenValues => {
  logger.info('Extracting token values...')


  const rootCollectionValues = transformObject(rootTokenCollection, unwrapTokenOrGroup)
  logger.info('Done.')
  return rootCollectionValues;
}