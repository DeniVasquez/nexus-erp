export class Country {
  constructor({ id, name, isActive = true, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
