export class LocationRepository {
  async findAll(_criteria) {
    throw new Error('LocationRepository.findAll no implementado');
  }

  async findById(_id) {
    throw new Error('LocationRepository.findById no implementado');
  }

  async findByCodeAndWarehouse(_code, _warehouseId) {
    throw new Error('LocationRepository.findByCodeAndWarehouse no implementado');
  }

  async findByCoordinatesAndWarehouse(_coordinates, _warehouseId) {
    throw new Error('LocationRepository.findByCoordinatesAndWarehouse no implementado');
  }

  async findCoordinatesAndCodesByWarehouse(_warehouseId) {
    throw new Error('LocationRepository.findCoordinatesAndCodesByWarehouse no implementado');
  }

  async create(_location) {
    throw new Error('LocationRepository.create no implementado');
  }

  async createMany(_locations) {
    throw new Error('LocationRepository.createMany no implementado');
  }

  async update(_id, _changes) {
    throw new Error('LocationRepository.update no implementado');
  }
}
