import { Router } from 'express';
import { authMiddleware } from '#shared/middleware/auth.middleware.js';
import { checkPermission } from '#shared/middleware/checkPermission.middleware.js';
import { logAction } from '#modules/logs/infrastructure/audit/logAction.middleware.js';
import { createEntityHistoryHandler } from '#modules/logs/infrastructure/audit/entityHistory.handler.js';

import { CountryModel } from '../persistence/countryMongooseModel.js';
import { MongoCountryRepository } from '../persistence/MongoCountryRepository.js';
import { ListCountriesUseCase } from '../../application/use-cases/listCountries.js';
import { GetCountryByIdUseCase } from '../../application/use-cases/getCountryById.js';
import { CreateCountryUseCase } from '../../application/use-cases/createCountry.js';
import { UpdateCountryUseCase } from '../../application/use-cases/updateCountry.js';
import { ActivateCountryUseCase } from '../../application/use-cases/activateCountry.js';
import { DeactivateCountryUseCase } from '../../application/use-cases/deactivateCountry.js';
import { CountryController } from './country.controller.js';

// --- Composition root ---
const countryRepository = new MongoCountryRepository();

const controller = new CountryController({
    listCountries: new ListCountriesUseCase(countryRepository),
    getCountryById: new GetCountryByIdUseCase(countryRepository),
    createCountry: new CreateCountryUseCase(countryRepository),
    updateCountry: new UpdateCountryUseCase(countryRepository),
    activateCountry: new ActivateCountryUseCase(countryRepository),
    deactivateCountry: new DeactivateCountryUseCase(countryRepository),
});

const router = Router();

const countryAudit = {
    entityModel: CountryModel,
    snapshot: { fields: ['name', 'isActive'] },
    compareFields: ['name', 'isActive']
};

// Catálogo nuevo, sin sección propia en el ERS (v0.5 solo llega hasta el
// capítulo 6.5). Creado a partir del diagrama de BD de Denis para resolver
// suppliers.country. Se sigue el patrón completo de companies/branches
// (view/create/update/activate/deactivate), no el recortado de
// warehouse_categories, porque acá no hay ninguna fuente que indique que
// "activar" deba faltar.
const routes = [
    {
        method: 'GET',
        path: '/',
        permission: 'countries.view',
        description: 'Listar países',
        handler: controller.getAll,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/:id',
        permission: 'countries.view',
        description: 'Obtener un país',
        handler: controller.getOne,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/:id/history',
        permission: 'logs.read',
        description: 'Ver historial de cambios del país',
        handler: createEntityHistoryHandler(CountryModel.modelName, 'id'),
        middlewares: []
    },
    {
        method: 'POST',
        path: '/',
        permission: 'countries.create',
        description: 'Crear país',
        handler: controller.create,
        middlewares: [logAction({ ...countryAudit, action: 'create', resource: 'countries', responseKey: 'newCountry' })]
    },
    {
        method: 'PUT',
        path: '/:id',
        permission: 'countries.update',
        description: 'Actualizar país',
        handler: controller.update,
        middlewares: [logAction({ ...countryAudit, action: 'update', resource: 'countries', responseKey: 'country' })]
    },
    {
        method: 'PATCH',
        path: '/:id/activate',
        permission: 'countries.activate',
        description: 'Activar país',
        handler: controller.activate,
        middlewares: [logAction({ ...countryAudit, action: 'update', resource: 'countries', responseKey: 'country' })]
    },
    {
        method: 'PATCH',
        path: '/:id/deactivate',
        permission: 'countries.deactivate',
        description: 'Desactivar país',
        handler: controller.deactivate,
        middlewares: [logAction({ ...countryAudit, action: 'update', resource: 'countries', responseKey: 'country' })]
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

export const countryRoutes = routes;
export default router;
