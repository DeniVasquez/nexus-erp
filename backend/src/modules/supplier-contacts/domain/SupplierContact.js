export class SupplierContact {
  constructor({ id, supplier, fullName, phone, email, isActive = true, createdAt, updatedAt }) {
    this.id = id;
    this.supplier = supplier; // id de Supplier, o subdocumento poblado
    this.fullName = fullName;
    this.phone = phone;
    this.email = email;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
