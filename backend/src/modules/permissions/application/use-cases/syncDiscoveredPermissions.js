import { discoverPermissions } from '#shared/lib/permissionDiscovery.js';
import { Permission } from '../../domain/Permission.js';

/**
 * Sincroniza en la base de datos los permisos declarados en la metadata de
 * las rutas de todos los módulos (auto-discovery). Se ejecuta en cada arranque
 * del servidor para que el catálogo de permisos nunca quede desactualizado.
 * Devuelve los códigos descubiertos para que otros procesos de seed (ej. el
 * rol admin) puedan usarlos sin tener que descubrirlos de nuevo.
 */
export class SyncDiscoveredPermissionsUseCase {
  constructor(permissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async execute(routeModules) {
    const discovered = discoverPermissions(routeModules);

    for (const perm of discovered) {
      await this.permissionRepository.upsertByCode(new Permission(perm));
    }

    return discovered.map((perm) => perm.code);
  }
}
