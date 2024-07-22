import { FigmaTypeStyle } from "../types/figma/figma.properties.types";
import {
  FigmaTextAlignHorizontal,
  FigmaTextCase,
  FigmaTextDecoration,
} from "../types/figma/figma.enums.types";
import { pxToRem } from "./css.transformer";

const textDecorationMap: Record<FigmaTextDecoration, string> = {
  STRIKETHROUGH: "strike-through",
  UNDERLINE: "underline",
  NONE: "none",
};

const textCaseMap: Record<FigmaTextCase, string> = {
  UPPER: "uppercase",
  LOWER: "lowercase",
  TITLE: "capitalize",
  SMALL_CAPS: "uppercase",
  SMALL_CAPS_FORCED: "uppercase",
};

const textAlignHorizontalMap: Record<FigmaTextAlignHorizontal, string> = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
  JUSTIFIED: "justify",
};

/**
 * Returns the open type flags for the given FigmaTypeStyle text.
 * If the text has the "SMALL_CAPS" or "SMALL_CAPS_FORCED" text case,
 * it includes the "SMCP" flag with a value of 1.
 *
 * @param {FigmaTypeStyle} text - The FigmaTypeStyle text.
 * @returns {string} The open type flags for the given text, or "normal" if no flags are present.
 */
const openTypeFlags = (text: FigmaTypeStyle) => {
  const flags = text.opentypeFlags ? Object.entries(text.opentypeFlags) : [];
  if (text.textCase === "SMALL_CAPS" || text.textCase === "SMALL_CAPS_FORCED") {
    flags.push(["SMCP", 1]);
  }
  if (flags.length === 0) return "normal";
  return flags.map(([flag, value]) => `"${flag}" ${value}`).join(", ");
};

/**
 * Calculates the line height of a given text style.
 *
 * @param {FigmaTypeStyle} text - The text style to calculate the line height for.
 * @return {string} The calculated line height value.
 */
const lineHeight = (text: FigmaTypeStyle): string => {
  if (text.lineHeightUnit === "PIXELS" && text.lineHeightPx) {
    return pxToRem(Math.max(text.lineHeightPx, text.paragraphSpacing ?? 0));
  }
  if (text.lineHeightUnit === "FONT_SIZE_%" && text.lineHeightPercentFontSize) {
    return pxToRem(
      Math.round((text.fontSize / 100) * text.lineHeightPercentFontSize)
    );
  }
  if (text.lineHeightUnit === "INTRINSIC_%" && text.lineHeightPercent) {
    return `${text.lineHeightPercent}%`;
  }
  return "auto";
};

/**
 * Transforms a Figma type style object into CSS style properties.
 *
 * This function takes a Figma type style object and converts it into a set of CSS style properties.
 * The resulting CSS properties can then be applied to a DOM element
 * to visually render the text according to the specified style.
 *
 * @param {FigmaTypeStyle} text - The Figma type style object to be transformed. This object contains various properties such as font family, font weight, font size, text alignment, and more.
 * @return {Partial<CSSStyleDeclaration>} - The CSS style properties generated from the Figma type style object. This is a partial CSSStyleDeclaration object, which means it contains only the properties that are relevant to the text style.
 */
export const figmaTextToCssText = (text: FigmaTypeStyle) => {
  const cssProps: Partial<CSSStyleDeclaration> = {
    fontFamily: text.fontFamily,
    fontWeight: String(text.fontWeight),
    fontSize: pxToRem(text.fontSize),
    fontStyle: text.italic ? "italic" : "normal",
    textIndent: text.paragraphIndent ? pxToRem(text.paragraphIndent) : "unset",
    textDecoration: text.textDecoration
      ? textDecorationMap[text.textDecoration]
      : "none",
    textTransform: text.textCase ? textCaseMap[text.textCase] : "unset",
    lineHeight: lineHeight(text),
    letterSpacing: pxToRem(text.letterSpacing),
    textOverflow: text.textTruncation === "ENDING" ? "ellipsis" : "unset",
    textAlign: textAlignHorizontalMap[text.textAlignHorizontal],
    verticalAlign: text.textAlignVertical.toLowerCase(),
    fontFeatureSettings: openTypeFlags(text),
  };
  return cssProps;
};
