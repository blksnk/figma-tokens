import { FigmaEffect } from "../types/figma/figma.properties.types";
import { figmaColorToCssRgba, pxToRem } from "./css.transformer";
import { FigmaNodeType } from "../types/figma/figma.enums.types";

export const figmaEffectToCssProps = (effect: FigmaEffect, nodeType: FigmaNodeType) => {
  // check for false since key is not always present
  if (effect.visible === false) {
    return {}
  }
  const radius = pxToRem(effect.radius);
  const blurStr = `blur(${radius})`
  switch (effect.type) {
    case "BACKGROUND_BLUR":
      return {
        backdropFilter: blurStr,
      }
    case "LAYER_BLUR":
      return {
        filter: blurStr,
      }
    default:
      const inset = effect.type === "INNER_SHADOW" ? "inset " : "";
      const offset = `${pxToRem(effect.offset.x)} ${pxToRem(effect.offset.y)}`;
      const spread = pxToRem(effect.spread ?? 0);
      const color = figmaColorToCssRgba(effect.color);
      const shadowStr = `${inset}${offset} ${radius} ${spread} ${color}`;
      return {
        [nodeType === "TEXT" ? "textShadow" : "boxShadow"]: shadowStr,
      }
  }
}