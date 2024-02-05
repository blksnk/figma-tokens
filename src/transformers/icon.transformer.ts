import { Nullish, isNullish } from "@ubloimmo/front-util";
import { FigmaApiClient } from "../api/client";
import { FigmaFileKey } from "../types/figma/figma.properties.types";
import { FigmaComponentMetadata } from "../types/figma/figma.teams.types";
import { Icon } from "../types/global/export.types";
import { Logger } from "../utils/log.utils";

/**
 * Maximum number of concurrent API before hitting the rate limit.
 */
const RATE_LIMIT = 20 as const;

const RETRY_LIMIT = 3 as const;

/**
 * Time to wait between concurrent API calls to avoid rate limiting.
 */
const WAIT_TIME_IN_SECONDS = 45 as const;

/**
 * Name prefix for icon components; e.g. `CustomIcon/building-blocks`
 */
const ICON_COMPONENT_NAME_PREFIX = "CustomIcon/" as const;

/**
 * Asynchronous function to delay execution for a specified number of seconds.
 *
 * @param {number} delayInSeconds - the number of seconds to delay execution
 * @param {Logger} logger - the logger object for logging
 * @return {Promise<void>} a Promise that resolves after the specified delay
 */
const delay = async (
  delayInSeconds = WAIT_TIME_IN_SECONDS,
  logger = Logger()
) => {
  logger.info(`Waiting for ${delayInSeconds} seconds...`);
  return await new Promise((resolve) =>
    setTimeout(resolve, delayInSeconds * 1000)
  );
};

/**
 * Asynchronous function to fetch SVG data from the provided URL.
 *
 * @param {Nullish<string>} svgUrl - The URL of the SVG to fetch
 * @param {Logger} logger - Optional logger for logging information
 * @return {Promise<string | null>} The fetched SVG data as a string, or null if an error occurs
 */
const fetchSvgData = async (svgUrl: Nullish<string>, logger = Logger()) => {
  if (!svgUrl) return null;
  try {
    logger.info(`Fetching SVG DOM from url: ${svgUrl}`);
    const svgDomResponse = await fetch(svgUrl);
    if (svgDomResponse.ok) {
      return await svgDomResponse.text();
    }
    return null;
  } catch (e) {
    logger.warn((e as Error).message);
    return null;
  }
};

/**
 * Fetches SVG icons from Figma and returns a list of Icon objects.
 * This function iterates through the Figma components metadata to filter and fetch SVG images for the icons,
 * handling rate limits and retries, and then constructs and returns a list of Icon objects.
 *
 * @param {FigmaApiClient} figmaApiClient - The Figma API client
 * @param {FigmaComponentMetadata[]} componentsMeta - The metadata of Figma components
 * @param {FigmaFileKey} iconFileKey - The key of the Figma file containing the icons
 * @param {Logger} [logger=Logger()] - The logger for logging messages
 * @return {Promise<Icon[]>} A promise that resolves to a list of Icon objects
 */
export const fetchIconSvgs = async (
  figmaApiClient: FigmaApiClient,
  componentsMeta: FigmaComponentMetadata[],
  iconFileKey: FigmaFileKey,
  logger = Logger()
): Promise<Icon[]> => {
  logger.info(`Found ${componentsMeta.length} exported components`);
  logger.info("Filtering compoents based on the icon component name prefix...");
  const iconComponentsMeta = componentsMeta.filter((item) =>
    item.name.startsWith(ICON_COMPONENT_NAME_PREFIX)
  );
  const iconsCount = iconComponentsMeta.length;
  logger.info(`Found ${iconsCount} published icon components.`);
  logger.log(iconComponentsMeta);

  const icons: Icon[] = [];

  let retryCount = 0;

  for (let i = 0; i < iconsCount; i += RATE_LIMIT) {
    const batch = iconComponentsMeta.slice(i, i + RATE_LIMIT);
    logger.info(
      `Fetching images for batch ${i}-${i + Math.min(batch.length, RATE_LIMIT)}`
    );
    const iconsSvgReponse = await figmaApiClient.getImages(iconFileKey, {
      format: "svg",
      ids: batch.map((iconMeta) => iconMeta.node_id),
    });
    if (!iconsSvgReponse || iconsSvgReponse?.err) {
      logger.warn(iconsSvgReponse?.err ?? "Failed to fetch icon batch");
      await delay(WAIT_TIME_IN_SECONDS);
      if (retryCount >= RETRY_LIMIT) {
        logger.error("Exceeded retry count for current batch");
        break;
      }
      logger.info("Retrying failed batch...");
      i -= RATE_LIMIT;
      retryCount++;
      continue;
    }
    retryCount = 0;

    for (const nodeId in iconsSvgReponse.images) {
      const svgUrl = iconsSvgReponse.images[nodeId];
      let componentName = iconComponentsMeta.find(
        ({ node_id }) => node_id === nodeId
      )?.name;
      const isUnknownIcon = isNullish(componentName);
      const defaultName = `unknown-${nodeId}`;
      const name = componentName
        ? componentName.split(ICON_COMPONENT_NAME_PREFIX)[1]
        : defaultName;
      componentName = componentName ?? defaultName;
      const svg = await fetchSvgData(svgUrl, logger);
      if (isNullish(svg)) {
        logger.warn(`No SVG returned for icon ${name}, skipping`);
        continue;
      }

      icons.push({
        nodeId,
        name,
        componentName,
        unknown: isUnknownIcon,
        svg,
      });
    }
  }

  return icons;
};
