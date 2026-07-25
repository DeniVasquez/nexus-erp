import mongoose from "mongoose";
import { Company } from "../models/company.model.js";

export class CompanyController {
  // Obtener todas las empresas
  async getAll(req, res) {
    try {
      const { search, isActive, plan, page = 1, limit = 10 } = req.query;

      const filter = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { legalName: { $regex: search, $options: "i" } },
          { taxId: { $regex: search, $options: "i" } },
        ];
      }

      if (isActive !== undefined && isActive !== "") {
        filter.isActive = isActive === "true";
      }

      if (plan) filter.plan = plan;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const [companies, totalRecords] = await Promise.all([
        Company.find(filter)
          .select("-__v")
          .populate("owner", "name email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum),
        Company.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalRecords / limitNum);

      res.status(200).json({
        msj:
          companies.length === 0
            ? "lista de empresas vacia"
            : "Empresas obtenidas correctamente",
        total: totalRecords,
        data: companies,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalRecords,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      });
    } catch (error) {
      res.status(500).json({
        msj: "Error obteniendo empresas",
        error: error.message,
      });
    }
  }

  // Obtener una empresa por ID
  async getOne(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msj: "Id no válido" });
      }

      const company = await Company.findById(id).populate("owner", "name email");

      if (!company) {
        return res.status(404).json({ msj: "Empresa no encontrada" });
      }

      res.status(200).json({
        msj: "Empresa encontrada",
        data: company,
      });
    } catch (error) {
      res.status(500).json({
        msj: "Error obteniendo empresa",
        error: error.message,
      });
    }
  }

  // Crear una empresa
  async create(req, res) {
    try {
      const { name, legalName, taxId, email, phone, address, logo, plan, owner } = req.body;

      const existingCompany = await Company.findOne({ taxId: taxId?.toUpperCase() });
      if (existingCompany) {
        return res.status(400).json({ msj: "Ya existe una empresa con ese RFC/NIT" });
      }

      const newCompany = await Company.create({
        name,
        legalName,
        taxId,
        email,
        phone,
        address,
        logo,
        plan,
        owner: owner || req.user.id,
      });

      res.status(201).json({
        msj: "Empresa creada exitosamente",
        newCompany,
      });
    } catch (error) {
      res.status(500).json({
        msj: "Error creando empresa",
        error: error.message,
      });
    }
  }

  // Actualizar una empresa
  async update(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msj: "Id no válido" });
      }

      const { name, legalName, taxId, email, phone, address, logo, plan, isActive } = req.body;

      const company = await Company.findById(id);
      if (!company) {
        return res.status(404).json({ msj: "Empresa no encontrada" });
      }

      if (taxId && taxId.toUpperCase() !== company.taxId) {
        const taxIdExists = await Company.findOne({ taxId: taxId.toUpperCase() });
        if (taxIdExists) {
          return res.status(400).json({ msj: "Ya existe una empresa con ese RFC/NIT" });
        }
      }

      const rightData = {};
      if (name) rightData.name = name;
      if (legalName !== undefined) rightData.legalName = legalName;
      if (taxId) rightData.taxId = taxId;
      if (email !== undefined) rightData.email = email;
      if (phone !== undefined) rightData.phone = phone;
      if (address) rightData.address = address;
      if (logo !== undefined) rightData.logo = logo;
      if (plan) rightData.plan = plan;
      if (isActive !== undefined) rightData.isActive = isActive;

      const updatedCompany = await Company.findByIdAndUpdate(id, rightData, {
        new: true,
        runValidators: true,
      }).populate("owner", "name email");

      res.status(200).json({
        msj: "Empresa actualizada correctamente",
        company: updatedCompany,
      });
    } catch (error) {
      res.status(500).json({
        msj: "Error actualizando empresa",
        error: error.message,
      });
    }
  }

  // Activar/Desactivar empresa (suspender tenant sin borrar sus datos)
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msj: "Id no válido" });
      }

      const company = await Company.findById(id);
      if (!company) {
        return res.status(404).json({ msj: "Empresa no encontrada" });
      }

      company.isActive = !company.isActive;
      await company.save();

      res.status(200).json({
        msj: `Empresa ${company.isActive ? "activada" : "desactivada"} correctamente`,
        company,
      });
    } catch (error) {
      res.status(500).json({
        msj: "Error al cambiar estado de la empresa",
        error: error.message,
      });
    }
  }

  // Eliminar una empresa
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msj: "Id no válido" });
      }

      const company = await Company.findByIdAndDelete(id);
      if (!company) {
        return res.status(404).json({ msj: "Empresa no encontrada" });
      }

      res.status(200).json({
        msj: "Empresa eliminada correctamente",
        company,
      });
    } catch (error) {
      res.status(500).json({
        msj: "Error eliminando empresa",
        error: error.message,
      });
    }
  }
}
