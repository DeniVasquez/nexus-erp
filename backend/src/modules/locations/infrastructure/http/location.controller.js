import {
  InvalidLocationIdError,
  LocationNotFoundError,
  WarehouseNotFoundForLocationError,
  DuplicateLocationCodeError,
  InvalidCapacityError,
  DuplicateLocationCoordinatesError,
} from '../../domain/errors.js';

const toLocationDTO = (location) => ({
  _id: location.id,
  id: location.id,
  warehouse: location.warehouse,
  code: location.code,
  aisle: location.aisle,
  rack: location.rack,
  level: location.level,
  position: location.position,
  capacity: location.capacity,
  notes: location.notes,
  isActive: location.isActive,
  createdAt: location.createdAt,
  updatedAt: location.updatedAt,
});

const pickDefinedFields = (body, keys) =>
  keys.reduce((changes, key) => {
    if (body[key] !== undefined && body[key] !== '') changes[key] = body[key];
    return changes;
  }, {});

const CREATE_FIELDS = ['warehouse', 'code', 'aisle', 'rack', 'level', 'position', 'capacity', 'notes'];
// `warehouse` no es editable después de creada la ubicación (misma regla que company/branch en los módulos anteriores).
const UPDATE_FIELDS = ['code', 'aisle', 'rack', 'level', 'position', 'capacity', 'notes'];

export class LocationController {
  constructor({ listLocations, getLocationById, createLocation, updateLocation, activateLocation, deactivateLocation }) {
    this.listLocationsUseCase = listLocations;
    this.getLocationByIdUseCase = getLocationById;
    this.createLocationUseCase = createLocation;
    this.updateLocationUseCase = updateLocation;
    this.activateLocationUseCase = activateLocation;
    this.deactivateLocationUseCase = deactivateLocation;
  }

  #handleError(res, error, fallbackMsj) {
    if (error instanceof InvalidLocationIdError) return res.status(400).json({ msj: error.message });
    if (error instanceof LocationNotFoundError) return res.status(404).json({ msj: error.message });
    if (error instanceof WarehouseNotFoundForLocationError) return res.status(400).json({ msj: error.message });
    if (error instanceof DuplicateLocationCodeError) return res.status(400).json({ msj: error.message });
    if (error instanceof InvalidCapacityError) return res.status(400).json({ msj: error.message });
    if (error instanceof DuplicateLocationCoordinatesError) return res.status(400).json({ msj: error.message });
    return res.status(500).json({ msj: fallbackMsj, error: error.message });
  }

  getAll = async (req, res) => {
    try {
      const { search, warehouse, isActive, page = 1, limit = 10 } = req.query;
      const result = await this.listLocationsUseCase.execute({ search, warehouse, isActive, page, limit });

      res.status(200).json({
        msj: result.items.length === 0 ? 'lista de ubicaciones vacia' : 'Ubicaciones obtenidas correctamente',
        total: result.total,
        data: result.items.map(toLocationDTO),
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
      this.#handleError(res, error, 'Error obteniendo ubicaciones');
    }
  };

  getOne = async (req, res) => {
    try {
      const location = await this.getLocationByIdUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'Ubicación encontrada', data: toLocationDTO(location) });
    } catch (error) {
      this.#handleError(res, error, 'Error obteniendo ubicación');
    }
  };

  create = async (req, res) => {
    try {
      const data = pickDefinedFields(req.body, CREATE_FIELDS);
      const location = await this.createLocationUseCase.execute(data);
      res.status(201).json({ msj: 'Ubicación creada exitosamente', newLocation: toLocationDTO(location) });
    } catch (error) {
      this.#handleError(res, error, 'Error creando ubicación');
    }
  };

  update = async (req, res) => {
    try {
      const changes = pickDefinedFields(req.body, UPDATE_FIELDS);
      const location = await this.updateLocationUseCase.execute(req.params.id, changes);
      res.status(200).json({ msj: 'Ubicación actualizada correctamente', location: toLocationDTO(location) });
    } catch (error) {
      this.#handleError(res, error, 'Error actualizando ubicación');
    }
  };

  activate = async (req, res) => {
    try {
      const location = await this.activateLocationUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'Ubicación activada correctamente', location: toLocationDTO(location) });
    } catch (error) {
      this.#handleError(res, error, 'Error al activar la ubicación');
    }
  };

  deactivate = async (req, res) => {
    try {
      const location = await this.deactivateLocationUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'Ubicación desactivada correctamente', location: toLocationDTO(location) });
    } catch (error) {
      this.#handleError(res, error, 'Error al desactivar la ubicación');
    }
  };
}
