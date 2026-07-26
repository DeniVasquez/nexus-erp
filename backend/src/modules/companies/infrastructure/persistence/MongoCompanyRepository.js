import mongoose from 'mongoose';
import { CompanyRepository } from '../../domain/CompanyRepository.js';
import { Company } from '../../domain/Company.js';
import { InvalidCompanyIdError } from '../../domain/errors.js';
import { CompanyModel } from './companyMongooseModel.js';

const toDomain = (doc) =>
    doc
        ? new Company({
              id: doc._id.toString(),
              name: doc.name,
              legalName: doc.legalName,
              taxId: doc.taxId,
              email: doc.email,
              phone: doc.phone,
              address: doc.address,
              logo: doc.logo,
              owner: doc.owner,
              plan: doc.plan,
              isActive: doc.isActive,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
          })
        : null;

const assertValidId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidCompanyIdError();
    }
};

/**
 * Adaptador concreto del puerto CompanyRepository usando Mongoose. Es el único
 * archivo del módulo que conoce sintaxis de Mongo ($regex, $or, populate,
 * ObjectId). El dominio y los casos de uso no saben que esta clase existe.
 */
export class MongoCompanyRepository extends CompanyRepository {
    async findAll({ search, isActive, plan, page = 1, limit = 10 } = {}) {
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { legalName: { $regex: search, $options: 'i' } },
                { taxId: { $regex: search, $options: 'i' } },
            ];
        }

        if (isActive !== undefined && isActive !== '') {
            filter.isActive = isActive === true || isActive === 'true';
        }

        if (plan) filter.plan = plan;

        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            CompanyModel.find(filter)
                .select('-__v')
                .populate('owner', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            CompanyModel.countDocuments(filter),
        ]);

        return { items: docs.map(toDomain), total };
    }

    async findById(id) {
        assertValidId(id);
        const doc = await CompanyModel.findById(id).populate('owner', 'name email');
        return toDomain(doc);
    }

    async findByTaxId(taxId) {
        const doc = await CompanyModel.findOne({ taxId: taxId?.toUpperCase() });
        return toDomain(doc);
    }

    async create(company) {
        const doc = await CompanyModel.create({
            name: company.name,
            legalName: company.legalName,
            taxId: company.taxId,
            email: company.email,
            phone: company.phone,
            address: company.address,
            logo: company.logo,
            plan: company.plan,
            owner: company.owner,
        });
        return toDomain(doc);
    }

    async update(id, changes) {
        assertValidId(id);
        const doc = await CompanyModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true,
        }).populate('owner', 'name email');
        return toDomain(doc);
    }

    async remove(id) {
        assertValidId(id);
        const doc = await CompanyModel.findByIdAndDelete(id);
        return toDomain(doc);
    }
}
