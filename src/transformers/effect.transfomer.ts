import { FigmaEffect } from "../types/figma/figma.properties.types";
import { figmaColorToCssRgba, pxToRem } from "./css.transformer";
import { FigmaNodeType } from "../types/figma/figma.enums.types";

/**
 * Converts a Figma effect to CSS properties.
 *
 * @param {FigmaEffect} effect - The Figma effect to convert.
 * @param {FigmaNodeType} nodeType - The type of Figma node.
 * @return {Partial<CSSStyleDeclaration>} The CSS properties corresponding to the Figma effect.
 */
export const figmaEffectToCssProps = (
  effect: FigmaEffect,
  nodeType: FigmaNodeType
): Partial<CSSStyleDeclaration> => {
  // check for false since key is not always present
  if (effect.visible === false) {
    return {};
  }
  const radius = pxToRem(effect.radius);
  const blurStr = `blur(${radius})`;
  switch (effect.type) {
    case "BACKGROUND_BLUR":
      return {
        backdropFilter: blurStr,
      };
    case "LAYER_BLUR":
      return {
        filter: blurStr,
      };
    default: {
      const inset = effect.type === "INNER_SHADOW" ? "inset " : "";
      const offset = `${pxToRem(effect.offset.x)} ${pxToRem(effect.offset.y)}`;
      const spread = pxToRem(effect.spread ?? 0);
      const color = figmaColorToCssRgba(effect.color);
      const shadowStr = `${inset}${offset} ${radius} ${spread} ${color}`;
      return {
        [nodeType === "TEXT" ? "textShadow" : "boxShadow"]: shadowStr,
      };
    }
  }
};
