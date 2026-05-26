/* global process */
import axios from "axios";

const API_PREFIX = "api";
const LOCAL_API_ORIGIN = "http://localhost:3444";

const normalizeApiOrigin = (apiUrl) => {
  const trimmedApiUrl = apiUrl?.trim();

  if (!trimmedApiUrl) {
    return "";
  }

  try {
    const url = new URL(trimmedApiUrl);
    const normalizedPath = url.pathname.replace(/\/+$/, "");

    if (normalizedPath === `/${API_PREFIX}`) {
      url.pathname = "/";
    }

    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
};

const API_URL =
  normalizeApiOrigin(process.env.NEXT_PUBLIC_API_URL) ||
  (import.meta.env.DEV ? LOCAL_API_ORIGIN : "");

const apiUrl = (...segments) => {
  if (!API_URL) {
    throw new Error(
      "Missing or invalid NEXT_PUBLIC_API_URL. Set it to the Render backend origin, for example https://ems-yx5o.onrender.com.",
    );
  }

  const path = [API_PREFIX, ...segments]
    .flatMap((segment) => String(segment).split("/"))
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${API_URL}/${path}`;
};

const api = axios.create();

api.interceptors.request.use((config) => {
  if (!API_URL) {
    return Promise.reject(
      new Error(
        "Missing or invalid NEXT_PUBLIC_API_URL. Set it to the Render backend origin, for example https://ems-yx5o.onrender.com.",
      ),
    );
  }

  const requestUrl = config.url || "";

  if (!requestUrl.startsWith(`${API_URL}/${API_PREFIX}/`)) {
    return Promise.reject(
      new Error(
        `Blocked API request to ${requestUrl || "an empty URL"}. API requests must use NEXT_PUBLIC_API_URL and target the Render backend.`,
      ),
    );
  }

  return config;
});

export default api;
export { API_URL, apiUrl, normalizeApiOrigin };
