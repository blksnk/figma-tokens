import { FigmaColor } from "../types/figma/figma.properties.types";
import { StyleNode } from "../types/global/transformer.types";
import { figmaTextToCssText } from "./text.transformer";
import { figmaEffectToCssProps } from "./effect.transfomer";
import { FigmaStyleType } from "../types/figma/figma.enums.types";
import { figmaPaintToCssProps } from "./fill.transformer";
import { kebabize } from "../utils/string.utils";

/**
 * Converts pixels to rems.
 *
 * @param {number} px - The number of pixels to convert.
 * @return {string} The converted value in rems.
 */
export const pxToRem = (px: number) => `${px / 16}rem`;

/**
 * Converts a Figma color object to a CSS RGBA color value.
 *
 * @param {FigmaColor} color - The Figma color object to convert.
 * @return {string} The CSS RGBA color value.
 */
export const figmaColorToCssRgba = ({ r, g, b, a }: FigmaColor) => {
  const channel = (channel: number) => Math.round(channel * 255)
  const alpha = (value: number) => parseInt(String(value)) === 1 ? 1 : value.toFixed(4)
  return `rgba(${channel(r)}, ${channel(g)}, ${channel(b)}, ${alpha(a)})`;
}

/**
 * Converts a set of CSS rules into a string representation.
 *
 * @param {Partial<CSSStyleDeclaration>} rules - The CSS rules to stringify.
 * @return {string} - The string representation of the CSS rules.
 */
export const stringifyCssRules = (rules: Partial<CSSStyleDeclaration>) => {
  return Object.entries(rules).map(([prop, value]) => `${kebabize(prop)}: ${value};`).join("\n");
}

/**
 * Converts a style node to CSS rules.
 *
 * @param {StyleNode<TStyleType>} styleNode - The style node to convert.
 * @return {null | string} - The converted CSS rules.
 */
export const styleNodeToCssRules = <TStyleType extends FigmaStyleType>(styleNode: StyleNode<TStyleType>) => {
  return styleNode.type === "TEXT"
    ? figmaTextToCssText(styleNode.styleProperties)
    : styleNode.type === "EFFECT"
      ? figmaEffectToCssProps(styleNode.styleProperties, styleNode.nodeType)
      : styleNode.type === "FILL"
      ? figmaPaintToCssProps(styleNode.styleProperties)
        : null;
}