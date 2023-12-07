import { DeepNonNullish } from "../types/global/global.types";
import * as util from "util";

type LoggerMode = "auto" | "simple";
type LoggerSeverity = "info" | "error" | "warn" | "log" | "debug"

type LoggerPrefixes = Record<LoggerSeverity, string>;

export type LoggerConfig = {
  mode?: LoggerMode
  warningsAsErrors?: boolean;
  throwOnError?: boolean;
  hideDebug?: boolean;
  hideLogs?: boolean;
  prefixes?: LoggerPrefixes;
  spacing?: number;
}

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
}

type LoggerFn = (message: unknown, name?: string) => void;

export type Logger = {
  config: DeepNonNullish<LoggerConfig>,
  log: LoggerFn;
  info: LoggerFn;
  warn: LoggerFn;
  error: LoggerFn;
  debug: LoggerFn;
}

export function Logger(initialConfig?: LoggerConfig): Logger {

  const config = Object.assign({}, defaultConfig, initialConfig);

  const logMessage = (message: unknown, severity: LoggerSeverity, name?: string) => {
    const logFn = console[severity];
    if(!logFn) return;
    const prefix = name ? `[${config.prefixes[severity].replaceAll(":", "").trim()}] ${name}:` : config.prefixes[severity];
    const spacing = Array(config.spacing).fill("\n").join("");
    if (config.mode === "auto" && typeof message === "object") {
      logFn(prefix)
      util.inspect(message)
    } else {
      logFn(prefix, message);
    }
    const typeInfo = Array.isArray(message) ? `array[${message.length}]` : typeof message;
    if(severity === "debug") {
      logFn(`( ${typeInfo} )`, spacing);
    } else {
      logFn(spacing)
    }
  }

  const log = (message: unknown, name?: string) => {
    if(config.hideLogs) return;
    logMessage(message, "log", name)
  }

  const info = (message: unknown, name?: string) => {
    logMessage(message, "info", name)
  }

  const warn = (message: unknown, name?: string) => {
    if (config.warningsAsErrors) {
      error(message, name)
    } else {
      logMessage(message, "warn", name)
    }
  }

  const error = (message: unknown, name?: string) => {
    logMessage(message, "error", name);
    if (config.throwOnError) {
      throw new Error(message as string);
    }
  }

  const debug =(message: unknown, name?: string) => {
    if(config.hideDebug) return;
    logMessage(message, "debug", name)
  }
  return {
    config,
    log,
    info,
    warn,
    error,
    debug,
  }
}