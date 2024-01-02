import { extractQueryParams } from "./endpoints.utils";

/**
 * Extracts the file key from file URL
 * @param {string} fileURL - Figma file URL (https://www.figma.com/file/:key/:title)
 * @return {string} fileKey
 */
export const extractFileKeyFromUrl = (fileURL: string): string => {
   return fileURL.split("/").reverse()[1];
}

/**
 * Extracts the node ID from a file URL.
 *
 * @param {string} fileURL - The URL of the file.
 * @return {string | null} The extracted node ID, or null if not found.
 */
export const extractNodeIdFromFileUrl = (fileURL: string): string | null => {
   return extractQueryParams(fileURL)["node-id"] ?? null;
}