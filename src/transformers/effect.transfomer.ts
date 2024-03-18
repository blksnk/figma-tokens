import { FigmaEffect } from "../types/figma/figma.properties.types";
import { figmaColorToCssRgba, pxToRem } from "./css.transformer";
import {
  FigmaNodeType,
  type FigmaEffectType,
} from "../types/figma/figma.enums.types";
import { isString, type Nullable } from "@ubloimmo/front-util";

/**
 * Converts a Figma effect to a CSS value string.
 *
 * @param {FigmaEffect} effect - The Figma effect to convert.
 * @param {FigmaNodeType} nodeType - The type of Figma node.
 * @return {Nullable<string>} The CSS properties corresponding to the Figma effect.
 */
const figmaEffectToCssString = (effect: FigmaEffect): Nullable<string> => {
  // check for false since key is not always present
  if (effect.visible === false) return null;
  const radius = pxToRem(effect.radius);
  const blurStr = `blur(${radius})`;

  if (effect.type === "BACKGROUND_BLUR" || effect.type === "LAYER_BLUR") {
    return blurStr;
  }

  const inset = effect.type === "INNER_SHADOW" ? "inset " : "";
  const offset = `${pxToRem(effect.offset.x)} ${pxToRem(effect.offset.y)}`;
  const spread = pxToRem(effect.spread ?? 0);
  const color = figmaColorToCssRgba(effect.color);
  return `${inset}${offset} ${radius} ${spread} ${color}`;
};

/**
 * Normalizes the given Figma effect type to either "blur" or "shadow".
 *
 * @param {FigmaEffectType} type - The effect type to normalize.
 * @return {string} The normalized effect type ("blur" or "shadow").
 */
const normalizeEffectType = (type: FigmaEffectType) => {
  const normalizedTypeMap: Record<FigmaEffectType, "blur" | "shadow"> = {
    BACKGROUND_BLUR: "blur",
    LAYER_BLUR: "blur",
    INNER_SHADOW: "shadow",
    DROP_SHADOW: "shadow",
  };
  return normalizedTypeMap[type];
};

/**
 * Converts an array of Figma effects assigned to a single styleNode to CSS properties.
 *
 * @param {FigmaEffect[]} effects - The Figma effect to convert.
 * @param {FigmaNodeType} nodeType - The type of Figma node.
 * @return {Partial<CSSStyleDeclaration>} The CSS properties corresponding to the Figma effect.
 */
export const figmaEffectToCssProps = (
  effects: FigmaEffect[],
  nodeType: FigmaNodeType
): Partial<CSSStyleDeclaration> => {
  const effectType = effects[0]?.type;
  // check for empty array;
  if (!effectType) return {};
  // remove mismatched effects
  const validEffects = effects.filter(
    ({ type }) => normalizeEffectType(type) === normalizeEffectType(effectType)
  );
  // convert effects to string
  const effectValues = validEffects
    .map(figmaEffectToCssString)
    // remove nulls
    .filter(isString);

  if (effectValues.length === 0) return {};

  // construct effect css string
  const effectStr = effectValues.join(", ");

  const effectKey =
    effectType === "BACKGROUND_BLUR"
      ? "backdropFilter"
      : effectType === "LAYER_BLUR"
      ? "filter"
      : nodeType === "TEXT"
      ? "textShadow"
      : "boxShadow";

  return {
    [effectKey]: effectStr,
  };
};
