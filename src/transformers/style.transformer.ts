import { FigmaApiClient } from "../api/client";
import { FigmaStyleMetadata } from "../types/figma/figma.teams.types";
import { Logger } from "../utils/log.utils";
import {
  FigmaFileKey,
} from "../types/figma/figma.properties.types";
import { FigmaStyleType } from "../types/figma/figma.enums.types";
import { FigmaTextNode } from "../types/figma/figma.nodes.types";
import { FigmaFileNodeResponse } from "../types/figma/figma.endpoints.types";
import { StyleNode } from "../types/global/transformer.types";
import { styleNodeToToken } from "./token.transfomer";
import { Token } from "../types/global/export.types";

const getUniqueFileKeys = (styles: FigmaStyleMetadata[]): FigmaFileKey[] => {
  const fileKeys: FigmaFileKey[] = [];
  for (let i = 0; i < styles.length; i++) {
    const fileKey = styles[i].file_key;
    if (fileKeys.includes(fileKey)) {
      continue;
    }
    fileKeys.push(fileKey);
  }
  return fileKeys;
}

const getNodeStyleProperties = <TStyleType extends Exclude<FigmaStyleType, "GRID">>(styleType: TStyleType, node: FigmaFileNodeResponse) => {
  switch(styleType) {
    case "FILL": {
      return node.document.fills[0];
    }
    case "EFFECT": {
      return node.document.effects[0];
    }
    case "TEXT": {
      return (node.document as FigmaTextNode).style
    }
  }
}

export const getStyleNodes = async (figmaApiClient: FigmaApiClient, styles: FigmaStyleMetadata[], logger: Logger = Logger()): Promise<StyleNode[]> => {
  // remove GRID styles
  styles = styles.filter(({ style_type }) => style_type !== "GRID")
  // get unique file keys
  const uniqueFileKeys = getUniqueFileKeys(styles);
  // separate styles by file key reference
  const filteredStyleSets: [FigmaFileKey, FigmaStyleMetadata[]][] =
    uniqueFileKeys.map(uniqueFileKey => [uniqueFileKey, styles.filter(({ file_key }) => file_key === uniqueFileKey)]);
  // make one api call per unique file key to request all nodes corresponding to style metadata
  const fileNodeResponses = await Promise.all(
    filteredStyleSets.map(([fileKey, styleSet] ) =>
      figmaApiClient.getFileNodes(fileKey, {
        ids: styleSet.map(({ node_id }) => node_id).join(",")
      })
    )
  )
  // unwrap nodes from files
  const allNodes: FigmaFileNodeResponse[] = fileNodeResponses.flatMap(({ nodes }) => Object.values(nodes))
  // map style metadata to node style values
  return styles.map((styleMetadata) => {
    const correspondingNode = allNodes.find((node) => node.document.id === styleMetadata.node_id) ?? null;
    if (!correspondingNode) {
      logger.warn(`Unable to find matching node ${ styleMetadata.node_id } for style ${ styleMetadata.key }`)
      return null;
    }
    return {
      nodeId: styleMetadata.node_id,
      type: styleMetadata.style_type,
      nodeType: correspondingNode.document.type,
      name: styleMetadata.name,
      styleKey: styleMetadata.key,
      description: styleMetadata.description,
      thumbnailURL: styleMetadata.thumbnail_url,
      fileKey: styleMetadata.file_key,
      author: styleMetadata.user,
      styleType: styleMetadata.style_type,
      node: correspondingNode,
      styleProperties: getNodeStyleProperties(styleMetadata.style_type, correspondingNode),
    }
  }).filter(item => item !== null) as StyleNode[];
}



export const tokenizeStyles = async (figmaApiClient: FigmaApiClient, styles: FigmaStyleMetadata[], logger: Logger = Logger()) => {
  logger.info(`Populating all ${styles.length} filtered styles based on metadata...`)
  const styleNodes = await getStyleNodes(figmaApiClient, styles, logger);
  logger.info("Transforming figma styles to tokens...");
  const tokens = styleNodes.map(styleNode => styleNodeToToken(styleNode))
  logger.info("Done")
  return tokens.filter(token => !!token) as Token[];
}