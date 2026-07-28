import { MongoPermissionRepository } from '../persistence/MongoPermissionRepository.js';
import { ListPermissionsUseCase } from '../../application/use-cases/listPermissions.js';
import { PermissionController } from './permission.controller.js';

// Composition root de este handler: no hay un router propio para permissions
// (hoy solo se expone vía GET /roles/permissions), así que otros módulos
// importan directamente este handler ya armado, igual que logAction/
// entityHistoryHandler en el módulo logs.
const controller = new PermissionController({
    listPermissions: new ListPermissionsUseCase(new MongoPermissionRepository()),
});

export const getAllPermissionsHandler = controller.getAll;
