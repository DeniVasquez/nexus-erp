import mongoose from 'mongoose';
import { RoleRepository } from '../../domain/RoleRepository.js';
import { Role } from '../../domain/Role.js';
import { InvalidRoleIdError } from '../../domain/errors.js';
import { RoleModel } from './roleMongooseModel.js';

const toDomain = (doc) =>
    doc
        ? new Role({
              id: doc._id.toString(),
              name: doc.name,
              displayName: doc.displayName,
              description: doc.description,
              permissions: doc.permissions,
              isSystem: doc.isSystem,
              isActive: doc.isActive,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
          })
        : null;

const assertValidId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidRoleIdError();
    }
};

/**
 * Adaptador concreto del puerto RoleRepository usando Mongoose. Único archivo
 * del módulo que conoce sintaxis de Mongo (ObjectId, sort, etc.).
 */
export class MongoRoleRepository extends RoleRepository {
    async findAll({ page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            RoleModel.find()
                .select('-__v')
                .sort({ isSystem: -1, name: 1 })
                .skip(skip)
                .limit(limit),
            RoleModel.countDocuments(),
        ]);

        return { items: docs.map(toDomain), total };
    }

    async findById(id) {
        assertValidId(id);
        const doc = await RoleModel.findById(id);
        return toDomain(doc);
    }

    async findByName(name) {
        const doc = await RoleModel.findOne({ name });
        return toDomain(doc);
    }

    async findByIdOrName(value) {
        if (mongoose.Types.ObjectId.isValid(value)) {
            const doc = await RoleModel.findById(value);
            if (doc) return toDomain(doc);
        }

        const doc = await RoleModel.findOne({ name: value?.toLowerCase() || 'user' });
        return toDomain(doc);
    }

    async create(role) {
        const doc = await RoleModel.create({
            name: role.name,
            displayName: role.displayName,
            description: role.description,
            permissions: role.permissions,
            isSystem: role.isSystem,
        });
        return toDomain(doc);
    }

    async update(id, changes) {
        assertValidId(id);
        const doc = await RoleModel.findByIdAndUpdate(id, changes, {
            new: true,
            runValidators: true,
        });
        return toDomain(doc);
    }

    async remove(id) {
        assertValidId(id);
        const doc = await RoleModel.findByIdAndDelete(id);
        return toDomain(doc);
    }
}
