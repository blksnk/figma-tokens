import { NonOptional, Optional } from "../types/global/global.types";
import { Logger } from "./log.utils";
import { extractFileKeyFromUrl } from "./figma.utils";
import { FigmaFileKey } from "../types/figma/figma.properties.types";

type InputConfig = Record<string, Optional<string>>;
type OutputConfig<TInputConfig extends InputConfig> = {
  [TKey in keyof TInputConfig]-?: NonOptional<TInputConfig[TKey]>;
};

export const validateConfig = <TInputConfig extends InputConfig>(
  config: TInputConfig,
  logger: Logger = Logger()
): OutputConfig<TInputConfig> => {
  const missingConfigItems = Object.entries(config).filter(([_key, value]) => !value)
  if(missingConfigItems.length === 0) return config as OutputConfig<TInputConfig>
  const errorMessage = missingConfigItems.map(([key, _value]) => key).join(", ");
  logger.error(`Missing config: ${errorMessage}`)
}

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