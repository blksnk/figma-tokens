import {
  FigmaArcData,
  FigmaColor,
  FigmaComponentProperty,
  FigmaComponentPropertyDefinition,
  FigmaConnectorEndpoint,
  FigjamConnectorTextBackground,
  FigmaDevStatus,
  FigmaEffect,
  FigmaExportSetting,
  FigmaFlowStartingPoint,
  FigmaNodeId,
  FigmaLayoutConstraint,
  FigmaLayoutGrid,
  FigmaNodeStyles,
  FigmaOverrides,
  FigmaPaint,
  FigmaPaintOverride,
  FigmaPluginData,
  FigmaPrototypeDevice,
  FigmaRectangle,
  FigmaSharedPluginData,
  FigmaSize,
  FigmaStrokeWeights,
  FigmaTransform,
  FigmaTypeStyle,
  FigmaVariableAlias,
  FigmaVector,
  FigmaVectorPath,
} from "./figma.properties.types";
import {
  FigjamConnectorStrokeCap,
  FigmaAxisSizingMode,
  FigmaBlendMode,
  FigmaBooleanOperation,
  FigjamConnectorLineType,
  FigmaCounterAxisAlignContent,
  FigmaCounterAxisAlignItems,
  FigmaEasingType,
  FigmaLayoutAlign,
  FigmaLayoutMode,
  FigmaLayoutPositioning,
  FigmaLayoutSizing,
  FigmaLayoutWrap,
  FigmaLineType,
  FigmaMaskType,
  FigmaNodeType,
  FigmaOverflowDirection,
  FigmaPrimaryAxisAlignItems,
  FigmaShapeType,
  FigmaStrokeAlign,
  FigmaStrokeCap,
  FigmaStrokeJoin,
  FigmaStyleType,
} from "./figma.enums.types";
import { Nullable } from "../global/global.types";

/**
 * The following are properties that exist on every node.
 * These give us some basic information about identifying and viewing the node.
 */
export type FigmaGlobalNode<TFigmaType extends FigmaNodeType = FigmaNodeType> =
  {
    /**
     * A string uniquely identifying this node within the document.
     */
    id: FigmaNodeId;
    /**
     * The name given to the node by the user in the tool.
     */
    name: string;
    /**
     * Whether the node is visible on the canvas.
     */
    visible: boolean;
    /**
     * The type of the node, refer to {@link FigmaNodeType}.
     */
    type: TFigmaType;
    /**
     * The rotation of the node, if not 0.
     */
    rotation: number;
    /**
     * Data written by plugins that is visible only to the plugin that wrote it.
     * Requires the `pluginData` to include the ID of the plugin.
     */
    pluginData: FigmaPluginData;
    /**
     * Data written by plugins that is visible to all plugins.
     * Requires the `pluginData` parameter to include the string "shared".
     */
    sharedPluginData: FigmaSharedPluginData;
    /**
     * A mapping of a layer's property to component property name
     * of component properties attached to this node.
     * The component property name can be used to look up more information
     * on the corresponding component's or component set's componentPropertyDefinitions.
     */
    componentPropertyReferences: Map<string, string>;
    /**
     * A mapping of field to the variables applied to this field.
     * Most fields will only map to a single {@link FigmaVariableAlias}.
     * However, for fills, strokes, size, and component properties,
     * it is possible to have multiple variables bound to the field.
     */
    boundVariables: Map<string, FigmaVariableAlias | FigmaVariableAlias[]>;
  };

export interface FigmaDocumentNode extends FigmaGlobalNode<"DOCUMENT"> {
  /**
   * An array of canvases attached to the document
   */
  children: FigmaCanvasNode[];
}

export interface FigmaCanvasNode extends FigmaGlobalNode<"CANVAS"> {
  /**
   * An array of top level layers on the canvas
   */
  children: FigmaAnyNode[];
  /**
   * Background color of the canvas.
   */
  backgroundColor: FigmaColor;
  /**
   * Node ID that corresponds to the start frame for prototypes.
   * @deprecated with the introduction of multiple flows. Please use the flowStartingPoints field.
   */
  prototypeStarNodeID: FigmaNodeId;
  /**
   * Array of flow starting points sorted by its position in the prototype settings panel.
   * @default []
   */
  flowStartingPoints: FigmaFlowStartingPoint[];
  /**
   * The device used to view a prototype
   */
  prototypeDevice: FigmaPrototypeDevice;
  /**
   * An array of export settings representing images to export from the canvas
   * @default []
   */
  exportSettings: FigmaExportSetting[];
}

export interface FigmaFrameNode<TNodeType extends FigmaNodeType = "FRAME">
  extends FigmaGlobalNode<TNodeType> {
  /**
   * An array of nodes that are direct children of this node
   */
  children: FigmaAnyNode[];
  /**
   * If true, layer is locked and cannot be edited
   * @default false
   */
  locked: boolean;
  /**
   * Background of the node.
   * @deprecated as backgrounds for frames are now in the fills field.
   */
  background: FigmaPaint[];
  /**
   * Background color of the node.
   * @deprecated as frames now support more than a solid color as a background. Please use the fills field instead.
   */
  backgroundColor: FigmaColor;
  /**
   * An array of fill paints applied to the node
   * @default []
   */
  fills: FigmaPaint[];
  /**
   * An array of stroke paints applied to the node
   * @default []
   */
  strokes: FigmaPaint[];
  /**
   * The weight of strokes on the node
   */
  strokeWeight: number;
  /**
   * Position of stroke relative to vector outline, as a string enum
   */
  strokeAlign: FigmaStrokeAlign;
  /**
   * An array of floating point numbers describing
   * the pattern of dash length and gap lengths that the vector path follows.
   * @default []
   * @example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
   */
  strokeDashes: number[];
  /**
   * Radius of each corner of the frame if a single radius is set for all corners
   */
  cornerRadius: number;
  /**
   * Array of length 4 of the radius of each corner of the frame,
   * starting in the top left and proceeding clockwise
   * @default same as {@link FigmaFrameNode.cornerRadius}
   */
  rectangleCornerRadii: number | [number, number, number, number];
  /**
   * A value that lets you control how "smooth" the corners are.
   * Ranges from 0 to 1.
   * @default 0
   * 0 is the default and means that the corner is perfectly circular.
   * A value of 0.6 means the corner matches the iOS 7 "squircle" icon shape.
   * Other values produce various other curves.
   */
  cornerSmoothing: number;
  /**
   * An array of export settings representing images to export from the node
   * @default []
   */
  exportSettings: FigmaExportSetting[];
  /**
   * How this node blends with nodes behind it in the scene
   */
  blendMode: FigmaBlendMode;
  /**
   * Keep height and width constrained to same ratio
   * @default false
   */
  preserveRatio: boolean;
  /**
   * Horizontal and vertical layout constraints for node
   */
  constraints: FigmaLayoutConstraint;
  /**
   * Determines if the layer should stretch along the parent’s counter axis.
   * @remarks This property is only provided for direct children of auto-layout frames.
   */
  layoutAlign?: FigmaLayoutAlign;
  /**
   * Node ID of node to transition to in prototyping
   * @default null
   */
  transitionNodeID: Nullable<FigmaNodeId>;
  /**
   * The duration of the prototyping transition on this node (in milliseconds)
   * @default null
   */
  transitionDuration: Nullable<number>;
  /**
   * The easing curve used in the prototyping transition on this node
   * @default null
   */
  transitionEasing: Nullable<FigmaEasingType>;
  /**
   * Opacity of the node
   * @default 1
   */
  opacity: number;
  /**
   * Bounding box of the node in absolute space coordinates
   */
  absoluteBoundingBox: FigmaRectangle;
  /**
   * The bounds of the rendered node in the file in absolute space coordinates
   */
  absoluteRenderBounds: FigmaRectangle;
  /**
   * Width and height of element.
   * This is different from the width and height of the bounding box
   * in that the absolute bounding box represents the element after scaling and rotation.
   * @remarks Only present if geometry=paths is passed
   */
  size?: FigmaVector;
  /**
   * The minWidth of the frame, or null if not set.
   * @default null
   */
  minWidth: Nullable<number>;
  /**
   * The maxWidth of the frame, or null if not set.
   * @default null
   */
  maxWidth: Nullable<number>;
  /**
   * The minHeight of the frame, or null if not set.
   * @default null
   */
  minHeight: Nullable<number>;
  /**
   * The maxHeight of the frame, or null if not set.
   * @default null
   */
  maxHeight: Nullable<number>;
  /**
   * The top two rows of a matrix that represents the 2D transform of this node relative to its parent.
   * The bottom row of the matrix is implicitly always (0, 0, 1).
   * Use to transform coordinates in geometry.
   * @remarks Only present if geometry=paths is passed
   */
  relativeTransform?: FigmaTransform;
  /**
   * Whether this node clip content outside its bounds
   */
  clipsContent: boolean;
  /**
   * Whether this layer uses auto-layout to position its children.
   * @default "NONE"
   */
  layoutMode: FigmaLayoutMode;
  /**
   * The horizontal sizing setting on this auto-layout frame or frame child.
   * @remarks HUG is only valid on auto-layout frames and text nodes. FILL is only valid on auto-layout frame children.
   */
  layoutSizingHorizontal?: FigmaLayoutSizing;
  /**
   * The vertical sizing setting on this auto-layout frame or frame child.
   * @remarks HUG is only valid on auto-layout frames and text nodes. FILL is only valid on auto-layout frame children.
   */
  layoutSizingVertical?: FigmaLayoutSizing;
  /**
   * Whether this auto-layout frame has wrapping enabled.
   * @default "NO_WRAP"
   */
  layoutWrap?: FigmaLayoutWrap;
  /**
   * Whether the primary axis has a fixed length (determined by the user)
   * or an automatic length (determined by the layout engine).
   * @default "AUTO"
   * @remarks This property is only applicable for auto-layout frames.
   */
  primaryAxisSizingMode?: FigmaAxisSizingMode;
  /**
   * Whether the counter axis has a fixed length (determined by the user)
   * or an automatic length (determined by the layout engine).
   * @default "AUTO"
   * @remarks This property is only applicable for auto-layout frames.
   */
  counterAxisSizingMode?: FigmaAxisSizingMode;
  /**
   * Determines how the auto-layout frame’s children should be aligned
   * in the primary axis direction.
   * @default "MIN"
   * @remarks This property is only applicable for auto-layout frames.
   */
  primaryAxisAlignItems?: FigmaPrimaryAxisAlignItems;
  /**
   * Determines how the auto-layout frame’s children should be aligned
   * in the counter axis direction.
   * @default "MIN"
   * @remarks This property is only applicable for auto-layout frames.
   */
  counterAxisAlignItems?: FigmaCounterAxisAlignItems;
  /**
   * Determines how the auto-layout frame’s wrapped tracks should be aligned
   * in the counter axis direction.
   * @default "AUTO"
   * @remarks This property is only applicable for auto-layout frames with layoutWrap: "WRAP".
   */
  counterAxisAlignContent?: FigmaCounterAxisAlignContent;
  /**
   * The padding between the left border of the frame and its children.
   * @default 0
   * @remarks This property is only applicable for auto-layout frames.
   */
  paddingLeft?: number;
  /**
   * The padding between the right border of the frame and its children.
   * @default 0
   * @remarks This property is only applicable for auto-layout frames.
   */
  paddingRight?: number;
  /**
   * The padding between the top border of the frame and its children.
   * @default 0
   * @remarks This property is only applicable for auto-layout frames.
   */
  paddingTop?: number;
  /**
   * The padding between the bottom border of the frame and its children.
   * @default 0
   * @remarks This property is only applicable for auto-layout frames.
   */
  paddingBottom?: number;
  /**
   * The horizontal padding between the borders of the frame and its children.
   * @default 0
   * @remarks This property is only applicable for auto-layout frames.
   * @deprecated in favor of setting individual paddings.
   */
  horizontalPadding?: number;
  /**
   * The vertical padding between the borders of the frame and its children.
   * @default 0
   * @remarks This property is only applicable for auto-layout frames.
   * @deprecated in favor of setting individual paddings.
   */
  verticalPadding?: number;
  /**
   * The distance between children of the frame. Can be negative.
   * @default 0
   * @remarks This property is only applicable for auto-layout frames.
   */
  itemSpacing?: number;
  /**
   * The distance between wrapped tracks of an auto-layout frame.
   * @default 0
   * @remarks This property is only applicable for auto-layout frames with layoutWrap: "WRAP".
   */
  counterAxisSpacing?: number;
  /**
   * Determines whether a layer's size and position should be determined
   * by auto-layout settings or manually adjustable.
   * @default "AUTO"
   */
  layoutPositioning?: FigmaLayoutPositioning;
  /**
   * Determines the canvas stacking order of layers in this frame.
   * When true, the first layer will be draw on top.
   * @default false
   * @remarks This property is only applicable for auto-layout frames.
   */
  itemReverseZIndex?: boolean;
  /**
   * Determines whether strokes are included in layout calculations.
   * When true, auto-layout frames behave like css "box-sizing: border-box".
   * @default false
   * @remarks This property is only applicable for auto-layout frames.
   */
  strokesIncludedInLayout?: boolean;
  /**
   * An array of layout grids attached to this node;
   * @default []
   */
  layoutGrids: FigmaLayoutGrid[];
  /**
   * Defines the scrolling behavior of the frame, if there exist contents outside the frame boundaries.
   * The frame can either scroll vertically, horizontally, or in both directions
   * to the extents of the content contained within it.
   * @default "NONE"
   * @remarks This behavior can be observed in a prototype.
   */
  overflowDirection: FigmaOverflowDirection;
  /**
   * An array of effects attached to this node
   * @default []
   */
  effects: FigmaEffect[];
  /**
   * Does this node mask sibling nodes in front of it?
   * @default false
   */
  isMask: boolean;
  /**
   * Whether the mask ignores fill style (e.g. gradients) and effects.
   * @default false
   * @deprecated please use the maskType field instead (isMaskOutline=true corresponds to maskType="VECTOR").
   */
  isMaskOutline: boolean;
  /**
   * If this layer is a mask, this property describes the operation used to mask the layer's siblings.
   * @remarks Only present if isMask = true
   */
  maskType?: FigmaMaskType;
  /**
   * A mapping of a StyleType to style key of styles present on this node.
   * The style key can be used to look up more information about the style in the top-level styles field.
   */
  styles: FigmaNodeStyles;
}

export type FigmaGroupNode = Omit<FigmaFrameNode, "layoutGrids">;

export interface FigmaSectionNode extends FigmaGlobalNode<"SECTION"> {
  /**
   * Whether the contents of the section are visible
   * @default false
   */
  sectionContentsHidden: boolean;
  /**
   * Whether the section is marked Ready for dev.
   * @default null
   */
  devStatus: FigmaDevStatus;
  /**
   * An array of fill paints applied to the node
   * @default []
   */
  fills: FigmaPaint[];
  /**
   * An array of stroke paints applied to the node
   * @default []
   */
  strokes: FigmaPaint[];
  /**
   * The weight of strokes on the node
   */
  strokeWeight: number;
  /**
   * Position of stroke relative to vector outline, as a string enum
   */
  strokeAlign: FigmaStrokeAlign;
  /**
   * An array of nodes that are contained in the section
   * @default []
   */
  children: FigmaAnyNode[];
  /**
   * Bounding box of the node in absolute space coordinates
   */
  absoluteBoundingBox: FigmaRectangle;
  /**
   * The bounds of the rendered node in the file in absolute space coordinates
   */
  absoluteRenderBounds: FigmaRectangle;
}

export interface FigmaVectorNode<TNodeType extends FigmaNodeType = "VECTOR">
  extends FigmaGlobalNode<TNodeType> {
  /**
   * If true, layer is locked and cannot be edited
   * @default false
   */
  locked: boolean;
  /**
   * An array of export settings representing images to export from the node
   * @default []
   */
  exportSettings: FigmaExportSetting[];
  /**
   * How this node blends with nodes behind it in the scene
   */
  blendMode: FigmaBlendMode;
  /**
   * Keep height and width constrained to same ratio
   * @default false
   */
  preserveRatio: boolean;
  /**
   * Determines if the layer should stretch along the parent’s counter axis.
   * @remarks This property is only provided for direct children of auto-layout frames.
   */
  layoutAlign?: FigmaLayoutAlign;
  /**
   * Determines whether a layer should stretch along the parent’s primary axis.
   * @example A 0 corresponds to a fixed size and 1 corresponds to stretch
   * @remarks This property is applicable only for direct children of auto-layout frames, ignored otherwise.
   */
  layoutGrow?: number;
  /**
   * Horizontal and vertical layout constraints for node
   */
  constraints: FigmaLayoutConstraint;
  /**
   * Node ID of node to transition to in prototyping
   * @default null
   */
  transitionNodeID: Nullable<FigmaNodeId>;
  /**
   * The duration of the prototyping transition on this node (in milliseconds)
   * @default null
   */
  transitionDuration: Nullable<number>;
  /**
   * The easing curve used in the prototyping transition on this node
   * @default null
   */
  transitionEasing: Nullable<FigmaEasingType>;
  /**
   * Opacity of the node
   * @default 1
   */
  opacity: number;
  /**
   * Bounding box of the node in absolute space coordinates
   */
  absoluteBoundingBox: FigmaRectangle;
  /**
   * The bounds of the rendered node in the file in absolute space coordinates
   */
  absoluteRenderBounds: FigmaRectangle;
  /**
   * An array of effects attached to this node.
   * @default []
   */
  effects: FigmaEffect[];
  /**
   * Width and height of element.
   * This is different from the width and height of the bounding box
   * in that the absolute bounding box represents the element after scaling and rotation.
   * @remarks Only present if geometry=paths is passed
   */
  size: FigmaSize;
  /**
   * The top two rows of a matrix that represents the 2D transform of this node relative to its parent.
   * The bottom row of the matrix is implicitly always (0, 0, 1).
   * Use to transform coordinates in geometry.
   * @remarks Only present if geometry=paths is passed
   */
  relativeTransform: FigmaTransform;
  /**
   * Does this node mask sibling nodes in front of it?
   * @default false
   */
  isMask: boolean;
  /**
   * An array of fill paints applied to the node
   * @default []
   */
  fills: FigmaPaint[];
  /**
   * An array of paths representing the object fill;
   * @remarks Only present if geometry=paths is passed
   */
  fillGeometry?: FigmaVectorPath[];
  /**
   * Map from ID to PaintOverride for looking up fill overrides.
   * To see which regions are overridden, you must use the geometry=paths option.
   * @remarks Each path returned may have an overrideId which maps to this table.
   */
  fillOverrideTable: Record<number, FigmaPaintOverride>;
  /**
   * An array of stroke paints applied to the node
   * @default []
   */
  strokes: FigmaPaint[];
  /**
   * The weight of strokes on the node
   */
  strokeWeight: number;
  /**
   * An object including the top, bottom, left, and right stroke weights.
   * @remarks Only returned if individual stroke weights are used.
   */
  individualStrokeWeights?: FigmaStrokeWeights;
  /**
   * An enum describing the end caps of vector paths.
   * @default "NONE"
   */
  strokeCap: FigmaStrokeCap;
  /**
   * An enum describing how corners in vector paths are rendered.
   * @default "MITER"
   */
  strokeJoin: FigmaStrokeJoin;
  /**
   * An array of floating point numbers describing the pattern of dash length
   * and gap lengths that the vector path follows.
   * @default []
   * @example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
   */
  strokeDashes: number[];
  /**
   * Only valid if strokeJoin is "MITER".
   * The corner angle, in degrees, below which strokeJoin will be set to "BEVEL"
   * to avoid super sharp corners.
   * @default 28.96 degrees
   */
  strokeMiterAngle: number;
  /**
   * An array of paths representing the object stroke
   * @remarks Only specified if parameter geometry=paths is used.
   */
  strokeGeometry?: FigmaVectorPath[];
  /**
   * Position of stroke relative to vector outline
   */
  strokeAlign: FigmaStrokeAlign;
  /**
   * A mapping of a StyleType to style key of styles present on this node.
   * The style key can be used to look up more information about the style in the top-level styles field.
   */
  styles: FigmaNodeStyles;
}

export interface FigmaBooleanOperationNode
  extends FigmaVectorNode<"BOOLEAN_OPERATION"> {
  /**
   * An array of nodes that are being boolean operated on
   */
  children: FigmaAnyNode[];
  /**
   * Indicates the type of boolean operation applied to one or more nodes
   */
  booleanOperation: FigmaBooleanOperation;
}

export type FigmaStarNode = FigmaVectorNode<"STAR">;

export type FigmaLineNode = FigmaVectorNode<"LINE">;

export interface FigmaEllipseNode extends FigmaVectorNode<"ELLIPSE"> {
  /**
   * Start and end angles of the ellipse measured clockwise from the x axis, plus the inner radius for donuts
   */
  arcData: FigmaArcData;
}

export type FigmaRegularPolygonNode = FigmaVectorNode<"REGULAR_POLYGON">;

export interface FigmaRectangleNode extends FigmaVectorNode<"RECTANGLE"> {
  /**
   * Radius of each corner of the frame if a single radius is set for all corners
   */
  cornerRadius: number;
  /**
   * Array of length 4 of the radius of each corner of the frame,
   * starting in the top left and proceeding clockwise
   * @default same as {@link FigmaFrameNode.cornerRadius}
   */
  rectangleCornerRadii: number | [number, number, number, number];
  /**
   * A value that lets you control how "smooth" the corners are.
   * Ranges from 0 to 1.
   * @default 0
   * 0 is the default and means that the corner is perfectly circular.
   * A value of 0.6 means the corner matches the iOS 7 "squircle" icon shape.
   * Other values produce various other curves.
   */
  cornerSmoothing: number;
}

export interface FigjamTableCellNode extends FigmaGlobalNode<"TABLE_CELL"> {
  /**
   * Bounding box of the node in absolute space coordinates
   */
  absoluteBoundingBox: FigmaRectangle;
  /**
   * The bounds of the rendered node in the file in absolute space coordinates
   */
  absoluteRenderBounds: FigmaRectangle;
  /**
   * Text contained within a text box
   */
  characters: string;
  /**
   * An array of fill paints applied to the node
   * @default []
   */
  fills: FigmaPaint[];
  /**
   * The top two rows of a matrix that represents the 2D transform of this node relative to its parent.
   * The bottom row of the matrix is implicitly always (0, 0, 1).
   * Use to transform coordinates in geometry.
   * @remarks Only present if geometry=paths is passed
   */
  relativeTransform?: FigmaTransform;
  /**
   * Width and height of element.
   * This is different from the width and height of the bounding box
   * in that the absolute bounding box represents the element after scaling and rotation.
   * @remarks Only present if geometry=paths is passed
   */
  size: FigmaVector;
}

/**
 * Figjam table node
 * */
export interface FigjamTableNode extends FigmaGlobalNode<"TABLE"> {
  /**
   * Bounding box of the node in absolute space coordinates
   */
  absoluteBoundingBox: FigmaRectangle;
  /**
   * The bounds of the rendered node in the file in absolute space coordinates
   */
  absoluteRenderBounds: FigmaRectangle;
  /**
   * How this node blends with nodes behind it in the scene
   */
  blendMode: FigmaBlendMode;
  /**
   * An array of table cell nodes within the table.
   * The table cells are sorted by row, then column.
   */
  children: FigjamTableCellNode[];
  /**
   * Horizontal and vertical layout constraints for node
   */
  constraints: FigmaLayoutConstraint;
  /**
   * An array of effects attached to this node
   * @default []
   */
  effects: FigmaEffect[];
  /**
   * An array of export settings representing images to export from the node
   * @default []
   */
  exportSettings: FigmaExportSetting[];
  /**
   * The top two rows of a matrix that represents the 2D transform of this node relative to its parent.
   * The bottom row of the matrix is implicitly always (0, 0, 1).
   * Use to transform coordinates in geometry.
   * @remarks Only present if geometry=paths is passed
   */
  relativeTransform?: FigmaTransform;
  /**
   * Width and height of element.
   * This is different from the width and height of the bounding box
   * in that the absolute bounding box represents the element after scaling and rotation.
   * @remarks Only present if geometry=paths is passed
   */
  size: FigmaVector;
  /**
   * An array of stroke paints applied to the node
   * @default []
   */
  strokes: FigmaPaint[];
  /**
   * Position of stroke relative to vector outline, as a string enum
   */
  strokeAlign: FigmaStrokeAlign;
  /**
   * The weight of strokes on the node
   */
  strokeWeight: number;
}

export interface FigmaTextNode
  extends Omit<FigmaVectorNode<"TEXT">, "fillOverrideTable"> {
  /**
   * Text contained within a text box
   */
  characters: string;
  /**
   * Style of text including font family and weight
   */
  style: FigmaTypeStyle;
  /**
   * Array with same number of elements as characters in text box,
   * each element is a reference to the styleOverrideTable defined below
   * and maps to the corresponding character in the characters field.
   * @remarks Elements with value 0 have the default type style
   */
  characterStyleOverrides: number[];
  /**
   * Map from ID to {@link FigmaTypeStyle} for looking up style overrides
   */
  styleOverrideTable: Record<number, FigmaTypeStyle>;
  /**
   * An array with the same number of elements as lines in the text node,
   * where lines are delimited by newline or paragraph separator characters.
   * @remarks Each element in the array corresponds to the list type of a specific line.
   */
  lineTypes: FigmaLineType[];
  /**
   * An array with the same number of elements as lines in the text node,
   * where lines are delimited by newline or paragraph separator characters.
   * @remarks Each element in the array corresponds to the indentation level of a specific line.
   */
  lineIndentations: number[];
}

export interface FigmaSliceNode extends FigmaGlobalNode<"SLICE"> {
  /**
   * An array of export settings representing images to export from the node
   * @default []
   */
  exportSettings: FigmaExportSetting[];
  /**
   * Bounding box of the node in absolute space coordinates
   */
  absoluteBoundingBox: FigmaRectangle;
  /**
   * The bounds of the rendered node in the file in absolute space coordinates
   */
  absoluteRenderBounds: FigmaRectangle;
  /**
   * Width and height of element.
   * This is different from the width and height of the bounding box
   * in that the absolute bounding box represents the element after scaling and rotation.
   * @remarks Only present if geometry=paths is passed
   */
  size: FigmaVector;
  /**
   * The top two rows of a matrix that represents the 2D transform of this node relative to its parent.
   * The bottom row of the matrix is implicitly always (0, 0, 1).
   * Use to transform coordinates in geometry.
   * @remarks Only present if geometry=paths is passed
   */
  relativeTransform?: FigmaTransform;
}

export interface FigmaComponentNode extends FigmaFrameNode<"COMPONENT"> {
  /**
   * A mapping of name to ComponentPropertyDefinition for every component property on this component.
   * Each property has a type, defaultValue, and other optional values
   */
  componentPropertyDefinitions: Record<
    string,
    FigmaComponentPropertyDefinition
  >;
}

export interface FigmaComponentSetNode extends FigmaFrameNode<"COMPONENT_SET"> {
  /**
   * A mapping of name to ComponentPropertyDefinition for every component property on this component.
   * Each property has a type, defaultValue, and other optional values
   */
  componentPropertyDefinitions: Record<
    string,
    FigmaComponentPropertyDefinition
  >;
}

/**
 * Component instance node that holds a reference to its root component declaration
 */
export interface FigmaInstanceNode extends FigmaFrameNode<"INSTANCE"> {
  /**
   * ID of component that this instance came from,
   * refers to components table
   */
  componentId: FigmaNodeId;
  /**
   * If true, this node has been marked as exposed
   * to its containing component or component set
   * @default false
   */
  isExposedInstance: boolean;
  /**
   * IDs of instances that have been exposed to this node's level
   * @default []
   */
  exposedInstances: FigmaNodeId[];
  /**
   * A mapping of name to ComponentProperty for all component properties on this instance.
   * Each property has a type, value, and other optional values
   * @default {}
   */
  componentProperties: Record<string, FigmaComponentProperty>;
  /**
   * An array of all fields directly overridden on this instance.
   * @default []
   * @remarks Inherited overrides are not included.
   */
  overrides: FigmaOverrides[];
}

export interface FigjamStickyNode extends FigmaGlobalNode<"STICKY"> {
  /**
   * Bounding box of the node in absolute space coordinates
   */
  absoluteBoundingBox: FigmaRectangle;
  /**
   * The bounds of the rendered node in the file in absolute space coordinates
   */
  absoluteRenderBounds: FigmaRectangle;
  /**
   * If true, author name is visible.
   * @default false
   */
  authorVisible: boolean;
  /**
   * Background color of the node.
   * @deprecated as frames now support more than a solid color as a background. Please use the fills field instead.
   */
  backgroundColor: FigmaColor;
  /**
   * How this node blends with nodes behind it in the scene
   */
  blendMode: FigmaBlendMode;
  /**
   * Text contained within a text box
   */
  characters: string;
  /**
   * An array of effects attached to this node
   * @default []
   */
  effects: FigmaEffect[];
  /**
   * An array of export settings representing images to export from the node
   * @default []
   */
  exportSettings: FigmaExportSetting[];
  /**
   * An array of fill paints applied to the node
   * @default []
   */
  fills: FigmaPaint[];
  /**
   * If true, sticky is locked and cannot be edited
   * @default false
   */
  locked: boolean;
  /**
   * Overall opacity of paint
   * @remarks colors within the paint can also have opacity values which would blend with this
   */
  opacity: number;
  /**
   * The top two rows of a matrix that represents the 2D transform of this node relative to its parent.
   * The bottom row of the matrix is implicitly always (0, 0, 1).
   * Use to transform coordinates in geometry.
   * @remarks Only present if geometry=paths is passed
   */
  relativeTransform?: FigmaTransform;
}

export interface FigjamShapeWithTextNode
  extends FigmaGlobalNode<"SHAPE_WITH_TEXT"> {
  /**
   * Bounding box of the node in absolute space coordinates
   */
  absoluteBoundingBox: FigmaRectangle;
  /**
   * The bounds of the rendered node in the file in absolute space coordinates
   */
  absoluteRenderBounds: FigmaRectangle;
  /**
   * Background color of the node.
   */
  backgroundColor: FigmaColor;
  /**
   * How this node blends with nodes behind it in the scene
   */
  blendMode: FigmaBlendMode;
  /**
   * Text contained within a text box
   */
  characters: string;
  /**
   * Radius of each corner of the frame if a single radius is set for all corners
   */
  cornerRadius: number;
  /**
   * Array of length 4 of the radius of each corner of the frame,
   * starting in the top left and proceeding clockwise
   * @default same as {@link FigmaFrameNode.cornerRadius}
   */
  rectangleCornerRadii: number | [number, number, number, number];
  /**
   * A value that lets you control how "smooth" the corners are.
   * Ranges from 0 to 1.
   * @default 0
   * 0 is the default and means that the corner is perfectly circular.
   * A value of 0.6 means the corner matches the iOS 7 "squircle" icon shape.
   * Other values produce various other curves.
   */
  cornerSmoothing: number;
  /**
   * An array of effects attached to this node
   * @default []
   */
  effects: FigmaEffect[];
  /**
   * An array of export settings representing images to export from the node
   * @default []
   */
  exportSettings: FigmaExportSetting[];
  /**
   * An array of fill paints applied to the node
   * @default []
   */
  fills: FigmaPaint[];
  /**
   * Does this node mask sibling nodes in front of it?
   * @default false
   */
  isMask: boolean;
  /**
   * If true, sticky is locked and cannot be edited
   * @default false
   */
  locked: boolean;
  /**
   * Overall opacity of paint
   * @remarks colors within the paint can also have opacity values which would blend with this
   */
  opacity: number;
  /**
   * Shape-with-text geometric shape type.
   */
  shapeType: FigmaShapeType;
  /**
   * An array of stroke paints applied to the node
   * @default []
   */
  strokes: FigmaPaint[];
  /**
   * The weight of strokes on the node
   */
  strokeWeight: number;
  /**
   * An enum describing the end caps of vector paths.
   * @default "NONE"
   */
  strokeCap: FigmaStrokeCap;
  /**
   * An enum describing how corners in vector paths are rendered.
   * @default "MITER"
   */
  strokeJoin: FigmaStrokeJoin;
  /**
   * An array of floating point numbers describing the pattern of dash length
   * and gap lengths that the vector path follows.
   * @default []
   * @example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
   */
  strokeDashes: number[];
  /**
   * Position of stroke relative to vector outline
   */
  strokeAlign: FigmaStrokeAlign;
  /**
   * The top two rows of a matrix that represents the 2D transform of this node relative to its parent.
   * The bottom row of the matrix is implicitly always (0, 0, 1).
   * Use to transform coordinates in geometry.
   * @remarks Only present if geometry=paths is passed
   */
  relativeTransform?: FigmaTransform;
  /**
   * A mapping of a StyleType to style ID (see Style) of styles present on this node.
   * The style ID can be used to look up more information about the style in the top-level styles field.
   */
  styles: Record<FigmaStyleType, string>;
}

/**
 * Figjam connector node
 */
export interface FigjamConnectorNode extends FigmaGlobalNode<"CONNECTOR"> {
  /**
   * Bounding box of the node in absolute space coordinates
   */
  absoluteBoundingBox: FigmaRectangle;
  /**
   * The bounds of the rendered node in the file in absolute space coordinates
   */
  absoluteRenderBounds: FigmaRectangle;
  /**
   * Background color of the node.
   * @deprecated as frames now support more than a solid color as a background. Please use the fills field instead.
   */
  backgroundColor: FigmaColor;
  /**
   * How this node blends with nodes behind it in the scene
   */
  blendMode: FigmaBlendMode;
  /**
   * Text contained within a text box
   */
  characters: string;
  /**
   * Connector starting endpoint.
   */
  connectorStart: FigmaConnectorEndpoint;
  /**
   * Connector ending endpoint.
   */
  connectorEnd: FigmaConnectorEndpoint;
  /**
   * An enum describing the end cap of the start of the connector.
   * @default "NONE"
   */
  connectorStartStrokeCap: FigjamConnectorStrokeCap;
  /**
   * An enum describing the end cap of the end of the connector.
   * @default "NONE"
   */
  connectorEndStrokeCap: FigjamConnectorStrokeCap;
  /**
   * Connector line type
   */
  connectorLineType: FigjamConnectorLineType;
  /**
   * Radius of each corner of the frame if a single radius is set for all corners
   */
  cornerRadius: number;
  /**
   * Array of length 4 of the radius of each corner of the frame,
   * starting in the top left and proceeding clockwise
   * @default same as {@link FigmaFrameNode.cornerRadius}
   */
  rectangleCornerRadii: number | [number, number, number, number];
  /**
   * A value that lets you control how "smooth" the corners are.
   * Ranges from 0 to 1.
   * @default 0
   * 0 is the default and means that the corner is perfectly circular.
   * A value of 0.6 means the corner matches the iOS 7 "squircle" icon shape.
   * Other values produce various other curves.
   */
  cornerSmoothing: number;
  /**
   * An array of effects attached to this node
   * @default []
   */
  effects: FigmaEffect[];
  /**
   * An array of export settings representing images to export from the node
   * @default []
   */
  exportSettings: FigmaExportSetting[];
  /**
   * An array of fill paints applied to the node
   * @default []
   */
  fills: FigmaPaint[];
  /**
   * Does this node mask sibling nodes in front of it?
   * @default false
   */
  isMask: boolean;
  /**
   * If true, sticky is locked and cannot be edited
   * @default false
   */
  locked: boolean;
  /**
   * Overall opacity of paint
   * @remarks colors within the paint can also have opacity values which would blend with this
   */
  opacity: number;
  /**
   * An array of stroke paints applied to the node
   * @default []
   */
  strokes: FigmaPaint[];
  /**
   * The weight of strokes on the node
   */
  strokeWeight: number;
  /**
   * An enum describing the end caps of vector paths.
   * @default "NONE"
   */
  strokeCap: FigmaStrokeCap;
  /**
   * An enum describing how corners in vector paths are rendered.
   * @default "MITER"
   */
  strokeJoin: FigmaStrokeJoin;
  /**
   * An array of floating point numbers describing the pattern of dash length
   * and gap lengths that the vector path follows.
   * @default []
   * @example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
   */
  strokeDashes: number[];
  /**
   * Position of stroke relative to vector outline
   */
  strokeAlign: FigmaStrokeAlign;
  /**
   * Connector text background.
   */
  textBackground: FigjamConnectorTextBackground;
  /**
   * The top two rows of a matrix that represents the 2D transform of this node relative to its parent.
   * The bottom row of the matrix is implicitly always (0, 0, 1).
   * Use to transform coordinates in geometry.
   * @remarks Only present if geometry=paths is passed
   */
  relativeTransform?: FigmaTransform;
  /**
   * A mapping of a StyleType to style ID (see Style) of styles present on this node.
   * The style ID can be used to look up more information about the style in the top-level styles field.
   */
  styles: Record<FigmaStyleType, string>;
}

export type FigjamWashiTapeNode = FigmaVectorNode<"WASHI_TAPE">;

export type FigmaAnyNode =
  | FigmaFrameNode
  | FigmaGroupNode
  | FigmaSectionNode
  | FigmaVectorNode
  | FigmaBooleanOperationNode
  | FigmaStarNode
  | FigmaLineNode
  | FigmaEllipseNode
  | FigmaRegularPolygonNode
  | FigmaRectangleNode
  | FigmaTextNode
  | FigmaSliceNode
  | FigmaComponentNode
  | FigmaComponentSetNode
  | FigmaInstanceNode
  | FigjamTableNode
  | FigjamTableCellNode
  | FigjamStickyNode
  | FigjamShapeWithTextNode
  | FigjamConnectorNode
  | FigjamWashiTapeNode;
