import { http } from "./http";

export const subCategoriesApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/sub-categories${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/sub-categories/${id}`);
  },

  create(data) {
    return http.request("/sub-categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/sub-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  activate(id) {
    return http.request(`/sub-categories/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return http.request(`/sub-categories/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/sub-categories/${id}/history`);
  },
};
