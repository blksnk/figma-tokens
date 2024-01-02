import { FIGMA_TOKEN } from "./config";
import {
  endpointFactory,
  validateKey
} from "../utils/endpoints.utils";
import { endpointURLs } from "./endpoints";
import {
  GetComponentEndpointResponse, GetComponentSetEndpointResponse,
  GetFileComponentsEndpointResponse,
  GetFileComponentSetsEndpointResponse,
  GetFileEndpointQueryParams,
  GetFileEndpointResponse,
  GetFileNodesEndpointQueryParams,
  GetFileNodesEndpointResponse,
  GetFileStylesEndpointResponse,
  GetImageFillsEndpointResponse,
  GetImagesEndpointQueryParams,
  GetImagesEndpointResponse, GetStyleEndpointResponse,
  GetTeamComponentsEndpointQueryParams,
  GetTeamComponentsEndpointResponse, GetTeamComponentSetsEndpointQueryParams,
  GetTeamComponentSetsEndpointResponse, GetTeamStylesEndpointQueryParams,
  GetTeamStylesEndpointResponse
} from "../types/figma/figma.endpoints.types";
import {
  FigmaComponentKey,
  FigmaFileKey,
  FigmaNodeId, FigmaStyleKey,
  FigmaTeamId
} from "../types/figma/figma.properties.types";
import { Nullable, Optional } from "../types/global/global.types";
import { Logger, LoggerConfig } from "../utils/log.utils";


/**
 * Represents a client for interacting with the Figma API.
 *
 * This class provides methods for retrieving files, querying endpoints,
 * and performing various operations on Figma files.
 */
export class FigmaApiClient {
  token: string;
  fileKey: Optional<FigmaFileKey>;
  teamId: Optional<FigmaTeamId>;
  componentKey: Optional<FigmaComponentKey>;
  componentSetKey: Optional<FigmaComponentKey>;
  styleKey: Optional<FigmaStyleKey>;
  lastFile: Nullable<GetFileEndpointResponse>;
  lastFileNodes: Nullable<GetFileNodesEndpointResponse>;
  lastFileComponents: Nullable<GetFileComponentsEndpointResponse>;
  lastFileComponentSets: Nullable<GetFileComponentSetsEndpointResponse>;
  lastFileStyles: Nullable<GetFileStylesEndpointResponse>;
  lastImages: Nullable<GetImagesEndpointResponse>;
  lastImageFills: Nullable<GetImageFillsEndpointResponse>;
  lastTeamComponents: Nullable<GetTeamComponentsEndpointResponse>;
  lastTeamComponentSets: Nullable<GetTeamComponentSetsEndpointResponse>;
  lastTeamStyles: Nullable<GetTeamStylesEndpointResponse>;
  lastComponentMetadata: Nullable<GetComponentEndpointResponse>;
  lastComponentSetMetadata: Nullable<GetComponentSetEndpointResponse>;
  lastStyleMetadata: Nullable<GetStyleEndpointResponse>;
  logger: Logger;
  constructor(token: string = FIGMA_TOKEN, loggerConfig?: LoggerConfig) {
    this.token = token;
    this.fileKey = undefined;
    this.teamId = undefined;
    this.componentKey = undefined;
    this.componentSetKey = undefined;
    this.styleKey = undefined;
    this.lastFile = null;
    this.lastFileNodes = null;
    this.lastFileComponents = null;
    this.lastFileComponentSets = null;
    this.lastFileStyles = null;
    this.lastImages = null;
    this.lastImageFills = null;
    this.lastTeamComponents = null;
    this.lastTeamComponentSets = null;
    this.lastTeamStyles = null;
    this.lastComponentMetadata = null;
    this.lastComponentSetMetadata = null;
    this.lastStyleMetadata = null;
    this.logger = Logger(loggerConfig);
  }

  /**
   * Retrieves a file from the Figma API.
   *
   * @param {FigmaFileKey} fileKey - The key of the file to retrieve. Defaults to the fileKey associated with the instance.
   * @param {GetFileEndpointQueryParams} queryParams - Additional query parameters to include in the API request.
   * @returns {Promise<GetFileEndpointResponse>} A promise that resolves to the retrieved file.
   */
  async getFile(fileKey: FigmaFileKey = this.fileKey, queryParams?: GetFileEndpointQueryParams) {
    fileKey = validateKey(fileKey)
    // replace fileKey for consecutive endpoint calls
    this.fileKey = fileKey;
    this.lastFile = await endpointFactory<
      GetFileEndpointQueryParams,
      GetFileEndpointResponse
    >(endpointURLs.file, this.token, this.logger)(fileKey, queryParams);
    return this.lastFile;
  }

  /**
   * Retrieves the file nodes for a given file key.
   *
   * @param {FigmaFileKey} [fileKey=this.fileKey] - The file key to retrieve the nodes from.
   * @param {GetFileNodesEndpointQueryParams} [queryParams] - Additional query parameters for the endpoint.
   * @return {Promise<GetFileNodesEndpointResponse>} - A promise that resolves to the file nodes.
   */
  async getFileNodes(fileKey: FigmaFileKey = this.fileKey, queryParams?: GetFileNodesEndpointQueryParams) {
    fileKey = validateKey(fileKey)
    // replace fileKey for consecutive endpoint calls
    this.fileKey = fileKey;
    this.lastFileNodes = await endpointFactory<
      GetFileNodesEndpointQueryParams,
      GetFileNodesEndpointResponse
    >(endpointURLs.fileNodes, this.token, this.logger)(fileKey, queryParams);
    return this.lastFileNodes;
  }

  /**
   * Retrieves the components of a file given its file key.
   *
   * @param {FigmaFileKey} fileKey - The file key of the file. Defaults to the file key of this instance.
   * @return {Promise<GetFileComponentsEndpointResponse>} A promise that resolves to the file components.
   */
  async getFileComponents(fileKey: FigmaFileKey = this.fileKey) {
    fileKey = validateKey(fileKey)
    // replace fileKey for consecutive endpoint calls
    this.fileKey = fileKey;
    this.lastFileComponents = await endpointFactory<
      {},
      GetFileComponentsEndpointResponse
    >(endpointURLs.fileComponents, this.token, this.logger)(fileKey);
    return this.lastFileComponents;
  }

  /**
   * Retrieves the component sets for a given Figma file.
   *
   * @param {FigmaFileKey} fileKey - The key of the Figma file. Defaults to the fileKey of the instance.
   * @return {Promise<GetFileComponentSetsEndpointResponse>} A promise that resolves with the component sets of the file.
   */
  async getFileComponentSets(fileKey: FigmaFileKey = this.fileKey) {
    fileKey = validateKey(fileKey)
    // replace fileKey for consecutive endpoint calls
    this.fileKey = fileKey;
    this.lastFileComponentSets = await endpointFactory<
      {},
      GetFileComponentSetsEndpointResponse
    >(endpointURLs.fileComponentSets, this.token, this.logger)(fileKey);
    return this.lastFileComponentSets;
  }

  /**
   * Retrieves the styles for a given Figma file.
   *
   * @param {FigmaFileKey} fileKey - The key of the Figma file to retrieve the styles from. Defaults to the fileKey associated with the current instance.
   * @return {Promise<GetFileStylesEndpointResponse>} A promise that resolves with the styles of the file.
   */
  async getFileStyles(fileKey: FigmaFileKey = this.fileKey) {
    fileKey = validateKey(fileKey)
    // replace fileKey for consecutive endpoint calls
    this.fileKey = fileKey;
    this.lastFileStyles = await endpointFactory<
      {},
      GetFileStylesEndpointResponse
    >(endpointURLs.fileStyles, this.token, this.logger)(fileKey);
    return this.lastFileStyles;
  }

  /**
   * Retrieves images for a Figma file.
   *
   * @param {FigmaFileKey} fileKey - The key of the Figma file. Defaults to the file key associated with the class instance.
   * @param {Omit<GetImagesEndpointQueryParams, "ids" & {ids: FigmaNodeId | FigmaNodeId[]}>} queryParams - Optional query parameters for the endpoint.
   * @return {Promise<GetImagesEndpointResponse>} The response containing the images.
   */
  async getImages(fileKey: FigmaFileKey = this.fileKey, queryParams?: Omit<GetImagesEndpointQueryParams, "ids" & {ids: FigmaNodeId | FigmaNodeId[]}>) {
    fileKey = validateKey(fileKey)
    // replace fileKey for consecutive endpoint calls
    this.fileKey = fileKey;
    // format image ids query param
    queryParams = queryParams ? {
      ...queryParams,
      ids: Array.isArray(queryParams.ids)
        ? queryParams.ids.join(",")
        : queryParams.ids
    } : queryParams;
    this.lastImages = await endpointFactory<
      GetImagesEndpointQueryParams,
      GetImagesEndpointResponse
    >(endpointURLs.images, this.token, this.logger)(fileKey, queryParams);
    return this.lastImages;
  }

  /**
   * Retrieves the image fills for the specified Figma file.
   *
   * @param {FigmaFileKey} [fileKey=this.fileKey] - The key of the Figma file.
   * @return {Promise<GetImageFillsEndpointResponse>} - A promise that resolves with the image fills.
   */
  async getImageFills(fileKey: FigmaFileKey = this.fileKey) {
    fileKey = validateKey(fileKey)
    // replace fileKey for consecutive endpoint calls
    this.fileKey = fileKey;
    this.lastImageFills = await endpointFactory<
      {},
      GetImageFillsEndpointResponse
    >(endpointURLs.imageFills, this.token, this.logger)(fileKey);
    return this.lastImageFills;
  }

  /**
   * Retrieves the components of a team.
   *
   * @param {FigmaTeamId} teamId - The ID of the team. Defaults to the team ID of the current instance.
   * @param {GetTeamComponentsEndpointResponse} queryParams - Optional query parameters for the request.
   * @return {Promise<GetTeamComponentsEndpointResponse>} A promise that resolves to the response containing the team components.
   */
  async getTeamComponents(teamId: FigmaTeamId = this.teamId, queryParams?: GetTeamComponentsEndpointResponse) {
    teamId = validateKey(teamId)
    this.teamId = teamId;
    this.lastTeamComponents = await endpointFactory<
      GetTeamComponentsEndpointQueryParams,
      GetTeamComponentsEndpointResponse
    >(endpointURLs.teamComponents, this.token, this.logger)(teamId, queryParams);
    return this.lastTeamComponents;
  }

  /**
   * Retrieves the component sets for a specific team.
   *
   * @param {FigmaTeamId} teamId - The ID of the team for which to retrieve the component sets. Defaults to the current team ID.
   * @param {GetTeamComponentSetsEndpointQueryParams} queryParams - Optional query parameters for the API request.
   * @return {Promise<GetTeamComponentSetsEndpointResponse>} - A promise that resolves to the component sets of the team.
   */
  async getTeamComponentSets(teamId: FigmaTeamId = this.teamId, queryParams?: GetTeamComponentSetsEndpointQueryParams) {
    teamId = validateKey(teamId)
    this.teamId = teamId;
    this.lastTeamComponentSets = await endpointFactory<
      GetTeamComponentSetsEndpointQueryParams,
      GetTeamComponentSetsEndpointResponse
    >(endpointURLs.teamComponentSets, this.token, this.logger)(teamId, queryParams);
    return this.lastTeamComponentSets;
  }

  /**
   * Retrieves the styles for a team.
   *
   * @param {FigmaTeamId} teamId - The ID of the team to retrieve styles for. Defaults to the current team ID.
   * @param {GetTeamStylesEndpointQueryParams} queryParams - Optional query parameters for the API request.
   * @return {Promise<GetTeamStylesEndpointResponse>} A promise that resolves with the team styles.
   */
  async getTeamStyles(teamId: FigmaTeamId = this.teamId, queryParams?: GetTeamStylesEndpointQueryParams) {
    teamId = validateKey(teamId)
    this.teamId = teamId;
    this.lastTeamStyles = await endpointFactory<
      GetTeamStylesEndpointQueryParams,
      GetTeamStylesEndpointResponse
    >(endpointURLs.teamStyles, this.token, this.logger)(teamId, queryParams);
    return this.lastTeamStyles;
  }

  /**
   * Retrieves the metadata for a specific component.
   *
   * @param {FigmaComponentKey} componentKey - The key of the component to retrieve metadata for.
   * @returns {Promise<GetComponentEndpointResponse>} A promise that resolves with the metadata of the component.
   */
  async getComponentMetadata(componentKey: FigmaComponentKey) {
    componentKey = validateKey(componentKey);
    this.componentKey = componentKey;
    this.lastComponentMetadata = await endpointFactory<
      {},
      GetComponentEndpointResponse
    >(endpointURLs.component, this.token, this.logger)(componentKey);
    return this.lastComponentMetadata;
  }

  /**
   * Retrieves the metadata for a specific component set based on its key.
   *
   * @param {FigmaComponentKey} componentSetKey - The key of the component set.
   * @return {Promise<any>} The metadata of the component set.
   */
  async getComponentSetMetadata(componentSetKey: FigmaComponentKey) {
    componentSetKey = validateKey(componentSetKey);
    this.componentSetKey = componentSetKey;
    this.lastComponentSetMetadata = await endpointFactory<
      {},
      GetComponentSetEndpointResponse
    >(endpointURLs.componentSet, this.token, this.logger)(componentSetKey);
    return this.lastComponentSetMetadata;
  }

  /**
   * Retrieves the metadata for a given style.
   *
   * @param {FigmaStyleKey} styleKey - The key of the style to retrieve metadata for.
   * @return {Promise<StyleMetadata>} A promise that resolves to the metadata of the style.
   */
  async getStyleMetadata(styleKey: FigmaStyleKey) {
    styleKey = validateKey(styleKey);
    this.styleKey = styleKey;
    this.lastStyleMetadata = await endpointFactory<
      {},
      GetStyleEndpointResponse
    >(endpointURLs.style, this.token, this.logger)(styleKey);
    return this.lastStyleMetadata;
  }
}
