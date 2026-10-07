/**
 * apiConfig.js
 * Centralized API base URL config.
 * In development, Vite proxies '/api' to backend http://localhost:8000.
 * In production or custom deploys, VITE_API_BASE can be specified.
 */
export const API_BASE = import.meta.env.VITE_API_BASE || '';
