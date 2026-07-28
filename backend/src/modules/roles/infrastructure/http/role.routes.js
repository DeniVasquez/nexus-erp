import { Router } from 'express';
import { authMiddleware } from '#shared/middleware/auth.middleware.js';
import { checkPermission } from '#shared/middleware/checkPermission.middleware.js';

import { getAllPermissionsHandler } from '#modules/permissions/infrastructure/http/getAllPermissionsHandler.js';
// Bridge temporal: el módulo users todavía no existe (paso 5), así que contar
// usuarios por rol para el borrado sigue contra el modelo viejo hasta ese paso.
import { userModel } from '../../../../models/user.model.js';

import { MongoRoleRepository } from '../persistence/MongoRoleRepository.js';
import { ListRolesUseCase } from '../../application/use-cases/listRoles.js';
import { GetRoleByIdUseCase } from '../../application/use-cases/getRoleById.js';
import { CreateRoleUseCase } from '../../application/use-cases/createRole.js';
import { UpdateRoleUseCase } from '../../application/use-cases/updateRole.js';
import { DeleteRoleUseCase } from '../../application/use-cases/deleteRole.js';
import { RoleController } from './role.controller.js';

// --- Composition root: aquí, y solo aquí, se conectan las piezas concretas ---
const roleRepository = new MongoRoleRepository();
const countUsersWithRole = (roleId) => userModel.countDocuments({ role: roleId });

const controller = new RoleController({
    listRoles: new ListRolesUseCase(roleRepository),
    getRoleById: new GetRoleByIdUseCase(roleRepository),
    createRole: new CreateRoleUseCase(roleRepository),
    updateRole: new UpdateRoleUseCase(roleRepository),
    deleteRole: new DeleteRoleUseCase(roleRepository, countUsersWithRole),
});

const router = Router();

// rutas con metadata
const routes = [
    {
        method: 'GET',
        path: '/',
        permission: 'roles.read',
        description: 'Listar roles',
        handler: controller.getAll,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/permissions',
        permission: 'roles.read',
        description: 'Obtener permisos disponibles',
        handler: getAllPermissionsHandler,
        middlewares: []
    },
    {
        method: 'GET',
        path: '/:id',
        permission: 'roles.read',
        description: 'Obtener un rol',
        handler: controller.getOne,
        middlewares: []
    },
    {
        method: 'POST',
        path: '/',
        permission: 'roles.create',
        description: 'Crear nuevo rol',
        handler: controller.create,
        middlewares: []
    },
    {
        method: 'PUT',
        path: '/:id',
        permission: 'roles.update',
        description: 'Actualizar rol',
        handler: controller.update,
        middlewares: []
    },
    {
        method: 'DELETE',
        path: '/:id',
        permission: 'roles.delete',
        description: 'Eliminar rol',
        handler: controller.delete,
        middlewares: []
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
export const roleRoutes = routes;

// exportar router para usar en server.js
export default router;
