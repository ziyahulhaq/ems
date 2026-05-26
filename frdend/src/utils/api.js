import axios from "axios";

const API_PATH = "/api";

const normalizeApiBaseUrl = (apiUrl) => {
  const trimmedApiUrl = apiUrl?.trim();

  if (!trimmedApiUrl) {
    return import.meta.env.DEV ? API_PATH : "";
  }

  const withoutTrailingSlash = trimmedApiUrl.replace(/\/+$/, "");

  try {
    const url = new URL(withoutTrailingSlash);
    const normalizedPath = url.pathname.replace(/\/+$/, "");

    if (!normalizedPath || normalizedPath === "/") {
      url.pathname = API_PATH;
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    const relativeUrl = withoutTrailingSlash.startsWith("/")
      ? withoutTrailingSlash
      : `/${withoutTrailingSlash}`;

    return relativeUrl;
  }
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL || undefined,
});

api.interceptors.request.use((config) => {
  if (!API_BASE_URL) {
    return Promise.reject(
      new Error(
        "Missing VITE_API_URL. Set it to the backend API URL, for example https://your-backend.example.com/api.",
      ),
    );
  }

  return config;
});

export default api;
export { API_BASE_URL, normalizeApiBaseUrl };
