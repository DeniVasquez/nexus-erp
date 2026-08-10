export class Unit {
  constructor({ id, name, type, isActive = true, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
