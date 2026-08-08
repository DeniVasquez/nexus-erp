import {
  InvalidCountryIdError,
  CountryNotFoundError,
  DuplicateCountryNameError,
} from '../../domain/errors.js';

const toCountryDTO = (country) => ({
  _id: country.id,
  id: country.id,
  name: country.name,
  isActive: country.isActive,
  createdAt: country.createdAt,
  updatedAt: country.updatedAt,
});

const pickDefinedFields = (body, keys) =>
  keys.reduce((changes, key) => {
    if (body[key] !== undefined && body[key] !== '') changes[key] = body[key];
    return changes;
  }, {});

const FIELDS = ['name'];

export class CountryController {
  constructor({ listCountries, getCountryById, createCountry, updateCountry, activateCountry, deactivateCountry }) {
    this.listCountriesUseCase = listCountries;
    this.getCountryByIdUseCase = getCountryById;
    this.createCountryUseCase = createCountry;
    this.updateCountryUseCase = updateCountry;
    this.activateCountryUseCase = activateCountry;
    this.deactivateCountryUseCase = deactivateCountry;
  }

  #handleError(res, error, fallbackMsj) {
    if (error instanceof InvalidCountryIdError) return res.status(400).json({ msj: error.message });
    if (error instanceof CountryNotFoundError) return res.status(404).json({ msj: error.message });
    if (error instanceof DuplicateCountryNameError) return res.status(400).json({ msj: error.message });
    return res.status(500).json({ msj: fallbackMsj, error: error.message });
  }

  getAll = async (req, res) => {
    try {
      const { search, isActive, page = 1, limit = 10 } = req.query;
      const result = await this.listCountriesUseCase.execute({ search, isActive, page, limit });

      res.status(200).json({
        msj: result.items.length === 0 ? 'lista de países vacia' : 'Países obtenidos correctamente',
        total: result.total,
        data: result.items.map(toCountryDTO),
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalRecords: result.total,
          limit: result.limit,
          hasNextPage: result.page < result.totalPages,
          hasPrevPage: result.page > 1,
        },
      });
    } catch (error) {
      this.#handleError(res, error, 'Error obteniendo países');
    }
  };

  getOne = async (req, res) => {
    try {
      const country = await this.getCountryByIdUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'País encontrado', data: toCountryDTO(country) });
    } catch (error) {
      this.#handleError(res, error, 'Error obteniendo país');
    }
  };

  create = async (req, res) => {
    try {
      const data = pickDefinedFields(req.body, FIELDS);
      const country = await this.createCountryUseCase.execute(data);
      res.status(201).json({ msj: 'País creado exitosamente', newCountry: toCountryDTO(country) });
    } catch (error) {
      this.#handleError(res, error, 'Error creando país');
    }
  };

  update = async (req, res) => {
    try {
      const changes = pickDefinedFields(req.body, FIELDS);
      const country = await this.updateCountryUseCase.execute(req.params.id, changes);
      res.status(200).json({ msj: 'País actualizado correctamente', country: toCountryDTO(country) });
    } catch (error) {
      this.#handleError(res, error, 'Error actualizando país');
    }
  };

  activate = async (req, res) => {
    try {
      const country = await this.activateCountryUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'País activado correctamente', country: toCountryDTO(country) });
    } catch (error) {
      this.#handleError(res, error, 'Error al activar el país');
    }
  };

  deactivate = async (req, res) => {
    try {
      const country = await this.deactivateCountryUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'País desactivado correctamente', country: toCountryDTO(country) });
    } catch (error) {
      this.#handleError(res, error, 'Error al desactivar el país');
    }
  };
}
