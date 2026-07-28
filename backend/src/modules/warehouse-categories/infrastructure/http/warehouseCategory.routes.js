import { Router } from 'express';
import { authMiddleware } from '#shared/middleware/auth.middleware.js';
import { checkPermission } from '#shared/middleware/checkPermission.middleware.js';
import { logAction } from '#modules/logs/infrastructure/audit/logAction.middleware.js';
import { createEntityHistoryHandler } from '#modules/logs/infrastructure/audit/entityHistory.handler.js';

import { WarehouseCategoryModel } from '../persistence/warehouseCategoryMongooseModel.js';
import { MongoWarehouseCategoryRepository } from '../persistence/MongoWarehouseCategoryRepository.js';
import { ListWarehouseCategoriesUseCase } from '../../application/use-cases/listWarehouseCategories.js';
import { GetWarehouseCategoryByIdUseCase } from '../../application/use-cases/getWarehouseCategoryById.js';
import { CreateWarehouseCategoryUseCase } from '../../application/use-cases/createWarehouseCategory.js';
import { UpdateWarehouseCategoryUseCase } from '../../application/use-cases/updateWarehouseCategory.js';
import { DeactivateWarehouseCategoryUseCase } from '../../application/use-cases/deactivateWarehouseCategory.js';
import { WarehouseCategoryController } from './warehouseCategory.controller.js';

// --- Composition root ---
const warehouseCategoryRepository = new MongoWarehouseCategoryRepository();

const controller = new WarehouseCategoryController({
    listWarehouseCategories: new ListWarehouseCategoriesUseCase(warehouseCategoryRepository),
    getWarehouseCategoryById: new GetWarehouseCategoryByIdUseCase(warehouseCategoryRepository),
    createWarehouseCategory: new CreateWarehouseCategoryUseCase(warehouseCategoryRepository),
    updateWarehouseCategory: new UpdateWarehouseCategoryUseCase(warehouseCategoryRepository),
    deactivateWarehouseCategory: new DeactivateWarehouseCategoryUseCase(warehouseCategoryRepository),
});

const router = Router();

const categoryAudit = {
    entityModel: WarehouseCategoryModel,
    snapshot: { fields: ['name', 'description', 'isActive'] },
    compareFields: ['name', 'description', 'isActive']
};

// rutas con metadata. Nota: el ERS (6.5.7) solo define
// warehouse_categories.view/create/update/deactivate — NO existe
// warehouse_categories.activate (ni la operación "Activar" en 6.5.5), así
// que a diferencia de companies/branches, aquí no hay endpoint de activar.
const routes = [
    {
        method: 'GET',
        path: '/',
        permission: 'warehouse_categories.view',
        description: 'Listar categorías de almacén',
        handler: controller.getAll,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/:id',
        permission: 'warehouse_categories.view',
        description: 'Obtener una categoría de almacén',
        handler: controller.getOne,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/:id/history',
        permission: 'logs.read',
        description: 'Ver historial de cambios de la categoría',
        handler: createEntityHistoryHandler(WarehouseCategoryModel.modelName, 'id'),
        middlewares: []
    },
    {
        method: 'POST',
        path: '/',
        permission: 'warehouse_categories.create',
        description: 'Crear categoría de almacén',
        handler: controller.create,
        middlewares: [logAction({ ...categoryAudit, action: 'create', resource: 'warehouse_categories', responseKey: 'newWarehouseCategory' })]
    },
    {
        method: 'PUT',
        path: '/:id',
        permission: 'warehouse_categories.update',
        description: 'Actualizar categoría de almacén',
        handler: controller.update,
        middlewares: [logAction({ ...categoryAudit, action: 'update', resource: 'warehouse_categories', responseKey: 'warehouseCategory' })]
    },
    {
        method: 'PATCH',
        path: '/:id/deactivate',
        permission: 'warehouse_categories.deactivate',
        description: 'Desactivar categoría de almacén',
        handler: controller.deactivate,
        middlewares: [logAction({ ...categoryAudit, action: 'update', resource: 'warehouse_categories', responseKey: 'warehouseCategory' })]
    }
];

routes.forEach(route => {
    const allMiddlewares = [
        authMiddleware,
        checkPermission(route.permission),
        ...route.middlewares
    ];

    router[route.method.toLowerCase()](
        route.path,
        ...allMiddlewares,
        route.handler
    );
});

export const warehouseCategoryRoutes = routes;
export default router;
