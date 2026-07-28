export class Warehouse {
  constructor({ id, branch, warehouseCategory, name, description, isActive = true, createdAt, updatedAt }) {
    this.id = id;
    this.branch = branch; // id de Branch, o subdocumento poblado
    this.warehouseCategory = warehouseCategory; // id de WarehouseCategory, o subdocumento poblado
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
