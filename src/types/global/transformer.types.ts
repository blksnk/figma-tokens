import {
  FigmaEffect,
  FigmaFileKey,
  FigmaNodeId, FigmaPaint,
  FigmaStyleKey, FigmaTypeStyle
} from "../figma/figma.properties.types";
import { FigmaTeamUser } from "../figma/figma.teams.types";
import { FigmaNodeType, FigmaStyleType } from "../figma/figma.enums.types";
import { FigmaFileNodeResponse } from "../figma/figma.endpoints.types";

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