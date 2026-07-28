import { Router } from 'express';
import { authMiddleware } from '#shared/middleware/auth.middleware.js';

import { MongoGeoRepository } from '../persistence/MongoGeoRepository.js';
import { GeoController } from './geo.controller.js';

// --- Composition root ---
const geoRepository = new MongoGeoRepository();
const controller = new GeoController({ geoRepository });

const router = Router();

// Rutas sin `permission`: cualquier usuario autenticado puede leer el
// catálogo geográfico (lo necesita para los selects de dirección de
// companies/branches). Al no tener `permission`, el auto-discovery de
// permisos (shared/lib/permissionDiscovery.js) las ignora sin problema.
const routes = [
    {
        method: 'GET',
        path: '/departments',
        description: 'Listar departamentos',
        handler: controller.getDepartments,
        middlewares: [],
    },
    {
        method: 'GET',
        path: '/departments/:departmentId/municipalities',
        description: 'Listar municipios de un departamento',
        handler: controller.getMunicipalitiesByDepartment,
        middlewares: [],
    },
    {
        method: 'GET',
        path: '/municipalities/:municipalityId/districts',
        description: 'Listar distritos de un municipio',
        handler: controller.getDistrictsByMunicipality,
        middlewares: [],
    },
];

routes.forEach((route) => {
    router[route.method.toLowerCase()](route.path, authMiddleware, ...route.middlewares, route.handler);
});

export const geoRoutes = routes;
export default router;
