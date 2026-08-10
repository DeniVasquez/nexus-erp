export class SubCategory {
  constructor({ id, category, name, description, isActive = true, createdAt, updatedAt }) {
    this.id = id;
    this.category = category; // id de Category, o subdocumento poblado
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
