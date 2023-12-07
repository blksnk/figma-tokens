import { FigmaColor } from "../types/figma/figma.properties.types";
import { StyleNode } from "../types/global/transformer.types";
import { figmaTextToCssText } from "./text.transformer";
import { figmaEffectToCssProps } from "./effect.transfomer";
import { FigmaStyleType } from "../types/figma/figma.enums.types";
import { figmaPaintToCssProps } from "./fill.transformer";

export const pxToRem = (px: number) => `${px / 16}rem`;

export const figmaColorToCssRgba = ({ r, g, b, a }: FigmaColor) => {
  const channel = (channel: number) => Math.round(channel * 255)
  const alpha = (value: number) => parseInt(String(value)) === 1 ? 1 : value.toFixed(4)
  return `rgba(${channel(r)}, ${channel(g)}, ${channel(b)}, ${alpha(a)})`;
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