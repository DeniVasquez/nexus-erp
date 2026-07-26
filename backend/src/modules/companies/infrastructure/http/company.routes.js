import { Router } from 'express';
import { authMiddleware } from '../../../../middleware/auth.middleware.js';
import { checkPermission } from '../../../../middleware/role.middleware.js';
import { logAction } from '../../../../middleware/logger.middleware.js';
import { createEntityHistoryHandler } from '../../../../controllers/logs.controller.js';

import { CompanyModel } from '../persistence/companyMongooseModel.js';
import { MongoCompanyRepository } from '../persistence/MongoCompanyRepository.js';
import { ListCompaniesUseCase } from '../../application/use-cases/listCompanies.js';
import { GetCompanyByIdUseCase } from '../../application/use-cases/getCompanyById.js';
import { CreateCompanyUseCase } from '../../application/use-cases/createCompany.js';
import { UpdateCompanyUseCase } from '../../application/use-cases/updateCompany.js';
import { ToggleCompanyStatusUseCase } from '../../application/use-cases/toggleCompanyStatus.js';
import { DeleteCompanyUseCase } from '../../application/use-cases/deleteCompany.js';
import { CompanyController } from './company.controller.js';

// --- Composition root: aquí, y solo aquí, se conectan las piezas concretas ---
// (Mongo) con las abstractas (casos de uso, controller). Nada fuera de este
// archivo sabe que el repositorio real es MongoCompanyRepository.
const companyRepository = new MongoCompanyRepository();

const controller = new CompanyController({
    listCompanies: new ListCompaniesUseCase(companyRepository),
    getCompanyById: new GetCompanyByIdUseCase(companyRepository),
    createCompany: new CreateCompanyUseCase(companyRepository),
    updateCompany: new UpdateCompanyUseCase(companyRepository),
    toggleCompanyStatus: new ToggleCompanyStatusUseCase(companyRepository),
    deleteCompany: new DeleteCompanyUseCase(companyRepository),
});

const router = Router();

// Config de auditoría compartida por las rutas de empresas
const companyAudit = {
    entityModel: CompanyModel,
    snapshot: {
        fields: ['name', 'legalName', 'taxId', 'email', 'phone', 'plan', 'isActive']
    },
    compareFields: ['name', 'legalName', 'taxId', 'email', 'phone', 'plan', 'isActive']
};

// rutas con metadata
const routes = [
    {
        method: 'GET',
        path: '/',
        permission: 'companies.read',
        description: 'Listar empresas',
        handler: controller.getAll,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/:id',
        permission: 'companies.read',
        description: 'Obtener una empresa',
        handler: controller.getOne,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/:id/history',
        permission: 'logs.read',
        description: 'Ver historial de cambios de la empresa',
        handler: createEntityHistoryHandler(CompanyModel.modelName, 'id'),
        middlewares: []
    },
    {
        method: 'POST',
        path: '/',
        permission: 'companies.create',
        description: 'Crear nueva empresa',
        handler: controller.create,
        middlewares: [logAction({ ...companyAudit, action: 'create', resource: 'companies', responseKey: 'newCompany' })]
    },
    {
        method: 'PUT',
        path: '/:id',
        permission: 'companies.update',
        description: 'Actualizar empresa',
        handler: controller.update,
        middlewares: [logAction({ ...companyAudit, action: 'update', resource: 'companies', responseKey: 'company' })]
    },
    {
        method: 'PATCH',
        path: '/:id/toggle-status',
        permission: 'companies.update',
        description: 'Activar/Desactivar empresa',
        handler: controller.toggleStatus,
        middlewares: [logAction({ ...companyAudit, action: 'update', resource: 'companies', responseKey: 'company' })]
    },
    {
        method: 'DELETE',
        path: '/:id',
        permission: 'companies.delete',
        description: 'Eliminar empresa',
        handler: controller.delete,
        middlewares: [logAction({ ...companyAudit, action: 'delete', resource: 'companies', responseKey: 'company' })]
    }
];

// registrar rutas automáticamente
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

// exportar metadata para auto-discovery
export const companyRoutes = routes;

// exportar router para usar en server.js
export default router;
