import axios from "axios";

const API_PATH = "/api";

const normalizeApiBaseUrl = (apiUrl) => {
  const trimmedApiUrl = apiUrl?.trim();

  if (!trimmedApiUrl) {
    return "";
  }

  try {
    const url = new URL(trimmedApiUrl);
    const normalizedPath = url.pathname.replace(/\/+$/, "");

    if (normalizedPath === API_PATH) {
      url.pathname = "/";
    }

    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/+$/, "");
  } catch {
    return "";
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
        "Missing or invalid VITE_API_URL. Set it to the backend API origin, for example https://ems-yx5o.onrender.com.",
      ),
    );
  }

  return config;
});

export default api;
export { API_BASE_URL, API_PATH, normalizeApiBaseUrl };
