import { http } from "./http";

export const locationsApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/locations${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/locations/${id}`);
  },

  create(data) {
    return http.request("/locations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/locations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  activate(id) {
    return http.request(`/locations/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return http.request(`/locations/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/locations/${id}/history`);
  },
};
