// Catálogo de solo lectura: no hay reglas de negocio que aplicar, por eso el
// controller habla directo con el repositorio en vez de pasar por
// application/use-cases (esa capa existiría solo para reenviar la llamada
// sin agregar nada, puro boilerplate).

const toDepartmentDTO = (d) => ({ _id: d.id, id: d.id, code: d.code, name: d.name, shortName: d.shortName });
const toMunicipalityDTO = (m) => ({ _id: m.id, id: m.id, code: m.code, name: m.name, department: m.department });
const toDistrictDTO = (d) => ({ _id: d.id, id: d.id, code: d.code, name: d.name, municipality: d.municipality });

export class GeoController {
  constructor({ geoRepository }) {
    this.geoRepository = geoRepository;
  }

  getDepartments = async (req, res) => {
    try {
      const departments = await this.geoRepository.findAllDepartments();
      res.status(200).json({ msj: 'Departamentos obtenidos correctamente', data: departments.map(toDepartmentDTO) });
    } catch (error) {
      res.status(500).json({ msj: 'Error obteniendo departamentos', error: error.message });
    }
  };

  getMunicipalitiesByDepartment = async (req, res) => {
    try {
      const municipalities = await this.geoRepository.findMunicipalitiesByDepartment(req.params.departmentId);
      res.status(200).json({ msj: 'Municipios obtenidos correctamente', data: municipalities.map(toMunicipalityDTO) });
    } catch (error) {
      res.status(500).json({ msj: 'Error obteniendo municipios', error: error.message });
    }
  };

  getDistrictsByMunicipality = async (req, res) => {
    try {
      const districts = await this.geoRepository.findDistrictsByMunicipality(req.params.municipalityId);
      res.status(200).json({ msj: 'Distritos obtenidos correctamente', data: districts.map(toDistrictDTO) });
    } catch (error) {
      res.status(500).json({ msj: 'Error obteniendo distritos', error: error.message });
    }
  };
}
