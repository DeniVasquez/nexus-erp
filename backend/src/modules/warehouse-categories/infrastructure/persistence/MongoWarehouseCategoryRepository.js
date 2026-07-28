import mongoose from 'mongoose';
import { WarehouseCategoryRepository } from '../../domain/WarehouseCategoryRepository.js';
import { WarehouseCategory } from '../../domain/WarehouseCategory.js';
import { InvalidWarehouseCategoryIdError } from '../../domain/errors.js';
import { WarehouseCategoryModel } from './warehouseCategoryMongooseModel.js';

const toDomain = (doc) =>
    doc
        ? new WarehouseCategory({
              id: doc._id.toString(),
              name: doc.name,
              description: doc.description,
              isActive: doc.isActive,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
          })
        : null;

const assertValidId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidWarehouseCategoryIdError();
    }
};

export class MongoWarehouseCategoryRepository extends WarehouseCategoryRepository {
    async findAll({ search, isActive, page = 1, limit = 10 } = {}) {
        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (isActive !== undefined && isActive !== '') {
            filter.isActive = isActive === true || isActive === 'true';
        }

        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            WarehouseCategoryModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
            WarehouseCategoryModel.countDocuments(filter),
        ]);

        return { items: docs.map(toDomain), total };
    }

    async findById(id) {
        assertValidId(id);
        const doc = await WarehouseCategoryModel.findById(id);
        return toDomain(doc);
    }

    async findByName(name) {
        const doc = await WarehouseCategoryModel.findOne({ name });
        return toDomain(doc);
    }

    async create(category) {
        const doc = await WarehouseCategoryModel.create({
            name: category.name,
            description: category.description,
        });
        return toDomain(doc);
    }

    async update(id, changes) {
        assertValidId(id);
        const doc = await WarehouseCategoryModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true,
        });
        return toDomain(doc);
    }
}
