import { http } from "./http";

// Catálogos de solo lectura (departamentos, municipios, distritos).
// Cualquier usuario autenticado puede consultarlos, no requieren permiso RBAC.
export const geoApi = {
  getDepartments() {
    return http.request("/geo/departments");
  },

  getMunicipalities(departmentId) {
    return http.request(`/geo/departments/${departmentId}/municipalities`);
  },

  getDistricts(municipalityId) {
    return http.request(`/geo/municipalities/${municipalityId}/districts`);
  },
};
