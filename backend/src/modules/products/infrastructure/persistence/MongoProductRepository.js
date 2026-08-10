import mongoose from 'mongoose';
import { ProductRepository } from '../../domain/ProductRepository.js';
import { Product } from '../../domain/Product.js';
import { InvalidProductIdError } from '../../domain/errors.js';
import { ProductModel } from './productMongooseModel.js';

const toDomain = (doc) =>
    doc
        ? new Product({
              id: doc._id.toString(),
              subCategory: doc.subCategory,
              unit: doc.unit,
              purchaseUnit: doc.purchaseUnit,
              saleUnit: doc.saleUnit,
              uuid: doc.uuid,
              code: doc.code,
              sku: doc.sku,
              name: doc.name,
              size: doc.size,
              dimensions: doc.dimensions,
              description: doc.description,
              presentation: doc.presentation,
              isActive: doc.isActive,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
          })
        : null;

const assertValidId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidProductIdError();
    }
};

const POPULATE = [
    { path: 'subCategory', select: 'name category' },
    { path: 'unit', select: 'name type' },
    { path: 'purchaseUnit', select: 'name type' },
    { path: 'saleUnit', select: 'name type' },
];

export class MongoProductRepository extends ProductRepository {
    async findAll({ search, subCategory, isActive, page = 1, limit = 10 } = {}) {
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
            ];
        }

        if (subCategory) filter.subCategory = subCategory;

        if (isActive !== undefined && isActive !== '') {
            filter.isActive = isActive === true || isActive === 'true';
        }

        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            ProductModel.find(filter).populate(POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(filter),
        ]);

        return { items: docs.map(toDomain), total };
    }

    async findById(id) {
        assertValidId(id);
        const doc = await ProductModel.findById(id).populate(POPULATE);
        return toDomain(doc);
    }

    async findByCode(code) {
        const doc = await ProductModel.findOne({ code });
        return toDomain(doc);
    }

    async create(product) {
        const doc = await ProductModel.create({
            subCategory: product.subCategory,
            unit: product.unit,
            purchaseUnit: product.purchaseUnit,
            saleUnit: product.saleUnit,
            uuid: product.uuid,
            code: product.code,
            sku: product.sku,
            name: product.name,
            size: product.size,
            dimensions: product.dimensions,
            description: product.description,
            presentation: product.presentation,
        });
        const populated = await doc.populate(POPULATE);
        return toDomain(populated);
    }

    async update(id, changes) {
        assertValidId(id);
        const doc = await ProductModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true,
        }).populate(POPULATE);
        return toDomain(doc);
    }
}
