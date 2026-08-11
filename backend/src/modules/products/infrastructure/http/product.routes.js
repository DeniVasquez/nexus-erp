import { Router } from 'express';
import { authMiddleware } from '#shared/middleware/auth.middleware.js';
import { checkPermission } from '#shared/middleware/checkPermission.middleware.js';
import { logAction } from '#modules/logs/infrastructure/audit/logAction.middleware.js';
import { createEntityHistoryHandler } from '#modules/logs/infrastructure/audit/entityHistory.handler.js';
import { MongoSubCategoryRepository } from '#modules/sub-categories/infrastructure/persistence/MongoSubCategoryRepository.js';
import { MongoUnitRepository } from '#modules/units/infrastructure/persistence/MongoUnitRepository.js';

import { ProductModel } from '../persistence/productMongooseModel.js';
import { MongoProductRepository } from '../persistence/MongoProductRepository.js';
import { ListProductsUseCase } from '../../application/use-cases/listProducts.js';
import { GetProductByIdUseCase } from '../../application/use-cases/getProductById.js';
import { CreateProductUseCase } from '../../application/use-cases/createProduct.js';
import { UpdateProductUseCase } from '../../application/use-cases/updateProduct.js';
import { ActivateProductUseCase } from '../../application/use-cases/activateProduct.js';
import { DeactivateProductUseCase } from '../../application/use-cases/deactivateProduct.js';
import { ProductController } from './product.controller.js';

// --- Composition root ---
const productRepository = new MongoProductRepository();
const subCategoryRepository = new MongoSubCategoryRepository();
const unitRepository = new MongoUnitRepository();

const controller = new ProductController({
    listProducts: new ListProductsUseCase(productRepository),
    getProductById: new GetProductByIdUseCase(productRepository),
    createProduct: new CreateProductUseCase(productRepository, subCategoryRepository, unitRepository),
    updateProduct: new UpdateProductUseCase(productRepository, subCategoryRepository, unitRepository),
    activateProduct: new ActivateProductUseCase(productRepository),
    deactivateProduct: new DeactivateProductUseCase(productRepository),
});

const router = Router();

const PRODUCT_AUDIT_FIELDS = [
    'subCategory', 'category', 'unit', 'purchaseUnit', 'saleUnit', 'code', 'sku',
    'name', 'size', 'dimensions', 'description', 'presentation', 'isActive'
];

const productAudit = {
    entityModel: ProductModel,
    snapshot: { fields: PRODUCT_AUDIT_FIELDS, populate: ['subCategory', 'category', 'unit', 'purchaseUnit', 'saleUnit'] },
    compareFields: PRODUCT_AUDIT_FIELDS
};

// Productos, sin sección propia en el ERS v0.5 (llega solo hasta el
// capítulo 6.5). Construido a partir del diagrama de BD de Denis + las
// reglas generales RN-013 (código único) y RN-014 (no eliminar productos
// con movimientos históricos, satisfecha gratis por el patrón isActive sin
// borrado físico que ya usa toda la app). FK a `sub-categories` + FK
// `category` denormalizada (ERS v0.6): se recalcula sola en el caso de uso
// a partir de subCategory.category, el cliente no puede setearla directo,
// así nunca queda desincronizada. + 3 FKs independientes a `units` (base,
// compra, venta), todas editables (son atributos del producto, no
// relaciones de identidad). `uuid` se autogenera en el caso de uso, nunca
// lo manda el cliente.
const routes = [
    {
        method: 'GET',
        path: '/',
        permission: 'products.view',
        description: 'Listar productos',
        handler: controller.getAll,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/:id',
        permission: 'products.view',
        description: 'Obtener un producto',
        handler: controller.getOne,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/:id/history',
        permission: 'logs.read',
        description: 'Ver historial de cambios del producto',
        handler: createEntityHistoryHandler(ProductModel.modelName, 'id'),
        middlewares: []
    },
    {
        method: 'POST',
        path: '/',
        permission: 'products.create',
        description: 'Crear producto',
        handler: controller.create,
        middlewares: [logAction({ ...productAudit, action: 'create', resource: 'products', responseKey: 'newProduct' })]
    },
    {
        method: 'PUT',
        path: '/:id',
        permission: 'products.update',
        description: 'Actualizar producto',
        handler: controller.update,
        middlewares: [logAction({ ...productAudit, action: 'update', resource: 'products', responseKey: 'product' })]
    },
    {
        method: 'PATCH',
        path: '/:id/activate',
        permission: 'products.activate',
        description: 'Activar producto',
        handler: controller.activate,
        middlewares: [logAction({ ...productAudit, action: 'update', resource: 'products', responseKey: 'product' })]
    },
    {
        method: 'PATCH',
        path: '/:id/deactivate',
        permission: 'products.deactivate',
        description: 'Desactivar producto',
        handler: controller.deactivate,
        middlewares: [logAction({ ...productAudit, action: 'update', resource: 'products', responseKey: 'product' })]
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

export const productRoutes = routes;
export default router;
