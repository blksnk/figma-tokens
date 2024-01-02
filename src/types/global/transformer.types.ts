import {
  FigmaEffect,
  FigmaFileKey,
  FigmaNodeId, FigmaPaint,
  FigmaStyleKey, FigmaTypeStyle
} from "../figma/figma.properties.types";
import { FigmaTeamUser } from "../figma/figma.teams.types";
import { FigmaNodeType, FigmaStyleType } from "../figma/figma.enums.types";
import { FigmaFileNodeResponse } from "../figma/figma.endpoints.types";

/**
 * Represents a style node in Figma.
 * @template TStyleType - The type of the style (e.g., "FILL", "EFFECT", "TEXT").
 * @typedef {Object} StyleNode
 * @property {FigmaStyleKey} styleKey - A unique key that identifies the style.
 * @property {FigmaNodeId} nodeId - The ID of the node associated with the style.
 * @property {FigmaFileKey} fileKey - The key of the file that contains the style.
 * @property {string} description - A description of the style.
 * @property {string} thumbnailURL - The URL of the thumbnail image for the style.
 * @property {string} name - The name of the style.
 * @property {FigmaTeamUser} author - The author of the style.
 * @property {TStyleType} type - The type of the style.
 * @property {FigmaNodeType} nodeType - The type of the Figma node associated with the style.
 * @property {FigmaFileNodeResponse} node - The Figma file node response associated with the style.
 * @property {FigmaPaint | FigmaEffect | FigmaTypeStyle} styleProperties - The style properties based on the style type.
 */
export type StyleNode<TStyleType extends FigmaStyleType = FigmaStyleType> = {
  styleKey: FigmaStyleKey,
  nodeId: FigmaNodeId
  fileKey: FigmaFileKey,
  description: string,
  thumbnailURL: string,
  name: string,
  author: FigmaTeamUser,
  type: TStyleType,
  nodeType: FigmaNodeType,
  node: FigmaFileNodeResponse,
  styleProperties: TStyleType extends "FILL"
    ? FigmaPaint
    : TStyleType extends "EFFECT"
    ? FigmaEffect
    : TStyleType extends "TEXT"
    ? FigmaTypeStyle
    : never;
}