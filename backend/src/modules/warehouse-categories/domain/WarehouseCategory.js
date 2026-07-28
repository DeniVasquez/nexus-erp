export class WarehouseCategory {
  constructor({ id, name, description, isActive = true, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
