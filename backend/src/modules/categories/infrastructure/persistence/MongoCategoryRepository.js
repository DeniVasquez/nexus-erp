import mongoose from 'mongoose';
import { CategoryRepository } from '../../domain/CategoryRepository.js';
import { Category } from '../../domain/Category.js';
import { InvalidCategoryIdError } from '../../domain/errors.js';
import { CategoryModel } from './categoryMongooseModel.js';

const toDomain = (doc) =>
    doc
        ? new Category({
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
        throw new InvalidCategoryIdError();
    }
};

export class MongoCategoryRepository extends CategoryRepository {
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
            CategoryModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
            CategoryModel.countDocuments(filter),
        ]);

        return { items: docs.map(toDomain), total };
    }

    async findById(id) {
        assertValidId(id);
        const doc = await CategoryModel.findById(id);
        return toDomain(doc);
    }

    async findByName(name) {
        const doc = await CategoryModel.findOne({ name });
        return toDomain(doc);
    }

    async create(category) {
        const doc = await CategoryModel.create({
            name: category.name,
            description: category.description,
        });
        return toDomain(doc);
    }

    async update(id, changes) {
        assertValidId(id);
        const doc = await CategoryModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true,
        });
        return toDomain(doc);
    }
}
