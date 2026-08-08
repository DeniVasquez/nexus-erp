import mongoose from 'mongoose';
import { CountryRepository } from '../../domain/CountryRepository.js';
import { Country } from '../../domain/Country.js';
import { InvalidCountryIdError } from '../../domain/errors.js';
import { CountryModel } from './countryMongooseModel.js';

const toDomain = (doc) =>
    doc
        ? new Country({
              id: doc._id.toString(),
              name: doc.name,
              isActive: doc.isActive,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
          })
        : null;

const assertValidId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidCountryIdError();
    }
};

export class MongoCountryRepository extends CountryRepository {
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
            CountryModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
            CountryModel.countDocuments(filter),
        ]);

        return { items: docs.map(toDomain), total };
    }

    async findById(id) {
        assertValidId(id);
        const doc = await CountryModel.findById(id);
        return toDomain(doc);
    }

    async findByName(name) {
        const doc = await CountryModel.findOne({ name });
        return toDomain(doc);
    }

    async create(country) {
        const doc = await CountryModel.create({
            name: country.name,
        });
        return toDomain(doc);
    }

    async update(id, changes) {
        assertValidId(id);
        const doc = await CountryModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true,
        });
        return toDomain(doc);
    }
}
