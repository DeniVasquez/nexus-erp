import { RoleModel } from '../persistence/roleMongooseModel.js';

// Permisos que no corresponden a ninguna ruta protegida (no hay módulo de
// dashboard todavía) y por eso el auto-discovery nunca los va a encontrar.
// Se mantienen a mano y se agregan al admin además de los descubiertos.
export const PERMISSIONS = {
    USERS_READ: 'users.read',
    USERS_CREATE: 'users.create',
    USERS_UPDATE: 'users.update',
    LOGS_READ: 'logs.read',
    DASHBOARD_VIEW: 'dashboard.view',
    DASHBOARD_STATS: 'dashboard.stats'
};

/**
 * Sincroniza los roles base del sistema en cada arranque del servidor.
 *
 * - admin: siempre se reescribe con TODOS los permisos descubiertos por
 *   auto-discovery (más los que no corresponden a ninguna ruta, como
 *   dashboard.*), así nunca queda desactualizado cuando se agregan módulos.
 * - moderator / user: solo se crean si todavía no existen. Si ya existen no
 *   se tocan, para no pisar permisos que un admin les haya asignado a mano
 *   desde la UI de roles.
 *
 * @param {string[]} discoveredPermissionCodes - códigos de permiso encontrados
 *   en las rutas de todos los módulos (ver #shared/lib/permissionDiscovery.js)
 */
export const seedRoles = async (discoveredPermissionCodes = []) => {
    try {
        console.log('🌱 Sincronizando roles del sistema...');

        const adminPermissions = Array.from(new Set([
            ...discoveredPermissionCodes,
            PERMISSIONS.DASHBOARD_VIEW,
            PERMISSIONS.DASHBOARD_STATS,
        ]));

        await RoleModel.findOneAndUpdate(
            { name: 'admin' },
            {
                name: 'admin',
                displayName: 'Administrador',
                description: 'Control total del sistema',
                permissions: adminPermissions,
                isSystem: true,
            },
            { upsert: true }
        );
        console.log(`✅ Rol "Administrador" sincronizado con ${adminPermissions.length} permisos`);

        const defaultRoles = [
            {
                name: 'moderator',
                displayName: 'Moderador',
                description: 'Puede gestionar usuarios y ver logs',
                permissions: [
                    PERMISSIONS.USERS_READ,
                    PERMISSIONS.USERS_CREATE,
                    PERMISSIONS.USERS_UPDATE,
                    PERMISSIONS.LOGS_READ,
                    PERMISSIONS.DASHBOARD_VIEW
                ],
                isSystem: true
            },
            {
                name: 'user',
                displayName: 'Usuario',
                description: 'Usuario estándar sin permisos especiales',
                permissions: [PERMISSIONS.DASHBOARD_VIEW],
                isSystem: true
            }
        ];

        for (const roleData of defaultRoles) {
            const exists = await RoleModel.exists({ name: roleData.name });
            if (!exists) {
                await RoleModel.create(roleData);
                console.log(`✅ Rol "${roleData.displayName}" creado`);
            }
        }

        console.log('🎉 Sincronización de roles completada');
    } catch (error) {
        console.error('❌ Error en seed:', error);
        throw error;
    }
};
