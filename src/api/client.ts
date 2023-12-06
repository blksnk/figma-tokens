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
import { FigmaComponentMetadata } from "../types/figma/figma.teams.types";

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

  async getTeamComponents(teamId: FigmaTeamId = this.teamId, queryParams?: GetTeamComponentsEndpointResponse) {
    teamId = validateKey(teamId)
    this.teamId = teamId;
    this.lastTeamComponents = await endpointFactory<
      GetTeamComponentsEndpointQueryParams,
      GetTeamComponentsEndpointResponse
    >(endpointURLs.teamComponents, this.token, this.logger)(teamId, queryParams);
    return this.lastTeamComponents;
  }

  async getTeamComponentSets(teamId: FigmaTeamId = this.teamId, queryParams?: GetTeamComponentSetsEndpointQueryParams) {
    teamId = validateKey(teamId)
    this.teamId = teamId;
    this.lastTeamComponentSets = await endpointFactory<
      GetTeamComponentSetsEndpointQueryParams,
      GetTeamComponentSetsEndpointResponse
    >(endpointURLs.teamComponentSets, this.token, this.logger)(teamId, queryParams);
    return this.lastTeamComponentSets;
  }

  async getTeamStyles(teamId: FigmaTeamId = this.teamId, queryParams?: GetTeamStylesEndpointQueryParams) {
    teamId = validateKey(teamId)
    this.teamId = teamId;
    this.lastTeamStyles = await endpointFactory<
      GetTeamStylesEndpointQueryParams,
      GetTeamStylesEndpointResponse
    >(endpointURLs.teamStyles, this.token, this.logger)(teamId, queryParams);
    return this.lastTeamStyles;
  }

  async getComponentMetadata(componentKey: FigmaComponentKey) {
    componentKey = validateKey(componentKey);
    this.componentKey = componentKey;
    this.lastComponentMetadata = await endpointFactory<
      {},
      GetComponentEndpointResponse
    >(endpointURLs.component, this.token, this.logger)(componentKey);
    return this.lastComponentMetadata;
  }

  async getComponentSetMetadata(componentSetKey: FigmaComponentKey) {
    componentSetKey = validateKey(componentSetKey);
    this.componentSetKey = componentSetKey;
    this.lastComponentSetMetadata = await endpointFactory<
      {},
      GetComponentSetEndpointResponse
    >(endpointURLs.componentSet, this.token, this.logger)(componentSetKey);
    return this.lastComponentSetMetadata;
  }

  async getComponentSetMetadata(styleKey: FigmaStyleKey) {
    styleKey = validateKey(styleKey);
    this.styleKey = styleKey;
    this.lastStyleMetadata = await endpointFactory<
      {},
      GetStyleEndpointResponse
    >(endpointURLs.style, this.token, this.logger)(styleKey);
    return this.lastStyleMetadata;
  }
}
