import { FigmaColor } from "../types/figma/figma.properties.types";
import { StyleNode } from "../types/global/transformer.types";
import { figmaTextToCssText } from "./text.transformer";
import { figmaEffectToCssProps } from "./effect.transfomer";
import { FigmaStyleType } from "../types/figma/figma.enums.types";
import { figmaPaintToCssProps } from "./fill.transformer";
import { kebabize } from "../utils/string.utils";
import { Nullable } from "@ubloimmo/front-util";

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
  const channel = (channel: number) => Math.round(channel * 255);
  const alpha = (value: number) =>
    parseInt(String(value)) === 1 ? 1 : value.toFixed(4);
  return `rgba(${channel(r)}, ${channel(g)}, ${channel(b)}, ${alpha(a)})`;
};

/**
 * Converts a set of CSS rules into a string representation.
 *
 * @param {Partial<CSSStyleDeclaration>} rules - The CSS rules to stringify.
 * @return {string} - The string representation of the CSS rules.
 */
export const stringifyCssRules = (rules: Partial<CSSStyleDeclaration>) => {
  return Object.entries(rules)
    .map(([prop, value]) => `${kebabize(prop)}: ${value};`)
    .join("\n");
};

/**
 * Check if the given styleNode is of a specific style type.
 *
 * @param {StyleNode} styleNode - The style node to check.
 * @param {FigmaStyleType} typePredicate - The type of style to check against.
 * @return {boolean} Returns true if the styleNode is of the specified type, otherwise false.
 */
const isSpecificStyleNode = <TStyleType extends FigmaStyleType>(
  styleNode: StyleNode,
  typePredicate: TStyleType
): styleNode is StyleNode<TStyleType> => {
  return styleNode.type === typePredicate;
};

/**
 * Converts a style node to CSS rules.
 * @template TStyleType {FigmaStyleType} - The type of the style (e.g., "FILL", "EFFECT", "TEXT").
 * @param {StyleNode<TStyleType>} styleNode - The style node to convert.
 * @return {Nullable<Partial<CSSStyleDeclaration>>} - The converted CSS style declaration or null.
 */
export const styleNodeToCssRules = <TStyleType extends FigmaStyleType>(
  styleNode: StyleNode<TStyleType>
): Nullable<Partial<CSSStyleDeclaration>> => {
  if (isSpecificStyleNode(styleNode, "TEXT")) {
    return figmaTextToCssText(styleNode.styleProperties);
  }
  if (isSpecificStyleNode(styleNode, "EFFECT")) {
    return figmaEffectToCssProps(styleNode.styleProperties, styleNode.nodeType);
  }
  if (isSpecificStyleNode(styleNode, "FILL")) {
    return figmaPaintToCssProps(styleNode.styleProperties);
  }
  return null;
};
