const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() || "/api"
).replace(/\/+$/, "");

export const apiUrl = (path = "") => {
  if (!path) {
    return API_BASE_URL;
  }

  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

export { API_BASE_URL };
