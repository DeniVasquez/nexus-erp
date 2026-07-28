import {
  InvalidWarehouseCategoryIdError,
  WarehouseCategoryNotFoundError,
  DuplicateWarehouseCategoryNameError,
} from '../../domain/errors.js';

const toWarehouseCategoryDTO = (category) => ({
  _id: category.id,
  id: category.id,
  name: category.name,
  description: category.description,
  isActive: category.isActive,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

const pickDefinedFields = (body, keys) =>
  keys.reduce((changes, key) => {
    if (body[key] !== undefined && body[key] !== '') changes[key] = body[key];
    return changes;
  }, {});

const FIELDS = ['name', 'description'];

export class WarehouseCategoryController {
  constructor({ listWarehouseCategories, getWarehouseCategoryById, createWarehouseCategory, updateWarehouseCategory, deactivateWarehouseCategory }) {
    this.listWarehouseCategoriesUseCase = listWarehouseCategories;
    this.getWarehouseCategoryByIdUseCase = getWarehouseCategoryById;
    this.createWarehouseCategoryUseCase = createWarehouseCategory;
    this.updateWarehouseCategoryUseCase = updateWarehouseCategory;
    this.deactivateWarehouseCategoryUseCase = deactivateWarehouseCategory;
  }

  #handleError(res, error, fallbackMsj) {
    if (error instanceof InvalidWarehouseCategoryIdError) return res.status(400).json({ msj: error.message });
    if (error instanceof WarehouseCategoryNotFoundError) return res.status(404).json({ msj: error.message });
    if (error instanceof DuplicateWarehouseCategoryNameError) return res.status(400).json({ msj: error.message });
    return res.status(500).json({ msj: fallbackMsj, error: error.message });
  }

  getAll = async (req, res) => {
    try {
      const { search, isActive, page = 1, limit = 10 } = req.query;
      const result = await this.listWarehouseCategoriesUseCase.execute({ search, isActive, page, limit });

      res.status(200).json({
        msj: result.items.length === 0 ? 'lista de categorías vacia' : 'Categorías obtenidas correctamente',
        total: result.total,
        data: result.items.map(toWarehouseCategoryDTO),
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalRecords: result.total,
          limit: result.limit,
          hasNextPage: result.page < result.totalPages,
          hasPrevPage: result.page > 1,
        },
      });
    } catch (error) {
      this.#handleError(res, error, 'Error obteniendo categorías');
    }
  };

  getOne = async (req, res) => {
    try {
      const category = await this.getWarehouseCategoryByIdUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'Categoría encontrada', data: toWarehouseCategoryDTO(category) });
    } catch (error) {
      this.#handleError(res, error, 'Error obteniendo categoría');
    }
  };

  create = async (req, res) => {
    try {
      const data = pickDefinedFields(req.body, FIELDS);
      const category = await this.createWarehouseCategoryUseCase.execute(data);
      res.status(201).json({ msj: 'Categoría creada exitosamente', newWarehouseCategory: toWarehouseCategoryDTO(category) });
    } catch (error) {
      this.#handleError(res, error, 'Error creando categoría');
    }
  };

  update = async (req, res) => {
    try {
      const changes = pickDefinedFields(req.body, FIELDS);
      const category = await this.updateWarehouseCategoryUseCase.execute(req.params.id, changes);
      res.status(200).json({ msj: 'Categoría actualizada correctamente', warehouseCategory: toWarehouseCategoryDTO(category) });
    } catch (error) {
      this.#handleError(res, error, 'Error actualizando categoría');
    }
  };

  deactivate = async (req, res) => {
    try {
      const category = await this.deactivateWarehouseCategoryUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'Categoría desactivada correctamente', warehouseCategory: toWarehouseCategoryDTO(category) });
    } catch (error) {
      this.#handleError(res, error, 'Error al desactivar la categoría');
    }
  };
}
