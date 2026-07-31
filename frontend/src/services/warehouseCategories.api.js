import { http } from "./http";

export const warehouseCategoriesApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/warehouse-categories${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/warehouse-categories/${id}`);
  },

  create(data) {
    return http.request("/warehouse-categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/warehouse-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deactivate(id) {
    return http.request(`/warehouse-categories/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/warehouse-categories/${id}/history`);
  },
};
