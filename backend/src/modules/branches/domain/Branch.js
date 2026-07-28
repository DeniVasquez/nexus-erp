export class Branch {
  constructor({
    id,
    company,
    name,
    address,
    department,
    municipality,
    district,
    phone,
    email,
    isActive = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.company = company; // id de Company, o subdocumento poblado
    this.name = name;
    this.address = address;
    this.department = department; // id de Department, o subdocumento poblado
    this.municipality = municipality;
    this.district = district;
    this.phone = phone;
    this.email = email;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
