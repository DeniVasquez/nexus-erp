import { http } from "./http";

export const countriesApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/countries${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/countries/${id}`);
  },

  create(data) {
    return http.request("/countries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/countries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  activate(id) {
    return http.request(`/countries/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return http.request(`/countries/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/countries/${id}/history`);
  },
};
