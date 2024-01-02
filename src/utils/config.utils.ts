import { NonOptional, Optional } from "../types/global/global.types";
import { Logger } from "./log.utils";
import { extractFileKeyFromUrl } from "./figma.utils";
import { FigmaFileKey } from "../types/figma/figma.properties.types";

type InputConfig = Record<string, Optional<string>>;
type OutputConfig<TInputConfig extends InputConfig> = {
  [TKey in keyof TInputConfig]-?: NonOptional<TInputConfig[TKey]>;
};

/**
 * Validates the given input configuration and returns an output configuration.
 *
 * @param {TInputConfig} config - The input configuration to validate.
 * @param {Logger} logger - The logger object for logging errors. Default value is a new instance of Logger.
 * @return {OutputConfig<TInputConfig>} - The output configuration after validation.
 */
export const validateConfig = <TInputConfig extends InputConfig>(
  config: TInputConfig,
  logger: Logger = Logger()
): OutputConfig<TInputConfig> => {
  const missingConfigItems = Object.entries(config).filter(([_key, value]) => !value)
  if(missingConfigItems.length === 0) return config as OutputConfig<TInputConfig>
  const errorMessage = missingConfigItems.map(([key, _value]) => key).join(", ");
  logger.error(`Missing config: ${errorMessage}`)
}

/**
 * Extracts figma file keys from a given config file url string.
 *
 * @param {string} fileUrls - Comma separated list of config file URLs.
 * @param {Logger} logger - The logger to use for logging messages. Defaults to a new Logger instance.
 * @return {FigmaFileKey[]} - An array of figma file keys extracted from the config files.
 */
export const extractConfigFileKeys = (
  fileUrls: string,
  logger: Logger = Logger()
): FigmaFileKey[] => {
  logger.info("Extracting figma file keys from config")
  const urls = fileUrls.split(",");
  if (fileUrls.length === 0 || urls.length === 0) {
    logger.error("No file URLs found, unable to filter team styles by files")
    return []
  }
  logger.info("Found two file URLs")
  return urls.map(url => extractFileKeyFromUrl(url));
}