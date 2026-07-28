import { LogRepository } from '../../domain/LogRepository.js';
import { LogEntry } from '../../domain/LogEntry.js';
import { LogModel } from './logMongooseModel.js';

const toDomain = (doc) =>
    doc
        ? new LogEntry({
              id: doc._id.toString(),
              user: doc.user,
              action: doc.action,
              resource: doc.resource,
              entityId: doc.entityId,
              entityModel: doc.entityModel,
              entityName: doc.entityName,
              dataBefore: doc.dataBefore,
              dataAfter: doc.dataAfter,
              changedFields: doc.changedFields,
              details: doc.details,
              ipAddress: doc.ipAddress,
              userAgent: doc.userAgent,
              statusCode: doc.statusCode,
              createdAt: doc.createdAt,
          })
        : null;

const buildFilter = ({ user, action, resource, startDate, endDate }) => {
    const filter = {};
    if (user) filter.user = user;
    if (action) filter.action = action;
    if (resource) filter.resource = resource;

    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
            const start = new Date(startDate);
            if (!isNaN(start.getTime())) filter.createdAt.$gte = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            if (!isNaN(end.getTime())) filter.createdAt.$lte = end;
        }
    }

    return filter;
};

/**
 * Adaptador concreto del puerto LogRepository usando Mongoose. Único archivo
 * del módulo que conoce sintaxis de Mongo (populate, refPath, ObjectId).
 */
export class MongoLogRepository extends LogRepository {
    async findAll({ user, action, resource, startDate, endDate, skip = 0, limit = 10 } = {}) {
        const filter = buildFilter({ user, action, resource, startDate, endDate });

        const [docs, total] = await Promise.all([
            LogModel.find(filter)
                .select('-__v')
                .populate('user', 'name email')
                .populate('entityId', '-password -__v')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            LogModel.countDocuments(filter),
        ]);

        return { items: docs.map(toDomain), total };
    }

    async findByEntity({ entityId, entityModel, actions = ['create', 'update', 'delete'] }) {
        const docs = await LogModel.find({
            entityId,
            entityModel,
            action: { $in: actions },
        })
            .populate('user', 'name email')
            .populate('entityId', '-password -__v')
            .sort({ createdAt: -1 })
            .select('-__v');

        return docs.map(toDomain);
    }

    async create(logEntry) {
        const doc = await LogModel.create({
            user: logEntry.user,
            action: logEntry.action,
            resource: logEntry.resource,
            entityId: logEntry.entityId,
            entityModel: logEntry.entityModel,
            entityName: logEntry.entityName,
            dataBefore: logEntry.dataBefore,
            dataAfter: logEntry.dataAfter,
            changedFields: logEntry.changedFields,
            details: logEntry.details,
            ipAddress: logEntry.ipAddress,
            userAgent: logEntry.userAgent,
            statusCode: logEntry.statusCode,
        });
        return toDomain(doc);
    }
}
