/**
 * Extrae un id plano de un valor que puede venir como ObjectId/string crudo
 * o como subdocumento poblado (ej. `company.department` después de un
 * `.populate()`, que trae `{ _id, code, name, shortName }`). Los repos de
 * `companies`/`branches` devuelven la entidad ya poblada, así que al
 * revalidar la ubicación con el valor "viejo" (cuando el request solo cambia
 * uno de los tres campos) hay que desenvolver el id antes de comparar.
 */
export const extractGeoId = (value) => {
  if (value && typeof value === 'object') return String(value._id ?? value.id ?? '');
  return value;
};

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
