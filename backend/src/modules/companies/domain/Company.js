export class Company {
  constructor({
    id,
    name,
    legalName,
    taxId,
    email,
    phone,
    address,
    logo,
    owner,
    plan = 'free',
    isActive = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.legalName = legalName;
    this.taxId = taxId?.toUpperCase();
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.logo = logo ?? null;
    this.owner = owner;
    this.plan = plan;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toggleStatus() {
    this.isActive = !this.isActive;
    return this.isActive;
  }
}
