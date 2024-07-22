import { DeepNonNullish } from "../types/global/global.types";
import * as util from "util";

type LoggerMode = "auto" | "simple";
type LoggerSeverity = "info" | "error" | "warn" | "log" | "debug";
type LoggerPrefixes = Record<LoggerSeverity, string>;

export type LoggerConfig = {
  mode?: LoggerMode;
  warningsAsErrors?: boolean;
  throwOnError?: boolean;
  hideDebug?: boolean;
  hideLogs?: boolean;
  prefixes?: LoggerPrefixes;
  spacing?: number;
};

/**
 * Default {@link Logger} config
 */
const defaultConfig: DeepNonNullish<LoggerConfig> = {
  mode: "auto",
  warningsAsErrors: false,
  throwOnError: false,
  hideDebug: false,
  hideLogs: false,
  prefixes: {
    info: "Info:    ",
    error: "Error:   ",
    warn: "Warning: ",
    log: "Log:     ",
    debug: "Debug:   ",
  },
  spacing: 0,
};

type LoggerFn = (message: unknown, name?: string) => void;

export type Logger = {
  config: DeepNonNullish<LoggerConfig>;
  log: LoggerFn;
  info: LoggerFn;
  warn: LoggerFn;
  error: LoggerFn;
  debug: LoggerFn;
};

/**
 * A factory function that creates a Logger object with optional initial configuration.
 *
 * @param {LoggerConfig} [initialConfig = defaultConfig] - Optional initial configuration for the Logger object.
 * @return {Logger} A Logger object.
 */
export function Logger(initialConfig?: LoggerConfig): Logger {
  const config = Object.assign({}, defaultConfig, initialConfig);
  /**
   * Logs a message with the specified severity level and optional name.
   *
   * @param {unknown} message - The message to be logged.
   * @param {LoggerSeverity} severity - The severity level of the log, determines which console method is called.
   * @param {string} [name] - Optional name to be included in the log.
   */
  const logMessage = (
    message: unknown,
    severity: LoggerSeverity,
    name?: string
  ) => {
    // eslint-disable-next-line no-console
    const logFn = console[severity];
    if (!logFn) return;
    const prefix = name
      ? `[${config.prefixes[severity].replaceAll(":", "").trim()}] ${name}:`
      : config.prefixes[severity];
    const spacing = Array(config.spacing).fill("\n").join("");
    if (config.mode === "auto" && typeof message === "object") {
      logFn(prefix);
      util.inspect(message);
    } else {
      logFn(prefix, message);
    }
    const typeInfo = Array.isArray(message)
      ? `array[${message.length}]`
      : typeof message;
    if (severity === "debug") {
      logFn(`( ${typeInfo} )`, spacing);
    } else {
      logFn(spacing);
    }
  };

  /**
   * Logs a message to the console.
   *
   * @param {unknown} message - The message to be logged.
   * @param {string} [name] - Optional name of the logger.
   */
  const log = (message: unknown, name?: string) => {
    if (config.hideLogs) return;
    logMessage(message, "log", name);
  };

  /**
   * Logs an informational message.
   *
   * @param {unknown} message - The message to log.
   * @param {string} [name] - The name associated with the message.
   */
  const info = (message: unknown, name?: string) => {
    logMessage(message, "info", name);
  };

  /**
   * Logs a warning message.
   *
   * @param {unknown} message - The message to log.
   * @param {string} [name] - Optional name for the warning.
   */
  const warn = (message: unknown, name?: string) => {
    if (config.warningsAsErrors) {
      error(message, name);
    } else {
      logMessage(message, "warn", name);
    }
  };

  /**
   * Logs an error message and throws an error if configured to do so.
   *
   * @param {unknown} message - The error message to be logged and possibly thrown.
   * @param {string} [name] - The name of the error.
   * @return {void} This function does not return anything.
   */
  const error = (message: unknown, name?: string) => {
    logMessage(message, "error", name);
    if (config.throwOnError) {
      throw new Error(message as string);
    }
  };

  /**
   * Logs a debug message to the console.
   *
   * @param {unknown} message - The message to be logged.
   * @param {string} name - (Optional) The name of the logger.
   * @return {void} This function does not return a value.
   */
  const debug = (message: unknown, name?: string) => {
    if (config.hideDebug) return;
    logMessage(message, "debug", name);
  };
  return {
    config,
    log,
    info,
    warn,
    error,
    debug,
  };
}
