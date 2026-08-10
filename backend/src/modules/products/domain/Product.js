export class Product {
  constructor({
    id,
    subCategory,
    unit,
    purchaseUnit,
    saleUnit,
    uuid,
    code,
    sku,
    name,
    size,
    dimensions,
    description,
    presentation,
    isActive = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.subCategory = subCategory; // id de SubCategory, o subdocumento poblado
    this.unit = unit; // id de Unit (unidad base/stock), o subdocumento poblado
    this.purchaseUnit = purchaseUnit; // id de Unit (unidad de compra), o subdocumento poblado
    this.saleUnit = saleUnit; // id de Unit (unidad de venta), o subdocumento poblado
    this.uuid = uuid;
    this.code = code;
    this.sku = sku;
    this.name = name;
    this.size = size;
    this.dimensions = dimensions;
    this.description = description;
    this.presentation = presentation;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
