import { throwError } from "./endpoints.utils";
import { NonOptional, Optional } from "../types/global/global.types";
import type { Logger } from "./log.utils";

type InputConfig = Record<string, Optional<string>>;
type OutputConfig<TInputConfig extends InputConfig> = {
  [TKey in keyof TInputConfig]-?: NonOptional<TInputConfig[TKey]>;
};

export const validateConfig = <TInputConfig extends InputConfig>(config: TInputConfig, logger: Logger): OutputConfig<TInputConfig> => {
  const missingConfigItems = Object.entries(config).filter(([_key, value]) => !value)
  if(missingConfigItems.length === 0) return config as OutputConfig<TInputConfig>
  const errorMessage = missingConfigItems.map(([key, _value]) => key).join(", ");
  logger.error(`Missing config: ${errorMessage}`)
}