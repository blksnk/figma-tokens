import { FigmaApiClient } from "../api/client";
import { FigmaStyleMetadata } from "../types/figma/figma.teams.types";
import { Logger } from "../utils/log.utils";
import { FigmaFileKey } from "../types/figma/figma.properties.types";
import { FigmaStyleType } from "../types/figma/figma.enums.types";
import { FigmaTextNode } from "../types/figma/figma.nodes.types";
import { FigmaFileNodeResponse } from "../types/figma/figma.endpoints.types";
import { StyleNode } from "../types/global/transformer.types";
import { styleNodeToToken } from "./token.transfomer";
import { Token } from "../types/global/export.types";
import { isNull, NonNullable } from "@ubloimmo/front-util";

/**
 * Retrieves the unique file keys from an array of Figma style metadata.
 *
 * This function iterates through the provided array of Figma style metadata and extracts the unique file keys from each item. It returns an array of Figma file keys containing only the unique values found in the input array.
 *
 * @param {FigmaStyleMetadata[]} styles - The array of Figma style metadata.
 * @return {FigmaFileKey[]} - An array of unique Figma file keys extracted from the input styles.
 */
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
};

/**
 * Retrieves the style properties of a Figma node based on the specified style type.
 *
 * This function takes a style type and a Figma node as input and retrieves the style properties associated with that style type.
 * The supported style types are "FILL", "EFFECT", and "TEXT".
 * Depending on the style type, the function returns different style properties from the Figma node.
 *
 * @template TStyleType {FigmaStyleType} - The type of style being retrieved, which must be one of the supported style types ("FILL", "EFFECT", "TEXT").
 * @param {TStyleType} styleType - The style type for which to retrieve the style properties.
 * @param {FigmaFileNodeResponse} node - The Figma node from which to retrieve the style properties.
 * @return {FigmaFill | FigmaEffect | FigmaStyle} - The style properties of the specified style type from the Figma node.
 */
const getNodeStyleProperties = <
  TStyleType extends Exclude<FigmaStyleType, "GRID">
>(
  styleType: TStyleType,
  node: FigmaFileNodeResponse
) => {
  switch (styleType) {
    case "FILL": {
      return node.document.fills[0];
    }
    case "EFFECT": {
      return node.document.effects[0];
    }
    case "TEXT": {
      return (node.document as FigmaTextNode).style;
    }
  }
};

type FigmaStyleMetadataNoGrid = Omit<FigmaStyleMetadata, "style_type"> & {
  style_type: Exclude<FigmaStyleMetadata["style_type"], "GRID">;
};

export const getStyleNodes = async (
  figmaApiClient: FigmaApiClient,
  styles: FigmaStyleMetadata[],
  logger: Logger = Logger()
): Promise<StyleNode[]> => {
  // remove GRID styles
  const filteredStyleMetadatas: FigmaStyleMetadataNoGrid[] = styles.filter(
    ({ style_type }) => style_type !== "GRID"
  ) as FigmaStyleMetadataNoGrid[];
  // get unique file keys
  const uniqueFileKeys = getUniqueFileKeys(styles);
  // separate styles by file key reference
  const filteredStyleSets: [FigmaFileKey, FigmaStyleMetadata[]][] =
    uniqueFileKeys.map((uniqueFileKey) => [
      uniqueFileKey,
      styles.filter(({ file_key }) => file_key === uniqueFileKey),
    ]);
  // make one api call per unique file key to request all nodes corresponding to style metadata
  const fileNodeResponses = await Promise.all(
    filteredStyleSets.map(([fileKey, styleSet]) =>
      figmaApiClient.getFileNodes(fileKey, {
        ids: styleSet.map(({ node_id }) => node_id).join(","),
      })
    )
  );
  const filteredFileNodeResponses = fileNodeResponses.filter(
    (response: (typeof fileNodeResponses)[number]) => !isNull(response)
  ) as NonNullable<(typeof fileNodeResponses)[number]>[];
  // unwrap nodes from files
  const allNodes: FigmaFileNodeResponse[] = filteredFileNodeResponses.flatMap(
    ({ nodes }) => Object.values(nodes)
  );
  // map style metadata to node style values
  return filteredStyleMetadatas
    .map((styleMetadata) => {
      const correspondingNode =
        allNodes.find((node) => node.document.id === styleMetadata.node_id) ??
        null;
      if (!correspondingNode) {
        logger.warn(
          `Unable to find matching node ${styleMetadata.node_id} for style ${styleMetadata.key}`
        );
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
        styleProperties: getNodeStyleProperties(
          styleMetadata.style_type,
          correspondingNode
        ),
      };
    })
    .filter((item) => item !== null) as StyleNode[];
};

/**
 * Calls {@link getStyleNodes} passing in the figmaApiClient, styles, and logger to get style values from their metadata.
 * Transform each StyleNode to a token using the styleNodeToToken function. The resulting tokens are returned as an array.
 * Finally, it filters out any empty tokens and casts the resulting array as Token[].
 * @param {@link FigmaApiClient} figmaApiClient - Figma api client
 * @param styles
 * @param logger
 */
export const tokenizeStyles = async (
  figmaApiClient: FigmaApiClient,
  styles: FigmaStyleMetadata[],
  logger: Logger = Logger()
): Promise<Token[]> => {
  logger.info(
    `Populating all ${styles.length} filtered styles based on metadata...`
  );
  const styleNodes = await getStyleNodes(figmaApiClient, styles, logger);
  logger.info("Transforming figma styles to tokens...");
  const tokens = styleNodes.map((styleNode) => styleNodeToToken(styleNode));
  logger.info("Done");
  return tokens.filter((token) => !!token) as Token[];
};
