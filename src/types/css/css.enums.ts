const cssMixBlendModes = [
  "plus-darker",
  "plus-lighter",
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
] as const;

export type CssMixBlendMode = (typeof cssMixBlendModes)[number];
