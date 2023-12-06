import {
  FigmaBlendMode,
  FigmaComponentPropertyType,
  FigjamConnectorMagnet,
  FigmaConstraintType,
  FigmaEffectType,
  FigmaExportFormat,
  FigmaHorizontalLayoutConstraint,
  FigmaHyperlinkType,
  FigmaInstanceSwapPreferredValueType,
  FigmaLayoutGridAlignment,
  FigmaLayoutGridPattern,
  FigmaLineHeightUnit,
  FigmaPainScaleMode,
  FigmaPaintType,
  FigmaPrototypeDeviceRotation,
  FigmaPrototypeDeviceType,
  FigmaStyleType,
  FigmaTextAlignHorizontal,
  FigmaTextAlignVertical,
  FigmaTextAutoResize,
  FigmaTextCase,
  FigmaTextDecoration,
  FigmaTextTruncation, FigmaVectorPathWindingRule,
  FigmaVerticalLayoutConstraint
} from "./figma.enums.types";
import { Nullable } from "../global/global.types";

/**
 * A string uniquely identifying this node within the document.
 */
export type FigmaNodeId = string;
export type FigmaPageId = string;
export type FigmaProjectId = number;
export type FigmaFileKey = string;
export type FigmaStyleKey = string;
export type FigmaUserId = string;
export type FigmaComponentKey = string;
export type FigmaTeamId = string;

/**
 * A string reference to an image fill
 */
export type FigmaImageRef = string;

/**
 * A 2D vector
 */
export type FigmaVector = {
  /**
   * X coordinate of the vector
   */
  x: number;
  /**
   * Y coordinate of the vector
   */
  y: number;
}

/**
 * A width and a height
 */
export type FigmaSize = {
  /**
   * the width of a size
   */
  width: number;
  /**
   * the height of a size
   */
  height: number;
}
/**
 * A 2x3 affine transformation matrix
 */
export type FigmaTransform = [
  [number, number, number],
  [number, number, number],
]

/**
 * Data written by plugins that is visible only to the plugin that wrote it.
 * Requires the `pluginData` to include the ID of the plugin.
 */
export type FigmaPluginData = unknown;

export type FigmaVariableAlias = {
  id: FigmaNodeId;
  type: "VARIABLE_ALIAS";
}

/**
 * Data written by plugins that is visible to all plugins.
 * Requires the `pluginData` parameter to include the string "shared".
 */
export type FigmaSharedPluginData = unknown;

/**
 * An RGBA color
 */
export type FigmaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Sizing constraint for exports. Refer to {@link FigmaExportSetting}
 */
export type FigmaConstraint = {
  type: FigmaConstraintType;
  value: number;
}

/**
 * Format and size to export an asset at
 */
export type FigmaExportSetting = {
  /**
   * File suffix to append to all filenames
   */
  suffix: string;
  /**
   * Image type, string enum that supports values JPG, PNG, and SVG
   */
  format: FigmaExportFormat;
  constraint: FigmaConstraint;
}

/**
 * A rectangle that expresses a bounding box in absolute coordinates
 */
export type FigmaRectangle  = {
  /**
   * X coordinate of top left corner of the rectangle
   */
  x: number;
  /**
   * Y coordinate of top left corner of the rectangle
   */
  y: number;
  /**
   * Width of the rectangle
   */
  width: number;
  /**
   * Height of the rectangle
   */
  height: number;
}

export type FigmaArcData = {
  /**
   * Start of the sweep in radians
   */
  startingAngle: number;
  /**
   * End of the sweep in radians
   */
  endingAngle: number;
  /**
   * Inner radius value between 0 and 1
   */
  innerRadius: number;
}

/**
 * A flow starting point used when launching a prototype to enter Presentation view.
 */
export type FigmaFlowStartingPoint = {
  /**
   * Unique identifier specifying the frame
   */
  nodeId: FigmaNodeId;
  /**
   * Name of flow
   */
  name: string;
}

/**
 * Layout constraint relative to containing Frame
 */
export type FigmaLayoutConstraint = {
  /**
   * Vertical constraint as an enum
   */
  vertical: FigmaVerticalLayoutConstraint;
  /**
   * Horizontal constraint as an enum
   */
  horizontal: FigmaHorizontalLayoutConstraint;
}

/**
 * Guides to align and place objects within a frame
 */
export type FigmaLayoutGrid = {
  /**
   * Orientation of the grid as a string enum
   */
  pattern: FigmaLayoutGridPattern;
  /**
   * Width of column grid or height of row grid or square grid spacing
   */
  sectionSize: number;
  /**
   * Is the grid currently visible?
   */
  visible: boolean;
  /**
   * Color of the grid
   */
  color: FigmaColor;
  /**
   * Positioning of grid as a string enum
   * @remarks Only meaningful for directional grids (COLUMNS or ROWS)
   */
  alignment: FigmaLayoutGridAlignment;
  /**
   * Spacing in between columns and rows
   * @remarks Only meaningful for directional grids (COLUMNS or ROWS)
   */
  gutterSize: number;
  /**
   * Spacing before the first column or row
   * @remarks Only meaningful for directional grids (COLUMNS or ROWS)
   */
  offset: number;
  /**
   * Number of columns or rows
   * @remarks Only meaningful for directional grids (COLUMNS or ROWS)
   */
  count: number;
}

/**
 * A visual effect such as a shadow or blur
 */
export type FigmaEffect = {
  /**
   * Type of effect as a string enum
   */
  type: FigmaEffectType;
  /**
   * Is the effect active?
   */
  visible: boolean;
  /**
   * Radius of the blur effect (applies to shadows as well)
   */
  radius: number;
  /**
   * The color of the shadow
   * @remarks Only applies to shadow effects
   */
  color: FigmaColor;
  /**
   * Blend mode of the shadow
   * @remarks Only applies to shadow effects
   */
  blendMode: FigmaBlendMode;
  /**
   * How far the shadow is projected in the x and y directions
   * @remarks Only applies to shadow effects
   */
  offset: FigmaVector;
  /**
   * How far the shadow spreads
   * @default 0
   * @remarks Only applies to shadow effects
   */
  spread?: number;
  /**
   * Whether to show the shadow behind translucent or transparent pixels
   * @remarks Only applies to drop shadows
   */
  showShadowBehindNode: boolean;
}

/**
 * A link to either a URL or another frame (node) in the document
 */
export type FigmaHyperlink<TLinkType extends FigmaHyperlinkType = FigmaHyperlinkType> = {
  /**
   * Type of hyperlink
   */
  type: TLinkType;
  /**
   * URL being linked to, if URL type
   */
  url?: TLinkType extends "URL" ? string : never;
  /**
   * ID of frame hyperlink points to, if NODE type
   */
  nodeID?: TLinkType extends "NODE" ? string : never;
}

/**
 * Represents a link to documentation for a component.
 */
export type FigmaDocumentationLink = {
  /**
   * Should be a valid URI (e.g. https://www.figma.com).
   */
  uri: string;
}

/**
 * Defines the image filters applied to an image paint.
 * All values are from -1 to 1.
 */
export type FigmaImageFilters = {
  /**
   * @default 0
   */
  exposure: number;
  /**
   * @default 0
   */
  contrast: number;
  /**
   * @default 0
   */
  saturation: number;
  /**
   * @default 0
   */
  temperature: number;
  /**
   * @default 0
   */
  tint: number;
  /**
   * @default 0
   */
  highlights: number;
  /**
   * @default 0
   */
  shadows: number;
}

export type FigmaColorStop = {
  /**
   * Value between 0 and 1 representing position along gradient axis
   */
  position: number;
  /**
   * Color attached to corresponding position
   */
  color: FigmaColor;
}

/**
 * A mapping of field to the VariableAlias of the bound variable.
 */
type FigmaBoundVariables = Record<string, FigmaVariableAlias | FigmaVariableAlias[]>

/**
 * A solid color, gradient, or image texture that can be applied as fills or strokes
 */
export type FigmaPaint<TPaintType extends FigmaPaintType = FigmaPaintType> = {
  /**
   * Type of paint as a string enum
   */
  type: TPaintType
  /**
   * Is the paint enabled?
   * @default true
   */
  visible: boolean;
  /**
   * Overall opacity of paint
   * @default 1
   * @remarks Colors within the paint can also have opacity values which would blend with this
   */
  opacity: number;
  /**
   * Solid color of the paint
   * @remarks Only applies to solid paints
   */
  color: TPaintType extends "SOLID" ? FigmaColor : never;
  /**
   * How this node blends with nodes behind it in the scene.
   * Refer to {@link FigmaBlendMode}
   * @remarks Only applies to gradient paints
   */
  blendMode: TPaintType extends "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
    ? FigmaBlendMode
    : never;
  /**
   * This field contains three vectors, each of which are a position in normalized object space
   * (normalized object space is if the top left corner of the bounding box of the object is (0, 0) and the bottom right is (1,1)).
   * The first position corresponds to the start of the gradient (value 0 for the purposes of calculating gradient stops),
   * the second position is the end of the gradient (value 1), and the third handle position determines the width of the gradient.
   * @remarks Only applies to gradient paints
   */
  gradientHandlePositions: TPaintType extends "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
    ? FigmaVector[]
    : never;
  /**
   * Positions of key points along the gradient axis with the colors anchored there.
   * Colors along the gradient are interpolated smoothly between neighboring gradient stops.
   * @remarks Only applies to gradient paints
   */
  gradientStops: TPaintType extends "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
    ? FigmaColorStop[]
    : never;
  /**
   * Image scaling mode
   * @remarks Only applies to image paints
   */
  scaleMode: TPaintType extends "IMAGE" ? FigmaPainScaleMode : never;
  /**
   * Affine transform applied to the image,
   * only present if {@link FigmaPaint.scaleMode} is STRETCH
   * @remarks Only applies to image paints
   */
  imageTransform: TPaintType extends "IMAGE" ? FigmaTransform : never;
  /**
   * Amount image is scaled by in tiling,
   * only present if {@link FigmaPaint.scaleMode} is TILE
   * @remarks Only applies to image paints
   */
  scalingFactor: TPaintType extends "IMAGE" ? number : never;
  /**
   * Image rotation in degrees
   * @remarks Only applies to image paints
   */
  rotation: TPaintType extends "IMAGE" ? number : never;
  /**
   * A reference to an image embedded in this node.
   * To download the image using this reference, use the GET file images endpoint
   * to retrieve the mapping from image references to image URLs.
   * @remarks Only applies to image paints
   */
  imageRef: TPaintType extends "IMAGE" ? FigmaImageRef : never;
  /**
   * Defines what image filters have been applied to this paint, if any.
   * If this property is not defined, no filters have been applied.
   * @remarks Only applies to image paints
   */
  filters?: TPaintType extends "IMAGE" ? FigmaImageFilters : never;
  /**
   * A reference to the GIF embedded in this node, if the image is a GIF.
   * To download the image using this reference, use the GET file images endpoint
   * to retrieve the mapping from image references to image URLs
   * @remarks Only applies to image paints
   */
  gifRef?: TPaintType extends "IMAGE" ? FigmaImageRef : never;
  /**
   * A mapping of field to the VariableAlias of the bound variable.
   */
  boundVariables?: FigmaBoundVariables;
}

/**
 * A relative offset within a frame
 */
export type FigmaFrameOffset = {
  /**
   * Unique id specifying the frame.
   */
  node_id: FigmaNodeId;
  /**
   * 2d vector offset within the frame.
   */
  node_offset: FigmaVector;
}

/**
 * Paint metadata to override default paints
 */
export type FigmaPaintOverride = {
  /**
   * Paints applied to characters
   */
  fills: FigmaPaint[];
  /**
   * ID of style node, if any, that this inherits fill data from
   */
  inheritFillStyleId?: FigmaNodeId;
}

/**
 * Metadata for character formatting
 */
export type FigmaTypeStyle = {
  /**
   * Font family of text (standard name)
   */
  fontFamily: string;
  /**
   * PostScript font name
   */
  fontPostScriptName: string;
  /**
   * Space between paragraphs in px, 0 if not present
   * @efault 0
   */
  paragraphSpacing: number;
  /**
   * Paragraph indentation in px, 0 if not present
   * @default 0
   */
  paragraphIndent?: number;
  /**
   * Space between list items in px, 0 if not present
   * @default 0
   */
  listSpacing: number;
  /**
   * Whether text is italicized
   */
  italic: boolean;
  /**
   * Numeric font weight
   */
  fontWeight: number;
  /**
   * Font size in px
   */
  fontSize: number;
  /**
   * Text casing applied to the node, default is the original casing
   * @default "ORIGINAL"
   */
  textCase?: FigmaTextCase
  /**
   * Text decoration applied to the node, default is none
   * @default "NONE"
   */
  textDecoration?: FigmaTextDecoration;
  /**
   * Dimensions along which text will auto resize,
   * default is that the text does not auto-resize.
   * @default "NONE"
   */
  textAutoResize?: FigmaTextAutoResize;
  /**
   * Whether this text node will truncate with an ellipsis
   * when the text contents is larger than the text node.
   * @default "DISABLED"
   */
  textTruncation?: FigmaTextTruncation;
  /**
   * When {@link FigmaTypeStyle.textTruncation}: "ENDING" is set,
   * maxLines determines how many lines a text node can grow to before it truncates.
   */
  maxLines: Nullable<number>;
  /**
   * Horizontal text alignment as string enum
   */
  textAlignHorizontal: FigmaTextAlignHorizontal;
  /**
   * Vertical text alignment as string enum
   */
  textAlignVertical: FigmaTextAlignVertical;
  /**
   * Space between characters in px
   */
  letterSpacing: number;
  /**
   * Paints applied to characters
   */
  fills: FigmaPaint[];
  /**
   * Link to a URL or frame
   */
  hyperlink?: FigmaHyperlink;
  /**
   * A map of OpenType feature flags to 1 or 0, 1 if it is enabled and 0 if it is disabled.
   * @default {}
   * @remarks Some flags aren't reflected here. For example, SMCP (small caps) is still represented by the textCase field.
   */
  opentypeFlags?: Record<string, number>;
  /**
   * Line height in px
   */
  lineHeightPx: number;
  /**
   * Line height as a percentage of normal line height.
   * @default 100
   * @deprecated in a future version of the API only lineHeightPx and lineHeightPercentFontSize will be returned.
   */
  lineHeightPercent: number;
  /**
   * Line height as a percentage of the font size.
   * Only returned when lineHeightPercent is not 100.
   */
  lineHeightPercentFontSize?: number;
  /**
   * The unit of the line height value specified by the user.
   */
  lineHeightUnit: FigmaLineHeightUnit;
}

/**
 * A description of a main component. Helps you identify which component instances are attached to
 */
export type FigmaComponent = {
  /**
   * The key of the component
   */
  key: string;
  /**
   * The name of the component
   */
  name: string;
  /**
   * The description of the component as entered in the editor
   */
  description: string;
  /**
   * The ID of the component set if the component belongs to one
   */
  componentSetId?: FigmaNodeId;
  /**
   * The documentation links for this component.
   */
  documentationLinks: FigmaDocumentationLink[];
  /**
   * Whether this component is a remote component that doesn't live in this file
   */
  remote: boolean;
}

/**
 * A description of a component set, which is a node containing a set of variants of a component
 */
export type FigmaComponentSet = {
  /**
   * The key of the component set
   */
  key: string;
  /**
   * The name of the component set
   */
  name: string;
  /**
   * The description of the component set as entered in the editor
   */
  description: string;
  /**
   * The documentation links for this component set.
   */
  documentationLinks: FigmaDocumentationLink[];
  /**
   * Whether this component set is a remote component set
   * that doesn't live in this file
   */
  remote: boolean;
}

/**
 * A set of properties that can be applied to nodes and published.
 * Styles for a property can be created in the corresponding property's panel
 * while editing a file.
 */
export type FigmaStyle = {
  /**
   * The key of the style
   */
  key: string;
  /**
   * The name of style
   */
  name: string;
  /**
   * The description of the style as entered in the editor
   */
  description: string;
  /**
   * Whether this style is a remote style that doesn't live in this file
   */
  remote: boolean;
  /**
   * The type of style as string enum
   */
  styleType: FigmaStyleType;
}

/**
 * ConnectorEndpoint with endpointNodeId and position only
 */
export type FigmaPositionConnectorEndpoint = {
  /**
   * Node ID this endpoint attaches to.
   */
  endpointNodeId: FigmaNodeId;
  /**
   * Canvas location as x & y coordinate.
   */
  position: FigmaVector;
}

/**
 * ConnectorEndpoint with endpointNodeId and magnet only
 */
export type FigmaMagnetConnectorEndpoint = {
  /**
   * Node ID this endpoint attaches to.
   */
  endpointNodeId: FigmaNodeId;
  /**
   * The magnet type is a string enum
   */
  magnet: FigjamConnectorMagnet;
}

export type FigmaConnectorEndpoint = FigmaMagnetConnectorEndpoint | FigmaPositionConnectorEndpoint;

/**
 * Separate declarations for each corner radii or a shape, frame or vector
 */
export type FigmaMixedCornerRadius = {
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
}

/**
 * Corner radius of a frame, shape or vector.
 */
export type FigmaCornerRadius = number | FigmaMixedCornerRadius;

/**
 * Connector text background.
 */
export type FigjamConnectorTextBackground = {
  /**
   * Radius of each corner of the rectangle if a single radius is set for all corners
   */
  cornerRadius: FigmaCornerRadius;
  /**
   * An array of fill paints applied to the node
   */
  fills: FigmaPaint[];
}

/**
 * Instance swap preferred value
 */
export type FigmaInstanceSwapPreferredValue = {
  /**
   * Type of node for this preferred value
   */
  type: FigmaInstanceSwapPreferredValueType;
  /**
   * Key of this component or component set
   */
  key: string;
}

/**
 * Component property definition
 */
export type FigmaComponentPropertyDefinition<TComponentPropType extends FigmaComponentPropertyType = FigmaComponentPropertyType> = {
  /**
   * Type of this component property
   */
  type: TComponentPropType;
  /**
   * Initial value of this property for instances
   */
  defaultValue:  TComponentPropType extends "BOOLEAN" ? boolean | string : string;
  /**
   * All possible values for this property.
   * @remarks Only exists on VARIANT properties
   */
  variantOptions?: TComponentPropType extends "VARIANT" ? string[] : never;
  /**
   * List of user-defined preferred values for this property.
   * @remarks Only exists on INSTANCE_SWAP properties
   */
  preferredValues?: TComponentPropType extends "INSTANCE_SWAP"
    ? FigmaInstanceSwapPreferredValue[]
    : never;
}

export type FigmaComponentProperty<TComponentPropType extends FigmaComponentPropertyType = FigmaComponentPropertyType> = {
  /**
   * Type of this component property
   */
  type: TComponentPropType;
  /**
   * Value of this property set on this instance
   */
  value: TComponentPropType extends "BOOLEAN" ? boolean | string : string;
  /**
   * List of user-defined preferred values for this property.
   * @remarks Only exists on INSTANCE_SWAP properties
   */
  preferredValues?: TComponentPropType extends "INSTANCE_SWAP"
    ? FigmaInstanceSwapPreferredValue[]
    : never;
  /**
   * A mapping of field to the VariableAlias of the bound variable.
   */
  boundVariables: FigmaBoundVariables;
}

/**
 * The device used to view a prototype
 */
export type FigmaPrototypeDevice = {
  /**
   * Type of device used to view a prototype
   */
  type: FigmaPrototypeDeviceType;
  /**
   * Size of device used to view a prototype
   */
  size: FigmaSize;
  /**
   * ID of device preset used to view a prototype
   */
  presetIdentifier: string;
  /**
   * Rotation of device used to view a prototype
   */
  rotation: FigmaPrototypeDeviceRotation;
}

/**
 * Individual stroke weights
 */
export type FigmaStrokeWeights = {
  /**
   * The top stroke weight
   */
  top: number;
  /**
   * The right stroke weight
   */
  right: number;
  /**
   * The bottom stroke weight
   */
  bottom: number;
  /**
   * The left stroke weight
   */
  left: number;
}

/**
 * Fields directly overridden on an instance.
 * Inherited overrides are not included.
 */
export type FigmaOverrides = {
  /**
   * A unique ID for a node
   */
  id: FigmaNodeId;
  /**
   * An array of properties
   */
  overriddenFields: string[];
}

export type FigmaDevStatus = Nullable<{
  type: "READY_FOR_DEV"
}>

/**
 * An array of paths representing the object stroke or fill
 */
export type FigmaVectorPath = {
  windingRule: FigmaVectorPathWindingRule;
  data: string;
}

/**
 * A mapping of a StyleType to style key of styles present on this node.
 * The style key can be used to look up more information about the style in the top-level styles field.
 */
export type FigmaNodeStyles = Record<FigmaStyleType, FigmaStyle["key"]>;