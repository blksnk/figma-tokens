import { FigmaTypeStyle } from "../types/figma/figma.properties.types";
import {
  FigmaTextAlignHorizontal,
  FigmaTextAlignVertical,
  FigmaTextCase,
  FigmaTextDecoration
} from "../types/figma/figma.enums.types";
import { pxToRem } from "./css.transformer";


const textDecorationMap: Record<FigmaTextDecoration, string> = {
  STRIKETHROUGH: "strike-through",
  UNDERLINE: "underline",
  NONE: "none",
}

const textCaseMap: Record<FigmaTextCase, string> = {
  UPPER: "uppercase",
  LOWER: "lowercase",
  TITLE: "capitalize",
  SMALL_CAPS: "uppercase",
  SMALL_CAPS_FORCED: "uppercase",
}

const textAlignHorizontalMap: Record<FigmaTextAlignHorizontal, string> = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
  JUSTIFIED: "justify",
}

const openTypeFlags = (text: FigmaTypeStyle) => {
  const flags = text.opentypeFlags ? Object.entries(text.opentypeFlags) : [];
  if (text.textCase === "SMALL_CAPS" || text.textCase === "SMALL_CAPS_FORCED") {
    flags.push(["SMCP", 1])
  }
  if (flags.length === 0) return "normal";
  return flags.map(([flag, value]) => `"${flag}" ${value}`).join(", ");
}

export const figmaTextToCssText = (text: FigmaTypeStyle) => {
  const cssProps: Partial<CSSStyleDeclaration> = {
    fontFamily: text.fontFamily,
    fontWeight: String(text.fontWeight),
    fontSize: pxToRem(text.fontSize),
    fontStyle: text.italic ? "italic" : "normal",
    textIndent: text.paragraphIndent ? pxToRem(text.paragraphIndent) : "unset",
    textDecoration: textDecorationMap[text.textDecoration] ?? "none",
    textTransform: textCaseMap[text.textCase] ?? "unset",
    lineHeight: text.lineHeightUnit === "PIXELS" && text.lineHeightPx
      ? pxToRem(Math.max(text.lineHeightPx, text.paragraphSpacing ?? 0))
      : text.lineHeightUnit === "FONT_SIZE_%" && text.lineHeightPercentFontSize
      ? `${pxToRem(text.lineHeightPercentFontSize / 100 * text.fontSize)}%`
      : text.lineHeightUnit === "INTRINSIC_%" && text.lineHeightPercent
      ? `${text.lineHeightPercent}%`
      : "auto",
    letterSpacing: pxToRem(text.letterSpacing),
    textOverflow: text.textTruncation === "ENDING" ? "ellipsis" : "unset",
    textAlign: textAlignHorizontalMap[text.textAlignHorizontal],
    verticalAlign: text.textAlignHorizontal.toLowerCase(),
    fontFeatureSettings: openTypeFlags(text),
  }
  return cssProps;
}