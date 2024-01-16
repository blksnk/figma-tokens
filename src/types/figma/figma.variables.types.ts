/**
 * Variables in Figma have preset types (string, boolean, float, etc…),
 * belong to a variable collection, and hold a different value for each mode in the collection.
 *
 * Certain node properties can bind to variables, enabling these properties to change dynamically
 * when variables are updated or when the node is associated with a different mode.
 */
import { FigmaColor } from "./figma.properties.types";
import {
  FigmaColorVariableScope,
  FigmaFloatVariableScope,
  FigmaVariableType,
} from "./figma.enums.types";

export type FigmaVariableId = string;
export type FigmaVariableKey = string;
export type FigmaVariableCollectionId = string;
export type FigmaVariableCollectionKey = string;
export type FigmaVariableModeId = string;

/**
 * A single mode among those defined in a {@link FigmaVariableCollection}.
 */
export type FigmaVariableMode = {
  modeId: FigmaVariableModeId;
  name: string;
};

/**
 * A grouping of related Variable objects each with the same modes.
 */
export type FigmaVariableCollection = {
  /**
   * The unique identifier of this variable collection.
   */
  id: FigmaVariableCollectionId;
  /**
   * The name of this variable collection.
   */
  name: string;
  /**
   * The key of the variable collection.
   */
  key: FigmaVariableCollectionKey;
  /**
   * The list of modes defined for this variable collection.
   */
  modes: FigmaVariableMode[];
  /**
   * The id of the default mode.
   */
  defaultModeId: FigmaVariableModeId;
  /**
   * Whether the variable collection is remote.
   */
  remote: boolean;
  /**
   * Whether this variable collection is hidden when publishing the current file as a library.
   */
  hiddenFromPublishing: boolean;
  /**
   * The ids of the variables in the collection.
   * Note that the order of these variables is roughly the same as what is shown in Figma Design,
   * however it does not account for groups. As a result, the order of these variables
   * may not exactly reflect the exact ordering and grouping shown in the authoring UI.
   */
  variableIds: FigmaVariableId[];
};

export type FigmaVariableAlias = {
  type: "VARIABLE_ALIAS";
  id: FigmaVariableId;
};

/**
 * A possible value for a {@link FigmaVariable} based on its mode.
 *
 * @see FigmaVariableValuesByMode
 */
export type FigmaVariableValue =
  | boolean
  | number
  | string
  | FigmaColor
  | FigmaVariableAlias;

/**
 * A mapping of a {@link FigmaVariable}'s {@link FigmaVariableValue}s for each of its {@link FigmaVariableMode}s.
 */
export type FigmaVariableValuesByMode = {
  [k: FigmaVariableModeId]: FigmaVariableValue;
};

/**
 * Scopes allow a {@link FigmaVariable} to be shown/hidden in the variable picker UI for various fields.
 * This dec-lutters the Figma UI if you have a large number of variables.
 *
 * ALL_SCOPES is a special scope that means that the variable will be shown
 * in the picker UI for all current and any future fields.
 * If ALL_SCOPES is set, no additional scopes can be set.
 *
 * Likewise, ALL_FILLS is a special scope that means that the variable will be shown
 * in the picker UI for all current and any future color fill fields.
 * If ALL_FILLS is set, no additional fill scopes can be set.
 *
 * @remarks Currently only supported on FLOAT and COLOR variables.
 */
export type FigmaVariableScopes<TVariableType extends FigmaVariableType> =
  TVariableType extends "COLOR"
    ? FigmaColorVariableScope[]
    : TVariableType extends "FLOAT"
    ? FigmaFloatVariableScope[]
    : [];

/**
 * An object containing platform-specific code syntax definitions for a {@link FigmaVariable}.
 * @remarks All platforms are optional.
 */
export type FigmaVariableCodeSyntax = {
  WEB?: string;
  ANDROID?: string;
  iOS?: string;
};

/**
 * A single design token that defines values for each of the modes in its {@link FigmaVariableCollection}.
 * These values can be applied to various kinds of design properties.
 */
export type FigmaVariable<TVariableType extends FigmaVariableType> = {
  /**
   * The unique identifier of this variable.
   */
  id: FigmaVariableCollectionId;
  /**
   * The name of this variable.
   */
  name: string;
  /**
   * The key of the variable.
   */
  key: FigmaVariableKey;
  /**
   * The id of the {@link FigmaVariableCollection} that contains this variable.
   */
  variableCollectionId: FigmaVariableCollectionId;
  /**
   * The resolved type of the variable.
   * @see FigmaVariableType
   */
  resolvedType: TVariableType;
  /**
   * The values for each mode of this variable.
   *
   * @see FigmaVariableValuesByMode
   */
  valuesByMode: FigmaVariableValuesByMode;
  /**
   * Whether the variable is remote.
   */
  remote: boolean;
  /**
   * Description of this variable.
   */
  description: string;
  /**
   * Whether this variable is hidden when publishing the current file as a library.
   */
  hiddenFromPublishing: boolean;
  /**
   * An array of scopes in the UI where this variable is shown.
   * Setting this property will show/hide this variable in the variable picker UI for different fields.
   *
   * Setting scopes for a variable does not prevent that variable
   * from being bound in other scopes (for example, via the Plugin API).
   * This only limits the variables that are shown in pickers within the Figma UI.
   *
   * @see FigmaVariableScopes
   */
  scopes: FigmaVariableScopes<TVariableType>;
  /**
   * Code syntax definitions for this variable.
   * Code syntax allows you to represent variables in code using platform-specific names,
   * and will appear in Dev Mode's code snippets when inspecting elements using the variable.
   *
   * @see FigmaVariableCodeSyntax
   */
  codeSyntax: FigmaVariableCodeSyntax;
};

/**
 * Published variables have two ids:
 * - an id that is assigned in the file where it is created (id),
 * - an id that is used by subscribing files (subscribed_id).
 *
 * The id and key are stable over the lifetime of the variable.
 * The subscribed_id changes every time the variable is modified and published.
 * The same is true for {@link FigmaPublishedVariableCollection}s.
 */
export type FigmaPublishedVariable<TVariableType extends FigmaVariableType> =
  FigmaVariable<TVariableType> & {
    /**
     * Variable id that is used by subscribing files.
     */
    subscribed_id: FigmaVariableId;
    /**
     * ISO 8601 timestamp that indicate the last time that a change to a variable was published
     */
    updatedAt: string;
  };

/**
 * Published variable collection have two ids:
 * - an id that is assigned in the file where it is created (id),
 * - an id that is used by subscribing files (subscribed_id).
 *
 * The id and key are stable over the lifetime of the variable.
 * The subscribed_id changes every time the variable is modified and published.
 * The same is true for {@link FigmaPublishedVariable}s.
 */
export type FigmaPublishedVariableCollection = Omit<
  FigmaVariableCollection,
  "modes"
> & {
  /**
   * Variable collection id that is used by subscribing files.
   */
  subscribed_id: FigmaVariableId;
  /**
   * ISO 8601 timestamp that indicate the last time that a variable in the collection was changed.
   */
  updatedAt: string;
};
