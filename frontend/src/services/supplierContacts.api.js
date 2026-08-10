import { http } from "./http";

export const supplierContactsApi = {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return http.request(`/supplier-contacts${params ? `?${params}` : ""}`);
  },

  getById(id) {
    return http.request(`/supplier-contacts/${id}`);
  },

  create(data) {
    return http.request("/supplier-contacts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return http.request(`/supplier-contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  activate(id) {
    return http.request(`/supplier-contacts/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return http.request(`/supplier-contacts/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  getHistory(id) {
    return http.request(`/supplier-contacts/${id}/history`);
  },
};
