import mongoose from 'mongoose';
import { SupplierRepository } from '../../domain/SupplierRepository.js';
import { Supplier } from '../../domain/Supplier.js';
import { InvalidSupplierIdError } from '../../domain/errors.js';
import { SupplierModel } from './supplierMongooseModel.js';

const toDomain = (doc) =>
    doc
        ? new Supplier({
              id: doc._id.toString(),
              code: doc.code,
              country: doc.country,
              name: doc.name,
              address: doc.address,
              phone: doc.phone,
              email: doc.email,
              website: doc.website,
              isActive: doc.isActive,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
          })
        : null;

const assertValidId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidSupplierIdError();
    }
};

const POPULATE = { path: 'country', select: 'name' };

export class MongoSupplierRepository extends SupplierRepository {
    async findAll({ search, country, isActive, page = 1, limit = 10 } = {}) {
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        if (country) filter.country = country;

        if (isActive !== undefined && isActive !== '') {
            filter.isActive = isActive === true || isActive === 'true';
        }

        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            SupplierModel.find(filter).populate(POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
            SupplierModel.countDocuments(filter),
        ]);

        return { items: docs.map(toDomain), total };
    }

    async findById(id) {
        assertValidId(id);
        const doc = await SupplierModel.findById(id).populate(POPULATE);
        return toDomain(doc);
    }

    async findByCode(code) {
        const doc = await SupplierModel.findOne({ code });
        return toDomain(doc);
    }

    async create(supplier) {
        const doc = await SupplierModel.create({
            code: supplier.code,
            country: supplier.country,
            name: supplier.name,
            address: supplier.address,
            phone: supplier.phone,
            email: supplier.email,
            website: supplier.website,
        });
        const populated = await doc.populate(POPULATE);
        return toDomain(populated);
    }

    async update(id, changes) {
        assertValidId(id);
        const doc = await SupplierModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true,
        }).populate(POPULATE);
        return toDomain(doc);
    }
}
