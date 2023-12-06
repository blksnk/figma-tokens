import { StyleNode } from "../types/global/transformer.types";
import {
  FigmaStyleTypeToToken,
  Token,
  TokenType
} from "../types/global/export.types";
import { FigmaStyleType } from "../types/figma/figma.enums.types";
import { Nullable } from "../types/global/global.types";
import { stringifyCssRules, styleNodeToCssRules } from "./css.transformer";

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
        return "IMAGE_OR_VIDEO";
      case "SOLID":
        return "COLOR";
      default:
        return null;
    }
  }
}

export const styleNodeToToken = <TStyleType extends FigmaStyleType>(styleNode: StyleNode<TStyleType>): Nullable<FigmaStyleTypeToToken<Token, typeof styleNode.nodeType>> => {
  const type = tokenType(styleNode)
  if (!type) return null;
  const tokenCssRules = styleNodeToCssRules(styleNode);
  const tokenCss = tokenCssRules ? {
    style: tokenCssRules,
    rules: stringifyCssRules(tokenCssRules),
  } : undefined;

  return {
    name: styleNode.name,
    type,
    css: tokenCss,
  }
}