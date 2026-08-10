export class Supplier {
  constructor({ id, country, name, address, phone, email, isActive = true, createdAt, updatedAt }) {
    this.id = id;
    this.country = country; // id de Country, o subdocumento poblado
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
