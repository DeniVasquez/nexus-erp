/**
 * Verifica que department/municipality/district formen una cadena
 * consistente (RN-EMP-003, RN-BRA-006: toda empresa/sucursal debe tener una
 * dirección geográfica válida). No lanza: cada módulo que la use decide qué
 * error de dominio propio lanzar si devuelve false.
 */
export const isValidGeoLocation = async (geoRepository, { departmentId, municipalityId, districtId }) => {
  if (!departmentId || !municipalityId || !districtId) return false;

  const municipality = await geoRepository.findMunicipalityById(municipalityId);
  if (!municipality || String(municipality.department) !== String(departmentId)) return false;

  const district = await geoRepository.findDistrictById(districtId);
  if (!district || String(district.municipality) !== String(municipalityId)) return false;

  return true;
};
