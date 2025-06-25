/**
 * URL helper for Playwright tests
 * Resolves internal paths relative to the baseURL configured in playwright.config.ts
 */

/**
 * Resolve an internal path for navigation in tests
 * @param path - The internal path (e.g., "/about", "/event/123")
 * @param baseURL - The base URL from Playwright context
 * @returns The resolved path for navigation
 */
export function resolveTestPath(path: string, baseURL: string): string {
  // If path is already absolute, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // For root path, just return the baseURL
  if (!path || path === '/') {
    return baseURL;
  }
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Combine baseURL and path
  const combined = `${baseURL}${cleanPath}`;
  
  // Fix protocol double slashes that might get collapsed
  return combined.replace(/^(https?):\/([^\/])/, '$1://$2');
}