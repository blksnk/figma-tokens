import { Logger } from "./log.utils";
import {
  EmptyQueryParams,
  EndpointUrlFn,
} from "../types/global/endpoints.types";
import { NonOptional, Optional, isUndefined } from "@ubloimmo/front-util";

/**
 * Formats the query parameters into a string.
 *
 * @param {object} queryParams - The query parameters to format.
 * @return {string} The formatted query parameters as a string.
 */
export const formatQueryParams = (queryParams?: object) => {
  if (!queryParams) return "";
  return `?${Object.entries(queryParams)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&")}`;
};

/**
 * Extracts query parameters from a given URL and returns them as an object.
 *
 * @param {string} srcURL - The URL from which to extract query parameters.
 * @return {Record<string, string>} - An object containing the extracted query parameters.
 */
export const extractQueryParams = (srcURL: string): Record<string, string> => {
  const queryPart = srcURL.split("?")[1];
  if (!queryPart) return {};
  return Object.fromEntries(
    queryPart.split("&").map((pairStr) => pairStr.split("="))
  );
};

/**
 * Generate a formatted set of headers for a Figma API request.
 *
 * @param {string} token - The Figma access token.
 * @return {object} - The formatted headers object.
 */
const formatHeaders = (token: string) => ({
  "X-Figma-Token": token,
});

/**
 * Creates an endpoint factory function that generates API endpoints.
 *
 * @param {Function} URLFn - A function that returns the base URL for the endpoint.
 * @param {string} [token=FIGMA_TOKEN] - An optional authentication token.
 * @param {Logger} [logger=Logger()] - An optional logger for logging errors.
 * @returns {(pathParam: Parameters<typeof URLFn>[0], queryParams: TQueryParams) => Promise<TResponse | null>} - An endpoint function that takes a path parameter and query parameters, and returns a Promise that resolves to the response or null.
 */
export const endpointFactory =
  <
    TQueryParams extends object = EmptyQueryParams,
    TResponse extends object = object
  >(
    URLFn: EndpointUrlFn,
    token: string,
    logger: Logger = Logger()
  ) =>
  async (
    pathParam: Parameters<typeof URLFn>[0],
    queryParams?: TQueryParams
  ): Promise<TResponse | null> => {
    const baseURL = URLFn(pathParam);
    const query = formatQueryParams(queryParams ?? {});
    const headers = formatHeaders(token);
    const URL = [baseURL, query].join("");
    try {
      const response = await fetch(URL, {
        headers,
      });
      return (await response.json()) as TResponse;
    } catch (e: unknown) {
      logger.error(`[${URL}]: ${(e as Error).message}`);
      return null;
    }
  };

/**
 * Throws an error with the specified message.
 *
 * @param {string} message - The error message.
 * @throws {Error} Throws an Error object with the specified message.
 */
export const throwError = (message: string) => {
  throw new Error(message);
};

/**
 * Validates the given file key.
 * @template T {string}
 * @param {T | undefined} maybeFileKey - The file key to be validated.
 * @return {T} - The validated file key.
 * @throws {Error} - If the file key is undefined.
 */

export const validateKey = <T extends Optional<string>>(
  maybeFileKey: T
): NonOptional<T> => {
  if (isUndefined(maybeFileKey)) throwError("Missing file key");
  return maybeFileKey as NonOptional<T>;
};
