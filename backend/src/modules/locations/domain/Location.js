export class Location {
  constructor({
    id,
    warehouse,
    code,
    aisle = '',
    rack = '',
    level = '',
    position = '',
    capacity,
    notes,
    isActive = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.warehouse = warehouse; // id de Warehouse, o subdocumento poblado
    this.code = code;
    this.aisle = aisle;
    this.rack = rack;
    this.level = level;
    this.position = position;
    this.capacity = capacity;
    this.notes = notes;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
