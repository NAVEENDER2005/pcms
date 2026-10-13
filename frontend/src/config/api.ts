/**
 * Dynamic API Base URL configuration:
 * - Uses VITE_API_BASE_URL if explicitly provided in environment
 * - In production (when built & served by backend), defaults to '' (same-origin relative paths)
 * - In local development, defaults to 'http://localhost:8000'
 */
export const API_BASE_URL: string =
  typeof import.meta.env.VITE_API_BASE_URL === 'string'
    ? import.meta.env.VITE_API_BASE_URL
    : (import.meta.env.PROD ? '' : 'http://localhost:8000');

export default API_BASE_URL;
