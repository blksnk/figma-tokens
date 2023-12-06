import {
  FigmaColorStop,
  FigmaPaint, FigmaVector,
} from "../types/figma/figma.properties.types";
import {
  FigmaBlendMode,
  FigmaPaintType
} from "../types/figma/figma.enums.types";
import { CssMixBlendMode } from "../types/css/css.enums";
import { calculateAngle } from "./gradient.transformer";
import { figmaColorToCssRgba } from "./css.transformer";



const figmaBlendModeMap: Record<FigmaBlendMode, CssMixBlendMode> = {
  PASS_THROUGH: "normal",
  NORMAL: "normal",
  DARKEN: "darken",
  MULTIPLY: "multiply",
  LINEAR_BURN: "plus-darker",
  COLOR_BURN: "color-burn",
  LIGHTEN: "lighten",
  SCREEN: "screen",
  LINEAR_DODGE: "plus-lighter",
  COLOR_DODGE: "color-dodge",
  OVERLAY: "overlay",
  SOFT_LIGHT: "soft-light",
  HARD_LIGHT: "hard-light",
  DIFFERENCE: "difference",
  EXCLUSION: "exclusion",
  HUE: "hue",
  SATURATION: "saturation",
  COLOR: "color",
  LUMINOSITY: "luminosity",
}

type FigmaGradientPaintType = Exclude<FigmaPaintType, "IMAGE" | "SOLID" | "VIDEO" | "EMOJI">;

const cssGradientPropertyMap: Record<Exclude<FigmaGradientPaintType, "GRADIENT_DIAMOND">, string> = {
  GRADIENT_ANGULAR: "conic-gradient",
  GRADIENT_RADIAL: "radial-gradient",
  GRADIENT_LINEAR: "linear-gradient",
}

// TODO: gradients are currently not fully supported
const figmaGradientToCssGradient = (
  type: FigmaGradientPaintType,
  gradientHandlePositions: FigmaVector[],
  gradientStops: FigmaColorStop[]
) => {
  const prop = cssGradientPropertyMap[type] ?? "radial-gradient";
  const angle = calculateAngle(
    gradientHandlePositions[2].x,
    gradientHandlePositions[2].y,
    gradientHandlePositions[0].x,
    gradientHandlePositions[0].y
  )
  const stops = gradientStops.map((stop, index) =>
    `${figmaColorToCssRgba(stop.color)} ${((index / (gradientStops.length - 1)) * 100).toFixed(2)}%`
  ).join(", ")
  return `${prop}(${angle}deg, ${stops})`;
}

export const figmaPaintToCssProps = (paint: FigmaPaint) => {
  const { type } = paint;
  // transform non type-dependant props
  let globalCssProps: Partial<CSSStyleDeclaration> = {
    opacity: typeof paint.opacity === "number" ? String(paint.opacity) : "1",
    mixBlendMode: figmaBlendModeMap[paint.blendMode],
  }
  if (paint.visible === false) {
    globalCssProps.display = "none";
  }

  switch(type) {
    case "SOLID":
      return {
        ...globalCssProps,
        background: figmaColorToCssRgba(paint.color),
      }
    case "GRADIENT_ANGULAR":
    case "GRADIENT_LINEAR":
    case "GRADIENT_RADIAL":
    case "GRADIENT_DIAMOND":
      return {
        ...globalCssProps,
        background: figmaGradientToCssGradient(paint.type, paint.gradientHandlePositions, paint.gradientStops),
      }
    default:
      return globalCssProps
  }
}