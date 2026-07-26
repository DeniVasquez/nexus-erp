import {
  InvalidCompanyIdError,
  CompanyNotFoundError,
  DuplicateTaxIdError,
} from '../../domain/errors.js';

// Traduce la entidad de dominio (que usa `id`) a la forma que ya consume el
// frontend/consumidores actuales de la API (`_id`, estilo Mongo). Es tarea del
// adaptador de interfaz mantener el contrato HTTP estable aunque el dominio
// interno cambie.
const toCompanyDTO = (company) => ({
  _id: company.id,
  id: company.id,
  name: company.name,
  legalName: company.legalName,
  taxId: company.taxId,
  email: company.email,
  phone: company.phone,
  address: company.address,
  logo: company.logo,
  owner: company.owner,
  plan: company.plan,
  isActive: company.isActive,
  createdAt: company.createdAt,
  updatedAt: company.updatedAt,
});

const pickDefinedFields = (body, keys) =>
  keys.reduce((changes, key) => {
    if (body[key] !== undefined && body[key] !== '') changes[key] = body[key];
    return changes;
  }, {});

export class CompanyController {
  constructor({
    listCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    toggleCompanyStatus,
    deleteCompany,
  }) {
    this.listCompaniesUseCase = listCompanies;
    this.getCompanyByIdUseCase = getCompanyById;
    this.createCompanyUseCase = createCompany;
    this.updateCompanyUseCase = updateCompany;
    this.toggleCompanyStatusUseCase = toggleCompanyStatus;
    this.deleteCompanyUseCase = deleteCompany;
  }

  // Único lugar del módulo que traduce errores de dominio a códigos HTTP.
  #handleError(res, error, fallbackMsj) {
    if (error instanceof InvalidCompanyIdError) {
      return res.status(400).json({ msj: error.message });
    }
    if (error instanceof CompanyNotFoundError) {
      return res.status(404).json({ msj: error.message });
    }
    if (error instanceof DuplicateTaxIdError) {
      return res.status(400).json({ msj: error.message });
    }
    return res.status(500).json({ msj: fallbackMsj, error: error.message });
  }

  getAll = async (req, res) => {
    try {
      const { search, isActive, plan, page = 1, limit = 10 } = req.query;
      const result = await this.listCompaniesUseCase.execute({ search, isActive, plan, page, limit });

      res.status(200).json({
        msj: result.items.length === 0 ? 'lista de empresas vacia' : 'Empresas obtenidas correctamente',
        total: result.total,
        data: result.items.map(toCompanyDTO),
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
      this.#handleError(res, error, 'Error obteniendo empresas');
    }
  };

  getOne = async (req, res) => {
    try {
      const company = await this.getCompanyByIdUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'Empresa encontrada', data: toCompanyDTO(company) });
    } catch (error) {
      this.#handleError(res, error, 'Error obteniendo empresa');
    }
  };

  create = async (req, res) => {
    try {
      const data = { ...req.body, owner: req.body.owner || req.user.id };
      const company = await this.createCompanyUseCase.execute(data);
      res.status(201).json({ msj: 'Empresa creada exitosamente', newCompany: toCompanyDTO(company) });
    } catch (error) {
      this.#handleError(res, error, 'Error creando empresa');
    }
  };

  update = async (req, res) => {
    try {
      const changes = pickDefinedFields(req.body, [
        'name',
        'legalName',
        'taxId',
        'email',
        'phone',
        'address',
        'logo',
        'plan',
        'isActive',
      ]);
      const company = await this.updateCompanyUseCase.execute(req.params.id, changes);
      res.status(200).json({ msj: 'Empresa actualizada correctamente', company: toCompanyDTO(company) });
    } catch (error) {
      this.#handleError(res, error, 'Error actualizando empresa');
    }
  };

  toggleStatus = async (req, res) => {
    try {
      const company = await this.toggleCompanyStatusUseCase.execute(req.params.id);
      res.status(200).json({
        msj: `Empresa ${company.isActive ? 'activada' : 'desactivada'} correctamente`,
        company: toCompanyDTO(company),
      });
    } catch (error) {
      this.#handleError(res, error, 'Error al cambiar estado de la empresa');
    }
  };

  delete = async (req, res) => {
    try {
      const company = await this.deleteCompanyUseCase.execute(req.params.id);
      res.status(200).json({ msj: 'Empresa eliminada correctamente', company: toCompanyDTO(company) });
    } catch (error) {
      this.#handleError(res, error, 'Error eliminando empresa');
    }
  };
}
