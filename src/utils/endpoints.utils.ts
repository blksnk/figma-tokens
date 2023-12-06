import { EndpointUrlFn } from "../types/global/endpoints.types";
import { FIGMA_TOKEN } from "../api/config";
import { Logger } from "./log.utils";

export const formatQueryParams = (queryParams?: object) => {
  if (!queryParams) return "";
  return `?${
    Object
      .entries(queryParams)
      .map(([ key, value ]) => `${ key }=${ String(value) }`)
      .join("&")
  }`
}

export const extractQueryParams = (srcURL: string): Record<string, string> => {
  const queryPart = srcURL.split("?")[1];
  if(!queryPart) return {};
  return Object.fromEntries(
    queryPart
      .split("&")
      .map(pairStr => pairStr.split("="))
  )
}

const formatHeaders = (token: string) => ({
  "X-Figma-Token": token,
})

export const endpointFactory = <
  TQueryParams extends object = {},
  TResponse
>(URLFn: Function, token: string = FIGMA_TOKEN, logger: Logger = Logger()) =>
  async (pathParam: Parameters<typeof URLFn>[0], queryParams: TQueryParams): Promise<TResponse | null> => {
  const baseURL = URLFn(pathParam);
  const query = formatQueryParams(queryParams);
  const headers = formatHeaders(token);
  const URL = [baseURL, query].join("");
  try {
    const response = await fetch(URL, {
      headers,
    })
    const data = await response.json<TResponse>();
    return data;
  } catch (e) {
    logger.error(`[${URL}]: ${e.message}`)
    return null;
  }
}
export const throwError = (message: string) => {
  throw new Error(message);
}

export const validateKey = <T>(maybeFileKey: T | undefined): T => {
  if (!maybeFileKey) throwError("Missing file key")
  return maybeFileKey as T;
}