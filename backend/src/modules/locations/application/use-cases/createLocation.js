import { Location } from '../../domain/Location.js';
import {
  WarehouseNotFoundForLocationError,
  DuplicateLocationCodeError,
  InvalidCapacityError,
  DuplicateLocationCoordinatesError,
} from '../../domain/errors.js';

export class CreateLocationUseCase {
  constructor(locationRepository, warehouseRepository) {
    this.locationRepository = locationRepository;
    this.warehouseRepository = warehouseRepository;
  }

  async execute(data) {
    // RN-WHS-005: toda ubicación debe pertenecer a un único almacén (la FK ya lo garantiza).
    const warehouse = await this.warehouseRepository.findById(data.warehouse);
    if (!warehouse) throw new WarehouseNotFoundForLocationError();

    // RN-WHS-006: código único dentro del almacén.
    const codeTaken = await this.locationRepository.findByCodeAndWarehouse(data.code, data.warehouse);
    if (codeTaken) throw new DuplicateLocationCodeError();

    // RN-WHS-008: la capacidad debe ser mayor que cero.
    if (!(Number(data.capacity) > 0)) throw new InvalidCapacityError();

    // RN-WHS-009: no puede repetirse pasillo-estante-nivel-posición dentro del mismo almacén.
    const coordinates = { aisle: data.aisle || '', rack: data.rack || '', level: data.level || '', position: data.position || '' };
    const coordinatesTaken = await this.locationRepository.findByCoordinatesAndWarehouse(coordinates, data.warehouse);
    if (coordinatesTaken) throw new DuplicateLocationCoordinatesError();

    const location = new Location({ ...data, ...coordinates });
    return this.locationRepository.create(location);
  }
}
