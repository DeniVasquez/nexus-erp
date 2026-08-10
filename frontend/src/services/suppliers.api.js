import { http } from "./http";

export const suppliersApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/suppliers${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/suppliers/${id}`);
  },

  create(data) {
    return http.request("/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  activate(id) {
    return http.request(`/suppliers/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return http.request(`/suppliers/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/suppliers/${id}/history`);
  },
};
