import { http } from "./http";

export const branchesApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/branches${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/branches/${id}`);
  },

  create(data) {
    return http.request("/branches", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/branches/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  activate(id) {
    return http.request(`/branches/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return http.request(`/branches/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/branches/${id}/history`);
  },
};
