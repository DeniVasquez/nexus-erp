import mongoose from 'mongoose';
import { LocationRepository } from '../../domain/LocationRepository.js';
import { Location } from '../../domain/Location.js';
import { InvalidLocationIdError } from '../../domain/errors.js';
import { LocationModel } from './locationMongooseModel.js';

const toDomain = (doc) =>
    doc
        ? new Location({
              id: doc._id.toString(),
              warehouse: doc.warehouse,
              code: doc.code,
              aisle: doc.aisle,
              rack: doc.rack,
              level: doc.level,
              position: doc.position,
              capacity: doc.capacity,
              notes: doc.notes,
              isActive: doc.isActive,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
          })
        : null;

const assertValidId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidLocationIdError();
    }
};

const POPULATE = { path: 'warehouse', select: 'name branch' };

export class MongoLocationRepository extends LocationRepository {
    async findAll({ search, warehouse, isActive, page = 1, limit = 10 } = {}) {
        const filter = {};

        if (search) {
            filter.code = { $regex: search, $options: 'i' };
        }

        if (warehouse) filter.warehouse = warehouse;

        if (isActive !== undefined && isActive !== '') {
            filter.isActive = isActive === true || isActive === 'true';
        }

        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            LocationModel.find(filter).populate(POPULATE).sort({ code: 1 }).skip(skip).limit(limit),
            LocationModel.countDocuments(filter),
        ]);

        return { items: docs.map(toDomain), total };
    }

    async findById(id) {
        assertValidId(id);
        const doc = await LocationModel.findById(id).populate(POPULATE);
        return toDomain(doc);
    }

    async findByCodeAndWarehouse(code, warehouseId) {
        const doc = await LocationModel.findOne({ code, warehouse: warehouseId });
        return toDomain(doc);
    }

    async findByCoordinatesAndWarehouse({ aisle, rack, level, position }, warehouseId) {
        const doc = await LocationModel.findOne({ warehouse: warehouseId, aisle, rack, level, position });
        return toDomain(doc);
    }

    async create(location) {
        const doc = await LocationModel.create({
            warehouse: location.warehouse,
            code: location.code,
            aisle: location.aisle,
            rack: location.rack,
            level: location.level,
            position: location.position,
            capacity: location.capacity,
            notes: location.notes,
        });
        const populated = await doc.populate(POPULATE);
        return toDomain(populated);
    }

    async update(id, changes) {
        assertValidId(id);
        const doc = await LocationModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true,
        }).populate(POPULATE);
        return toDomain(doc);
    }
}
