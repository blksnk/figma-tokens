import {
  FigmaDocumentNode,
  FigmaRectangleNode,
  FigmaTextNode,
} from "./figma.nodes.types";
import {
  FigmaComponent,
  FigmaComponentSet,
  FigmaNodeId,
  FigmaImageRef,
  FigmaStyle,
} from "./figma.properties.types";
import {
  FigmaComponentMetadata,
  FigmaComponentSetMetadata,
  FigmaStyleMetadata,
} from "./figma.teams.types";
import {
  FigmaPublishedVariable,
  FigmaPublishedVariableCollection,
  FigmaVariable,
  FigmaVariableCollection,
  FigmaVariableCollectionId,
  FigmaVariableId,
} from "./figma.variables.types";
import { FigmaVariableType } from "./figma.enums.types";

export type GetFileEndpointQueryParams = {
  /**
   * A specific version ID to get. Omitting this will get the current version of the file
   */
  version?: string;
  /**
   * Comma separated list of nodes that you care about in the document.
   * If specified, only a subset of the document will be returned
   * corresponding to the nodes listed, their children, and everything between
   * the root node and the listed nodes
   */
  ids?: string;
  /**
   * Positive integer representing how deep into the document tree to traverse.
   * @example
   * Setting this to 1 returns only Pages, setting it to 2 returns Pages and all top level objects on each page.
   * Not setting this parameter returns all nodes
   */
  depth?: number;
  /**
   * Set to "paths" to export vector data
   */
  geometry?: "paths";
  /**
   * A comma separated list of plugin IDs and/or the string "shared".
   * Any data present in the document written by those plugins will be included
   * in the result in the `pluginData` and `sharedPluginData` properties.
   */
  plugin_data?: string | "shared";
  /**
   * Returns branch metadata for the requested file.
   * If the file is a branch, the main file's key will be included in the returned response.
   * If the file has branches, their metadata will be included in the returned response.
   * @default false.
   */
  branch_data?: boolean;
};

export type FigmaFileBranchResponse = {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
  link_access: string;
};

export type GetFileEndpointResponse = {
  name: string;
  role: string;
  lastModified: string;
  editorType: string;
  thumbnailUrl: string;
  version: string;
  document: FigmaDocumentNode;
  components: Record<string, FigmaComponent>;
  componentSets: Record<string, FigmaComponentSet>;
  schemaVersion: number;
  styles: Record<string, FigmaStyle>;
  mainFileKey: string;
  branches?: FigmaFileBranchResponse[];
};

export type GetFileNodesEndpointQueryParams = Pick<
  GetFileEndpointQueryParams,
  "ids" | "version" | "depth" | "geometry" | "plugin_data"
>;

export type FigmaFileNodeResponse = {
  document: FigmaTextNode | FigmaRectangleNode;
  components: Record<string, FigmaComponent>;
  schemaVersion: number;
  styles: Record<string, FigmaStyle>;
};

export type GetFileNodesEndpointResponse = Pick<
  GetFileEndpointResponse,
  "name" | "role" | "lastModified" | "editorType" | "thumbnailUrl"
> & {
  nodes: Record<FigmaNodeId, FigmaFileNodeResponse>;
  err?: string;
};

export type FigmaImageFormatQueryParam = "jpg" | "png" | "svg" | "pdf";

export type GetImagesEndpointQueryParams = {
  /**
   * A comma separated list of node IDs to render
   */
  ids: FigmaNodeId;
  /**
   * The image scaling factor
   * A number between 0.01 and 4
   */
  scale?: number;
  /**
   * A string enum for the image output format.
   * Refer to {@link FigmaImageFormatQueryParam}
   */
  format?: FigmaImageFormatQueryParam;
  /**
   * Whether text elements are rendered as outlines (vector paths)
   * or as <text> elements in SVGs.
   * @default true
   * Rendering text elements as outlines guarantees that the text looks exactly
   * the same in the SVG as it does in the browser/inside Figma.
   *
   * Exporting as <text> allows text to be selectable inside SVGs and generally
   * makes the SVG easier to read.
   * However, this relies on the browser's rendering engine which can vary between
   * browsers and/or operating systems. As such, visual accuracy is not guaranteed
   * as the result could look different from in Figma.
   */
  svg_outline_text?: boolean;
  /**
   * Whether to include id attributes for all SVG elements.
   * Adds the layer name to the id attribute of an svg element.
   * @default false
   */
  svg_include_id?: boolean;
  /**
   * Whether to include node id attributes for all SVG elements.
   * Adds the node id to a data-node-id attribute of an svg element.
   * @default false
   */
  svg_include_node_id?: boolean;
  /**
   * Whether to simplify inside/outside strokes and use stroke attribute
   * if possible instead of <mask>.
   * @default true
   */
  svg_simplify_stroke?: boolean;
  /**
   * Whether content that overlaps the node should be excluded from rendering.
   * Passing false (i.e., rendering overlaps) may increase processing time,
   * since more of the document must be included in rendering.
   * @default true
   */
  contents_only?: boolean;
  /**
   * Use the full dimensions of the node regardless of whether it is cropped
   * or the surrounding space is empty.
   * Use this to export text nodes without cropping.
   * @default false
   */
  use_absolute_bounds: boolean;
  /**
   * A specific version ID to use.
   * Omitting this will use the current version of the file.
   */
  version?: string;
};

export type GetImagesEndpointResponse = {
  err?: string;
  /**
   * Map from node IDs to URLs of the rendered images.
   * @remarks he image map may contain values that are null. This indicates that rendering of that specific node has failed.
   */
  images: Record<FigmaNodeId, string | null>;
  status?: number;
};

export type GetImageFillsEndpointResponse = {
  /**
   * Map from image references to urls.
   * Image references are located in the output of the GET files endpoint
   * under the imageRef attribute in a Paint.
   * @remarks Image URLs will expire after no more than 14 days.
   */
  images: Record<FigmaImageRef, string>;
};

type GetMetadataEndpointQueryParams = {
  /**
   * Number of items in a paged list of results. Defaults to 30.
   */
  page_size?: number;
  /**
   * Cursor indicating which id after which to start retrieving components for.
   * The cursor value is an internally tracked integer that doesn't correspond to any Ids
   * @remarks Exclusive with before.
   */
  after?: number;
  /**
   * Cursor indicating which id before which to start retrieving components for.
   * The cursor value is an internally tracked integer that doesn't correspond to any Ids
   * @remarks Exclusive with after.
   */
  before?: number;
};

type FigmaPaginationCursor = {
  before: number;
  after: number;
};

export type GetTeamComponentsEndpointQueryParams =
  GetMetadataEndpointQueryParams;

export type GetTeamComponentsEndpointResponse = {
  status: number;
  error?: boolean;
  message?: string;

  /**
   * Component metadata
   */
  meta: {
    components: FigmaComponentMetadata[];
  };
  cursor: FigmaPaginationCursor;
};

export type GetTeamComponentSetsEndpointQueryParams =
  GetMetadataEndpointQueryParams;

export type GetTeamComponentSetsEndpointResponse = {
  status: number;
  error?: boolean;
  message?: string;

  /**
   * Component set metadata
   */
  meta: {
    component_sets: FigmaComponentSetMetadata[];
  };
  cursor: FigmaPaginationCursor;
};

export type GetFileComponentsEndpointResponse = Omit<
  GetTeamComponentsEndpointResponse,
  "cursor"
>;

export type GetFileComponentSetsEndpointResponse = Omit<
  GetTeamComponentSetsEndpointResponse,
  "cursor"
>;

export type GetComponentEndpointResponse = {
  status: number;
  error?: boolean;
  message?: string;
  meta: FigmaComponentMetadata;
};

export type GetComponentSetEndpointResponse = {
  status: number;
  error?: boolean;
  message?: string;
  meta: FigmaComponentSetMetadata;
};

export type GetTeamStylesEndpointQueryParams = GetMetadataEndpointQueryParams;

export type GetTeamStylesEndpointResponse = {
  status: number;
  error?: boolean;
  message?: string;
  meta: {
    styles: FigmaStyleMetadata[];
  };
  cursor: FigmaPaginationCursor;
};

export type GetFileStylesEndpointResponse = Omit<
  GetTeamStylesEndpointResponse,
  "cursor"
>;

export type GetStyleEndpointResponse = {
  status: number;
  error?: boolean;
  message?: string;
  meta: FigmaStyleMetadata[];
};

export type GetFileLocalVariablesEndpointResponse = {
  status: number;
  error?: boolean;
  message?: string;
  meta: {
    variables: {
      [key: FigmaVariableId]: FigmaVariable<FigmaVariableType>;
    };
    variableCollections: {
      [key: FigmaVariableCollectionId]: FigmaVariableCollection;
    };
  };
};

export type GetFilePublishedVariablesEndpointResponse = {
  status: number;
  error?: boolean;
  message?: string;
  meta: {
    variables: {
      [key: FigmaVariableId]: FigmaPublishedVariable<FigmaVariableType>;
    };
    variableCollections: {
      [key: FigmaVariableCollectionId]: FigmaPublishedVariableCollection;
    };
  };
};
