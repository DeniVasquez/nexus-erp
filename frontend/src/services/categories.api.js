import { http } from "./http";

export const categoriesApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/categories${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/categories/${id}`);
  },

  create(data) {
    return http.request("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  activate(id) {
    return http.request(`/categories/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return http.request(`/categories/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/categories/${id}/history`);
  },
};
