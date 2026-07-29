import { http } from "./http";

export const companiesApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/companies${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/companies/${id}`);
  },

  create(data) {
    return http.request("/companies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  activate(id) {
    return http.request(`/companies/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return http.request(`/companies/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/companies/${id}/history`);
  },
};
