import { extractQueryParams } from "./endpoints.utils";

/**
 * Extracts the file key from file URL
 * @param {string} fileURL - Figma file URL (https://www.figma.com/file/:key/:title)
 * @return {string} fileKey
 */
export const extractFileKeyFromUrl = (fileURL: string): string => {
   return fileURL.split("/").reverse()[1];
}

export const extractNodeIdFromFileUrl = (fileURL: string): string | null => {
   return extractQueryParams(fileURL)["node-id"] ?? null;
}