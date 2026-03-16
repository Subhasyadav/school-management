// utils/url.ts
import { API_BASE_URL } from './config';

export function getFullUrl(path?: string): string | undefined {
  if (!path) return undefined;
  // If it's already an absolute URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}