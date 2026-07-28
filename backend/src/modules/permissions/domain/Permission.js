export class Permission {
  constructor({ id, code, resource, action, description, isActive = true, createdAt, updatedAt }) {
    this.id = id;
    this.code = code?.toLowerCase();
    this.resource = resource;
    this.action = action;
    this.description = description;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
