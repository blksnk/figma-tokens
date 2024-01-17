/**
 * Represents a function type that generates API endpoint URLs.
 * It takes a specific parameter and returns a string representing the endpoint URL.
 */
export type EndpointUrlFn = (fileKey: string) => string;

export type EmptyQueryParams = Record<string, never>;
