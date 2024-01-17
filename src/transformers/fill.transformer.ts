import {
  FigmaColorStop,
  FigmaPaint,
  FigmaVector,
} from "../types/figma/figma.properties.types";
import {
  FigmaBlendMode,
  FigmaPaintType,
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
};

type FigmaGradientPaintType = Exclude<
  FigmaPaintType,
  "IMAGE" | "SOLID" | "VIDEO" | "EMOJI"
>;

const cssGradientPropertyMap: Record<FigmaGradientPaintType, string> = {
  GRADIENT_ANGULAR: "conic-gradient",
  GRADIENT_RADIAL: "radial-gradient",
  GRADIENT_LINEAR: "linear-gradient",
  GRADIENT_DIAMOND: "radial-gradient",
};

// TODO: gradients are currently not fully supported

/**
 * Converts a Figma gradient to a CSS gradient string.
 *
 * @param {FigmaGradientPaintType} type - The type of gradient paint.
 * @param {FigmaVector[]} gradientHandlePositions - The positions of the gradient handles.
 * @param {FigmaColorStop[]} gradientStops - The color stops of the gradient.
 * @return {string} The CSS gradient string.
 */
const figmaGradientToCssGradient = (
  type: FigmaGradientPaintType,
  gradientHandlePositions: FigmaVector[],
  gradientStops: FigmaColorStop[]
) => {
  const prop = cssGradientPropertyMap[type];
  const angle = calculateAngle(
    gradientHandlePositions[2].x,
    gradientHandlePositions[2].y,
    gradientHandlePositions[0].x,
    gradientHandlePositions[0].y
  );
  const stops = gradientStops
    .map(
      (stop, index) =>
        `${figmaColorToCssRgba(stop.color)} ${(
          (index / (gradientStops.length - 1)) *
          100
        ).toFixed(2)}%`
    )
    .join(", ");
  return `${prop}(${angle}deg, ${stops})`;
};

/**
 * Checks if the given paint object is of a type that is a subset of the provided subset.
 *
 * @param {FigmaPaint} paint - The paint object to check.
 * @param {TPaintTypeSubset} subset - The subset of paint types to check against.
 * @return {boolean} Whether the given paint object is of a type that is a subset of the provided subset.
 */
const isPaintOfTypeSubset = <TPaintTypeSubset extends FigmaPaintType[]>(
  paint: FigmaPaint,
  subset: TPaintTypeSubset
): paint is FigmaPaint<TPaintTypeSubset[number]> => {
  return subset.includes(paint.type);
};

/**
 * Converts a Figma paint object to CSS properties.
 *
 * @param {FigmaPaint} paint - The Figma paint object to convert.
 * @return {Partial<CSSStyleDeclaration>} - The converted CSS properties.
 */
export const figmaPaintToCssProps = (
  paint: FigmaPaint
): Partial<CSSStyleDeclaration> => {
  // transform non type-dependant props
  const globalCssProps: Partial<CSSStyleDeclaration> = {
    opacity: typeof paint.opacity === "number" ? String(paint.opacity) : "1",
    mixBlendMode: figmaBlendModeMap[paint.blendMode],
  };
  // check against `false` is needed since visible paints have undefined opacity by default;
  if (paint.visible === false) {
    globalCssProps.display = "none";
  }

  if (isPaintOfTypeSubset(paint, ["SOLID"])) {
    return {
      ...globalCssProps,
      background: figmaColorToCssRgba(paint.color),
    };
  }
  if (
    isPaintOfTypeSubset(paint, [
      "GRADIENT_ANGULAR",
      "GRADIENT_LINEAR",
      "GRADIENT_RADIAL",
      "GRADIENT_DIAMOND",
    ])
  ) {
    return {
      ...globalCssProps,
      background: figmaGradientToCssGradient(
        paint.type,
        paint.gradientHandlePositions,
        paint.gradientStops
      ),
    };
  }
  return globalCssProps;
};
