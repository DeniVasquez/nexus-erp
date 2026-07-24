import { Router } from 'express'
import { userController } from '../controllers/user.controller.js'
import { userModel } from '../models/user.model.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { checkPermission } from '../middleware/role.middleware.js'
import { logAction } from '../middleware/logger.middleware.js'
import { createEntityHistoryHandler } from '../controllers/logs.controller.js'

const router = Router()
const controller = new userController()

// Config de auditoría compartida por las rutas de usuarios
const userAudit = {
    entityModel: userModel,
    snapshot: {
        fields: ['name', 'email', 'role', 'isActive', 'lastLogin'],
        populate: 'role',
        transform: (snapshot, doc) => ({
            ...snapshot,
            role: doc.role?.name || doc.role,
            roleId: doc.role?._id
        })
    },
    compareFields: ['name', 'email', 'role', 'isActive']
}

//  rutas con metadata
const routes = [
    {
        method: 'GET',
        path: '/users',
        permission: 'users.read',
        description: 'Listar usuarios',
        handler: controller.getAll,
        middlewares: []
    },
    {
        method: 'POST',
        path: '/users',
        permission: 'users.create',
        description: 'Crear usuario',
        handler: controller.createUser,
        middlewares: [logAction({ ...userAudit, action: 'create', resource: 'users', responseKey: 'newUser' })]
    },
    {
        method: 'GET',
        path: '/users/:id',
        permission: 'users.read',
        description: 'Obtener un usuario',
        handler: controller.getUser,
        middlewares: [logAction({ ...userAudit, action: 'read', resource: 'users' })]
    },
    {
        method: 'PUT',
        path: '/users/:id',
        permission: 'users.update',
        description: 'Actualizar usuario',
        handler: controller.updateUser,
        middlewares: [logAction({ ...userAudit, action: 'update', resource: 'users', responseKey: 'user' })]
    },
    {
        method: 'PATCH',
        path: '/users/:id/toggle-status',
        permission: 'users.update',
        description: 'Activar/Desactivar usuario',
        handler: controller.toggleUserStatus,
        middlewares: [logAction({ ...userAudit, action: 'update', resource: 'users', responseKey: 'user' })]
    },
    {
        method: 'GET',
        path: '/users/:userId/history',
        permission: 'logs.read',
        description: 'Ver historial de cambios del usuario',
        handler: createEntityHistoryHandler(userModel.modelName, 'userId'),
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
export const userRoutes = routes;

// exportar router para usar en server.js
export default router;