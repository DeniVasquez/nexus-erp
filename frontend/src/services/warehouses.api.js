import { http } from "./http";

export const warehousesApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/warehouses${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/warehouses/${id}`);
  },

  create(data) {
    return http.request("/warehouses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/warehouses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  activate(id) {
    return http.request(`/warehouses/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return http.request(`/warehouses/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/warehouses/${id}/history`);
  },
};
