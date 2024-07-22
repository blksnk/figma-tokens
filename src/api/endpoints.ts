import {
  FigmaComponentKey,
  FigmaFileKey,
  FigmaStyleKey,
  FigmaTeamId,
} from "../types/figma/figma.properties.types";
import { EndpointUrlFn } from "../types/global/endpoints.types";

const API_URL_ROOT = "https://api.figma.com/v1";

/**
 * This file contains functions that generate endpoint URLs for various API endpoints.
 * Each function takes in specific parameters related to the endpoint and returns the corresponding URL.
 */

// files
export const getFileEndpointURL: EndpointUrlFn = (fileKey: FigmaFileKey) =>
  `${API_URL_ROOT}/files/${fileKey}`;
export const getFileNodesEndpointURL: EndpointUrlFn = (fileKey: FigmaFileKey) =>
  `${getFileEndpointURL(fileKey)}/nodes`;
export const getFileComponentsEndpointURL: EndpointUrlFn = (
  fileKey: FigmaFileKey
) => `${getFileEndpointURL(fileKey)}/components`;
export const getFileComponentSetsEndpointURL: EndpointUrlFn = (
  fileKey: FigmaFileKey
) => `${getFileEndpointURL(fileKey)}/component_sets`;
export const getFileStylesEndpointURL: EndpointUrlFn = (
  fileKey: FigmaFileKey
) => `${getFileEndpointURL(fileKey)}/styles`;
export const getFileLocalVariablesEndpointURL: EndpointUrlFn = (
  fileKey: FigmaFileKey
) => `${getFileEndpointURL(fileKey)}/variables/local`;
export const getFilePublishedVariablesEndpointURL: EndpointUrlFn = (
  fileKey: FigmaFileKey
) => `${getFileEndpointURL(fileKey)}/variables/published`;

// image downloads
export const getImagesEndpointURL: EndpointUrlFn = (fileKey: FigmaFileKey) =>
  `${API_URL_ROOT}/images/${fileKey}`;
export const getImageFillsEndpointURL: EndpointUrlFn = (
  fileKey: FigmaFileKey
) => `${getFileEndpointURL(fileKey)}/images`;

// teams
export const getTeamComponentsEndpointURL: EndpointUrlFn = (
  teamId: FigmaTeamId
) => `${API_URL_ROOT}/teams/${teamId}/components`;
export const getTeamComponentSetsEndpointURL: EndpointUrlFn = (
  teamId: FigmaTeamId
) => `${API_URL_ROOT}/teams/${teamId}/component_sets`;
export const getTeamStylesEndpointURL: EndpointUrlFn = (teamId: FigmaTeamId) =>
  `${API_URL_ROOT}/teams/${teamId}/styles`;

// components
export const getComponentEndpointURL: EndpointUrlFn = (
  componentKey: FigmaComponentKey
) => `${API_URL_ROOT}/components/${componentKey}`;
export const getComponentSetEndpointURL: EndpointUrlFn = (
  componentKey: FigmaComponentKey
) => `${API_URL_ROOT}/component_sets/${componentKey}`;

// styles
export const getStyleEndpointURL: EndpointUrlFn = (styleKey: FigmaStyleKey) =>
  `${API_URL_ROOT}/styles/${styleKey}`;

export const endpointURLs = {
  file: getFileEndpointURL,
  fileNodes: getFileNodesEndpointURL,
  fileComponents: getFileComponentsEndpointURL,
  fileComponentSets: getFileComponentSetsEndpointURL,
  fileStyles: getFileStylesEndpointURL,
  fileLocalVariables: getFileLocalVariablesEndpointURL,
  filePublishedVariables: getFilePublishedVariablesEndpointURL,
  images: getImagesEndpointURL,
  imageFills: getImageFillsEndpointURL,
  teamComponents: getTeamComponentsEndpointURL,
  teamComponentSets: getTeamComponentSetsEndpointURL,
  teamStyles: getTeamStylesEndpointURL,
  component: getComponentEndpointURL,
  componentSet: getComponentSetEndpointURL,
  style: getStyleEndpointURL,
} as const;
