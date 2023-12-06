const figmaNodeTypes = [
  // FIGMA & FIGJAM
  "DOCUMENT",
  "CANVAS",
  "FRAME",
  "GROUP",
  "SECTION",
  "VECTOR",
  "BOOLEAN_OPERATION",
  "STAR",
  "LINE",
  "ELLIPSE",
  "REGULAR_POLYGON",
  "RECTANGLE",
  "TABLE",
  "TABLE_CELL",
  "TEXT",
  "SLICE",
  "COMPONENT",
  "COMPONENT_SET",
  "INSTANCE",
  // FIGJAM EXCLUSIVE
  "STICKY",
  "SHAPE_WITH_TEXT",
  "CONNECTOR",
  "WASHI_TAPE",
] as const;

/**
 * The type property of a Figma Node. One of {@link figmaNodeTypes}. Refer to {@link FigmaGlobalNode} for usage.
 */
export type FigmaNodeType = (typeof figmaNodeTypes)[number];

const figmaExportFormats = [
  "JPG",
  "PNG",
  "SVG",
] as const;

/**
 * Image type, string enum that supports values JPG, PNG, and SVG.
 * Refer to {@link figmaExportFormats}
 */
export type FigmaExportFormat = (typeof figmaExportFormats)[number];

const figmaConstraintTypes = [
  /**
   * Scale by value
   */
  "SCALE",
  /**
   * Scale proportionally and set width to value
   */
  "WIDTH",
  /**
   * Scale proportionally and set height to value
   */
  "HEIGHT",
] as const;

/**
 * Sizing constraint for exports.
 * Refer to {@link FigmaConstraintType}
 */
export type FigmaConstraintType = (typeof figmaConstraintTypes)[number];

const figmaBlendModes = [
  // Normal blends
  "PASS_THROUGH", // (only applicable to objects with children)
  "NORMAL",
  // Darken:
  "DARKEN",
  "MULTIPLY",
  "LINEAR_BURN", // ("Plus darker" in Figma)
  "COLOR_BURN",
  // Lighten:
  "LIGHTEN",
  "SCREEN",
  "LINEAR_DODGE", // ("Plus lighter" in Figma)
  "COLOR_DODGE",
  // Contrast:
  "OVERLAY",
  "SOFT_LIGHT",
  "HARD_LIGHT",
  // Inversion:
  "DIFFERENCE",
  "EXCLUSION",
  // Component:
  "HUE",
  "SATURATION",
  "COLOR",
  "LUMINOSITY",
] as const;

/**
 * Enum describing how layer blends with layers below.
 * Refer to {@link figmaBlendModes}
 */
export type FigmaBlendMode = (typeof figmaBlendModes)[number];

const figmaMaskTypes = [
  /**
   * The mask node's alpha channel will be used to determine
   * the opacity of each pixel in the masked result.
   */
  "ALPHA",
  /**
   * If the mask node has visible fill paints, every pixel inside
   * the node's fill regions will be fully visible in the masked result.
   * If the mask has visible stroke paints, every pixel inside
   * the node's stroke regions will be fully visible in the masked result.
   */
  "VECTOR",
  /**
   * The luminance value of each pixel of the mask node will be used
   * to determine the opacity of that pixel in the masked result.
   */
  "LUMINANCE",
] as const;

/**
 * Enum describing how mask layer operates on the pixels of the layers it masks.
 * Refer to {@link figmaMaskTypes}
 */
export type FigmaMaskType = (typeof figmaMaskTypes)[number];

const figmaEasingTypes = [
  /**
   * Ease in with an animation curve similar to CSS ease-in.
   */
  "EASE_IN",
  /**
   * Ease out with an animation curve similar to CSS ease-out.
   */
  "EASE_OUT",
  /**
   * Ease in and then out with an animation curve similar to CSS ease-in-out.
   */
  "EASE_IN_AND_OUT",
  /**
   * No easing, similar to CSS linear.
   */
  "LINEAR",
  /**
   * Gentle spring animation similar to react-spring.
   */
  "GENTLE_SPRING",
] as const;

/**
 * Enum describing animation easing curves.
 * Refer to {@link figmaEasingTypes}
 */
export type FigmaEasingType = (typeof figmaEasingTypes)[number];

const figmaVerticalLayoutConstraints = [
  /**
   * Node is laid out relative to top of the containing frame
   */
  "TOP",
  /**
   * Node is laid out relative to bottom of the containing frame
   */
  "BOTTOM",
  /**
   * Node is vertically centered relative to containing frame
   */
  "CENTER",
  /**
   * Both top and bottom of node are constrained relative to containing frame (node stretches with frame)
   */
  "TOP_BOTTOM",
  /**
   * Node scales vertically with containing frame
   */
  "SCALE",
] as const;

/**
 * Vertical constraint as an enum.
 * Refer to {@link figmaVerticalLayoutConstraints}
 */
export type FigmaVerticalLayoutConstraint = (typeof figmaVerticalLayoutConstraints)[number];

const figmaHorizontalLayoutConstraints = [
  /**
   * Node is laid out relative to left of the containing frame
   */
  "LEFT",
  /**
   * Node is laid out relative to right of the containing frame
   */
  "RIGHT",
  /**
   * Node is horizontally centered relative to containing frame
   */
  "CENTER",
  /**
   * Both left and right of node are constrained relative to containing frame (node stretches with frame)
   */
  "LEFT_RIGHT",
  /**
   * Node scales horizontally with containing frame
   */
  "SCALE",
] as const;

/**
 * Horizontal constraint as an enum.
 * Refer to {@link figmaHorizontalLayoutConstraints}
 */
export type FigmaHorizontalLayoutConstraint = (typeof figmaHorizontalLayoutConstraints)[number];

const figmaLayoutGridPatterns = [
  /**
   * Vertical grid
   */
  "COLUMNS",
  /**
   * Horizontal grid
   */
  "ROWS",
  /**
   * Square grid
   */
  "GRID",
] as const;

/**
 * Orientation of the grid as a string enum.
 * Refer to {@link figmaLayoutGridPatterns}
 */
export type FigmaLayoutGridPattern = (typeof figmaLayoutGridPatterns)[number];

const figmaLayoutGridAlignments = [
  /**
   * Grid starts at the left or top of the frame
   */
  "MIN",
  /**
   * Grid is stretched to fit the frame
   */
  "STRETCH",
  /**
   * Grid is center aligned
   */
  "CENTER",
] as const;

/**
 * Positioning of grid as a string enum.
 * Refer to {@link figmaLayoutGridAlignments}
 */
export type FigmaLayoutGridAlignment = (typeof figmaLayoutGridAlignments)[number];

const figmaEffectTypes = [
  "INNER_SHADOW",
  "DROP_SHADOW",
  "LAYER_BLUR",
  "BACKGROUND_BLUR",
] as const;

/**
 * Type of effect as a string enum.
 * Refer to {@link figmaEffectTypes}
 */
export type FigmaEffectType = (typeof figmaEffectTypes)[number];

const figmaHyperlinkTypes = [
  "URL",
  "NODE",
] as const;

/**
 * Type of hyperlink.
 * Refer to {@link figmaHyperlinkTypes}
 */
export type FigmaHyperlinkType = (typeof figmaHyperlinkTypes)[number];

const figmaPaintTypes = [
  "SOLID",
  "GRADIENT_LINEAR",
  "GRADIENT_RADIAL",
  "GRADIENT_ANGULAR",
  "GRADIENT_DIAMOND",
  "IMAGE",
  "EMOJI",
  "VIDEO",
] as const;

/**
 * Type of paint as a string enum..
 * Refer to {@link figmaPaintTypes}
 */
export type FigmaPaintType = (typeof figmaPaintTypes)[number];

const figmaPaintScaleModes = [
  "FILL",
  "FIT",
  "TILE",
  "STRETCH",
] as const;

/**
 * Image scaling mode.
 * Refer to {@link figmaPaintScaleModes}
 */
export type FigmaPainScaleMode = (typeof figmaPaintScaleModes)[number];

const figmaTextCases = [
  "UPPER",
  "LOWER",
  "TITLE",
  "SMALL_CAPS",
  "SMALL_CAPS_FORCED",
] as const

/**
 * Text casing applied to the node, default is the original casing
 * Refer to {@link figmaTextCases}
 */
export type FigmaTextCase = (typeof figmaTextCases)[number];

const figmaTextDecorations = [
  "STRIKETHROUGH",
  "UNDERLINE",
  "NONE", // TODO check if nullish
] as const

/**
 * Text decoration applied to the node, default is none
 * Refer to {@link figmaTextDecorations}
 */
export type FigmaTextDecoration = (typeof figmaTextDecorations)[number];

const figmaTextAutoResizes = [
  "HEIGHT",
  "WIDTH_AND_HEIGHT",
  "NONE", // TODO check if nullish
] as const;

/**
 * Dimensions along which text will auto resize, default is that the text does not auto-resize.
 * Refer to {@link figmaTextAutoResizes}
 */
export type FigmaTextAutoResize = (typeof figmaTextAutoResizes)[number];

const figmaTextTruncations = [
  "DISABLED",
  "ENDING",
] as const;

/**
 * Whether this text node will truncate with an ellipsis
 * when the text contents is larger than the text node.
 * Refer to {@link figmaTextTruncations}
 */
export type FigmaTextTruncation = (typeof figmaTextTruncations)[number];

const figmaTextAlignHorizontals = [
  "LEFT",
  "RIGHT",
  "CENTER",
  "JUSTIFIED",
] as const;

/**
 * Horizontal text alignment as string enum.
 * Refer to {@link figmaTextAlignHorizontals}
 */
export type FigmaTextAlignHorizontal = (typeof figmaTextAlignHorizontals)[number];

const figmaTextAlignVerticals = [
  "TOP",
  "CENTER",
  "BOTTOM",
] as const;

/**
 * Vertical text alignment as string enum
 * Refer to {@link figmaTextAlignVerticals}
 */
export type FigmaTextAlignVertical = (typeof figmaTextAlignVerticals)[number];

const figmaLineHeightUnits = [
  "PIXELS",
  "FONT_SIZE_%",
  "INTRINSIC_%",
] as const;

/**
 * The unit of the line height value specified by the user.
 * Refer to {@link figmaLineHeightUnits}
 */
export type FigmaLineHeightUnit = (typeof figmaLineHeightUnits)[number];

const figmaStyleTypes = [
  "FILL",
  "TEXT",
  "EFFECT",
  "GRID",
] as const;

/**
 * The type of style as string enum.
 * Refer to {@link figmaStyleTypes}
 */
export type FigmaStyleType = (typeof figmaStyleTypes)[number];

const figmaShapeTypes = [
  "SQUARE",
  "ELLIPSE",
  "ROUNDED_RECTANGLE",
  "DIAMOND",
  "TRIANGLE_DOWN",
  "PARALLELOGRAM_RIGHT",
  "PARALLELOGRAM_LEFT",
  "ENG_DATABASE",
  "ENG_QUEUE",
  "ENG_FILE",
  "ENG_FOLDER",
  "TRAPEZOID",
  "PREDEFINED_PROCESS",
  "SHIELD",
  "DOCUMENT_SINGLE",
  "DOCUMENT_MULTIPLE",
  "MANUAL_INPUT",
  "HEXAGON",
  "CHEVRON",
  "PENTAGON",
  "OCTAGON",
  "STAR",
  "PLUS",
  "ARROW_LEFT",
  "ARROW_RIGHT",
  "SUMMING_JUNCTION",
  "OR",
  "SPEECH_BUBBLE",
  "INTERNAL_STORAGE",
] as const;

/**
 * Geometric shape type.
 * Refer to {@link figmaShapeTypes}
 * @remarks Most shape types have the same name as their tooltip but there are a few exceptions.
 */
export type FigmaShapeType = (typeof figmaShapeTypes)[number];

export const figmaShapeTypeMap: Record<FigmaShapeType, string> = {
  SQUARE: "Square",
  ELLIPSE: "Ellipse",
  ROUNDED_RECTANGLE: "Rounded Rectangle",
  DIAMOND: "Diamond",
  TRIANGLE_DOWN: "Triangle Down",
  PARALLELOGRAM_RIGHT: "Parallelogram Right",
  PARALLELOGRAM_LEFT: "Parallelogram Left",
  ENG_DATABASE: "Cylinder",
  ENG_QUEUE: "Horizontal Cylinder",
  ENG_FILE: "File",
  ENG_FOLDER: "Folder",
  TRAPEZOID: "Trapezoid",
  PREDEFINED_PROCESS: "Predefined Process",
  SHIELD: "Shield",
  DOCUMENT_SINGLE: "Document Single",
  DOCUMENT_MULTIPLE: "Document Multiple",
  MANUAL_INPUT: "Manual Input",
  HEXAGON: "Hexagon",
  CHEVRON: "Chevron",
  PENTAGON: "Pentagon",
  OCTAGON: "Octagon",
  STAR: "Star",
  PLUS: "Plus",
  ARROW_LEFT: "Arrow Left",
  ARROW_RIGHT: "Arrow Right",
  SUMMING_JUNCTION: "Summing Junction",
  OR: "Or",
  SPEECH_BUBBLE: "Speech Bubble",
  INTERNAL_STORAGE: "Internal Storage",
} as const;

const figjamConnectorMagnets = [
  "AUTO",
  "TOP",
  "BOTTOM",
  "LEFT",
  "RIGHT",
] as const;

/**
 * The connector magnet type is a string enum.
 * Refer to {@link figjamConnectorMagnets}
 */
export type FigjamConnectorMagnet = (typeof figjamConnectorMagnets)[number]

const figjamConnectorLineTypes = [
  "ELBOWED",
  "STRAIGHT",
]

/**
 * Connector line type
 * Refer to {@link figjamConnectorLineTypes}
 */
export type FigjamConnectorLineType = (typeof figjamConnectorLineTypes)[number]

const figmaComponentPropertyTypes = [
  "BOOLEAN",
  "INSTANCE_SWAP",
  "TEXT",
  "VARIANT",
] as const;

/**
 * Component property type
 * Refer to {@link figmaComponentPropertyTypes}
 */
export type FigmaComponentPropertyType = (typeof figmaComponentPropertyTypes)[number];

const figmaInstanceSwapPreferredValueTypes = [
  "COMPONENT",
  "COMPONENT_SET",
] as const;

/**
 * Type of instance swap preferred value
 * Refer to {@link figmaInstanceSwapPreferredValueTypes}
 */
export type FigmaInstanceSwapPreferredValueType = (typeof figmaInstanceSwapPreferredValueTypes)[number];

const figmaPrototypeDeviceTypes = [
  "NONE",
  "PRESET",
  "CUSTOM",
  "PRESENTATION",
] as const;

/**
 * Type of device used to view a prototype
 * Refer to {@link figmaPrototypeDeviceTypes}
 */
export type FigmaPrototypeDeviceType = (typeof figmaPrototypeDeviceTypes)[number];

const figmaPrototypeDeviceRotations = [
  "NONE",
  "CCW_90",
] as const;

/**
 * Rotation of device used to view a prototype
 * Refer to {@link figmaPrototypeDeviceRotations}
 */
export type FigmaPrototypeDeviceRotation = (typeof figmaPrototypeDeviceRotations)[number];

const figmaStrokeAligns = [
  "INSIDE",
  "OUTSIDE",
  "CENTER",
] as const;

/**
 * Position of stroke relative to vector outline, as a string enum
 * Refer to {@link figmaStrokeAligns}
 */
export type FigmaStrokeAlign = (typeof figmaStrokeAligns)[number];

const figmaLayoutAligns = [
  "INHERIT",
  "MIN",
  "CENTER",
  "MAX",
  "STRETCH",
] as const;

/**
 * In horizontal auto-layout frames, "MIN" and "MAX" correspond to "TOP" and "BOTTOM".
 * In vertical auto-layout frames, "MIN" and "MAX" correspond to "LEFT" and "RIGHT".
 * @remarks This property is only provided for direct children of auto-layout frames.
 * Refer to {@link figmaLayoutAligns}
 */
export type FigmaLayoutAlign = (typeof figmaLayoutAligns)[number];

const figmaLayoutModes = [
  "NONE",
  "HORIZONTAL",
  "VERTICAL",
] as const;

/**
 * Whether this layer uses auto-layout to position its children.
 * Refer to {@link figmaLayoutModes}
 */
export type FigmaLayoutMode = (typeof figmaLayoutModes)[number];

const figmaLayoutSizings = [
  "FIXED",
  "HUG",
  "FILL",
] as const;

/**
 * The horizontal & vertical sizing setting on this auto-layout frame or frame child.
 * Refer to {@link figmaLayoutSizings}
 */
export type FigmaLayoutSizing = (typeof figmaLayoutSizings)[number];

const figmaLayoutWraps = [
  "NO_WRAP",
  "WRAP",
] as const;

/**
 * Whether this auto-layout frame has wrapping enabled.
 * Refer to {@link figmaLayoutWraps}
 */
export type FigmaLayoutWrap = (typeof figmaLayoutWraps)[number];

const figmaAxisSizingModes = [
  "FIXED",
  "AUTO",
] as const;

/**
 * Whether the primary / counter axis has a fixed length (determined by the user)
 * or an automatic length (determined by the layout engine).
 * Refer to {@link figmaAxisSizingModes}
 */
export type FigmaAxisSizingMode = (typeof figmaAxisSizingModes)[number];

const figmaPrimaryAxisAlignItemsOptions = [
  "MIN",
  "CENTER",
  "MAX",
  "SPACE_BETWEEN",
] as const;

/**
 * Determines how the auto-layout frame’s children should be aligned
 * in the primary axis direction.
 * Refer to {@link figmaPrimaryAxisAlignItemsOptions}
 */
export type FigmaPrimaryAxisAlignItems = (typeof figmaPrimaryAxisAlignItemsOptions)[number];

const figmaCounterAxisAlignItemsOptions = [
  "MIN",
  "CENTER",
  "MAX",
  "BASELINE",
] as const;

/**
 * Determines how the auto-layout frame’s children should be aligned
 * in the counter axis direction.
 * Refer to {@link figmaCounterAxisAlignItemsOptions}
 */
export type FigmaCounterAxisAlignItems = (typeof figmaCounterAxisAlignItemsOptions)[number];

const figmaCounterAxisAlignContentOptions = [
  "AUTO",
  "SPACE_BETWEEN",
] as const;

/**
 * Determines how the auto-layout frame’s wrapped tracks should be aligned in the counter axis direction.
 * Refer to {@link figmaCounterAxisAlignContentOptions}
 */
export type FigmaCounterAxisAlignContent = (typeof figmaCounterAxisAlignContentOptions)[number];

const figmaLayoutPositioning = [
  "AUTO",
  "ABSOLUTE",
] as const;

/**
 * Determines whether a layer's size and position should be determined
 * by auto-layout settings or manually adjustable.
 * Refer to {@link figmaLayoutPositioning}
 */
export type FigmaLayoutPositioning = (typeof figmaLayoutPositioning)[number];

const figmaOverflowDirections = [
  "HORIZONTAL_SCROLLING",
  "VERTICAL_SCROLLING",
  "HORIZONTAL_AND_VERTICAL_SCROLLING",
  "NONE",
] as const;

/**
 * Defines the scrolling behavior of the frame, if there exist contents outside the frame boundaries.
 * The frame can either scroll vertically, horizontally,or in both directions
 * to the extents of the content contained within it.
 * Refer to {@link figmaOverflowDirections}
 */
export type FigmaOverflowDirection = (typeof figmaOverflowDirections)[number];

const figmaVectorPathWindingRules = [
  "NONZERO",
  "EVENODD",
  "NONE"
] as const;

/**
 * Winding rules ( work off a concept called the winding number,
 * which tells you for a given point how many times the path winds around that point.
 * Refer to {@link figmaVectorPathWindingRules}
 */
export type FigmaVectorPathWindingRule = (typeof figmaVectorPathWindingRules)[number];

const figmaStrokeCaps = [
  "ROUND",
  "SQUARE",
  "LINE_ARROW",
  "TRIANGLE_ARROW",
  "NONE"
] as const;

/**
 * An enum describing the end caps of vector paths.
 * Refer to {@link figmaStrokeCaps}
 */
export type FigmaStrokeCap = (typeof figmaStrokeCaps)[number];

const figjamConnectorStrokeCaps = [
  "LINE_ARROW",
  "TRIANGLE_ARROW",
  "DIAMOND_FILLED",
  "CIRCLE_FILLED",
  "TRIANGLE_FILLED",
  "NONE"
] as const;

/**
 * An enum describing the end cap of the start or end of the connector.
 * Refer to {@link figjamConnectorStrokeCaps}
 */
export type FigjamConnectorStrokeCap = (typeof figjamConnectorStrokeCaps)[number];

const figmaStrokeJoins = [
  "MITER",
  "BEVEL",
  "ROUND",
] as const;

/**
 * An enum describing how corners in vector paths are rendered.
 * Refer to {@link figmaStrokeJoins}
 */
export type FigmaStrokeJoin = (typeof figmaStrokeJoins)[number];

const figmaBooleanOperations = [
  "UNION",
  "INTERSECT",
  "SUBTRACT",
  "EXCLUDE",
] as const;

/**
 * Indicates the type of boolean operation applied to one or more nodes
 * Refer to {@link figmaBooleanOperations}
 */
export type FigmaBooleanOperation = (typeof figmaBooleanOperations)[number];

const figmaLineTypes = [
  /**
   * Text is an ordered list (numbered)
    */
  "ORDERED",
  /**
   * Text is an unordered list (bulleted)
   */
  "UNORDERED",
  /**
   * Text is plain text and not part of any list
   */
  "NONE",
] as const;

/**
 * List types are represented as string enums
 * Refer to {@link figmaLineTypes}
 */
export type FigmaLineType = (typeof figmaLineTypes)[number];