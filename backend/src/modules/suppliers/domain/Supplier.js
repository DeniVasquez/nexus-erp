export class Supplier {
  constructor({ id, code, country, name, address, phone, email, website, isActive = true, createdAt, updatedAt }) {
    this.id = id;
    this.code = code;
    this.country = country; // id de Country, o subdocumento poblado
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
