/**
 * Devuelve los permisos activos agrupados por recurso, listos para pintar en
 * la UI de asignación de permisos a roles.
 */
export class ListPermissionsUseCase {
  constructor(permissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async execute() {
    const permissions = await this.permissionRepository.findAllActive();

    return permissions.reduce((grouped, permission) => {
      if (!grouped[permission.resource]) grouped[permission.resource] = [];
      grouped[permission.resource].push({
        code: permission.code,
        action: permission.action,
        description: permission.description,
      });
      return grouped;
    }, {});
  }
}
