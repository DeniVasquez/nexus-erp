/**
 * Puerto de solo lectura para los catálogos geográficos (departments,
 * municipalities, districts). Son catálogos administrados externamente al
 * ERP (ERS 6.3.3/6.4.3: "de solo lectura, no forman parte del mantenimiento
 * del sistema"), por eso este puerto no tiene create/update/remove.
 */
export class GeoRepository {
  async findAllDepartments() {
    throw new Error('GeoRepository.findAllDepartments no implementado');
  }

  async findDepartmentById(_id) {
    throw new Error('GeoRepository.findDepartmentById no implementado');
  }

  async findMunicipalitiesByDepartment(_departmentId) {
    throw new Error('GeoRepository.findMunicipalitiesByDepartment no implementado');
  }

  async findMunicipalityById(_id) {
    throw new Error('GeoRepository.findMunicipalityById no implementado');
  }

  async findDistrictsByMunicipality(_municipalityId) {
    throw new Error('GeoRepository.findDistrictsByMunicipality no implementado');
  }

  async findDistrictById(_id) {
    throw new Error('GeoRepository.findDistrictById no implementado');
  }
}
