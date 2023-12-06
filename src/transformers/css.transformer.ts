import { FigmaColor } from "../types/figma/figma.properties.types";
import { StyleNode } from "../types/global/transformer.types";
import { figmaTextToCssText } from "./text.transformer";
import { figmaEffectToCssProps } from "./effect.transfomer";
import { FigmaStyleType } from "../types/figma/figma.enums.types";
import { figmaPaintToCssProps } from "./fill.transformer";

export const pxToRem = (px: number) => `${px / 16}rem`;

export const figmaColorToCssRgba = ({ r, g, b, a }: FigmaColor) => {
  return `rgba(${r},${g},${b},${a},)`;
}

const kebabize = (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())


export const stringifyCssRules = (rules: Partial<CSSStyleDeclaration>) => {
  return Object.entries(rules).map(([prop, value]) => `${kebabize(prop)}: ${value};`).join("\n");
}

export const styleNodeToCssRules = <TStyleType extends FigmaStyleType>(styleNode: StyleNode<TStyleType>) => {
  return styleNode.type === "TEXT"
    ? figmaTextToCssText(styleNode.styleProperties)
    : styleNode.type === "EFFECT"
      ? figmaEffectToCssProps(styleNode.styleProperties, styleNode.nodeType)
      : styleNode.type === "FILL"
      ? figmaPaintToCssProps(styleNode.styleProperties)
        : null;
}