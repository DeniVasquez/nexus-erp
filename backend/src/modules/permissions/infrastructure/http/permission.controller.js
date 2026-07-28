export class PermissionController {
  constructor({ listPermissions }) {
    this.listPermissionsUseCase = listPermissions;
  }

  getAll = async (req, res) => {
    try {
      const grouped = await this.listPermissionsUseCase.execute();
      const total = Object.values(grouped).reduce((sum, permissions) => sum + permissions.length, 0);

      res.json({ total, permissions: grouped });
    } catch (error) {
      res.status(500).json({
        msj: 'Error al obtener permisos',
        error: error.message,
      });
    }
  };
}
