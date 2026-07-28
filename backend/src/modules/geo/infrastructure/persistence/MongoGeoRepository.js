import mongoose from 'mongoose';
import { GeoRepository } from '../../domain/GeoRepository.js';
import { Department } from '../../domain/Department.js';
import { Municipality } from '../../domain/Municipality.js';
import { District } from '../../domain/District.js';
import { DepartmentModel } from './departmentMongooseModel.js';
import { MunicipalityModel } from './municipalityMongooseModel.js';
import { DistrictModel } from './districtMongooseModel.js';

const toDepartment = (doc) =>
    doc ? new Department({ id: doc._id.toString(), code: doc.code, name: doc.name, shortName: doc.shortName }) : null;

const toMunicipality = (doc) =>
    doc ? new Municipality({ id: doc._id.toString(), code: doc.code, name: doc.name, department: doc.department }) : null;

const toDistrict = (doc) =>
    doc ? new District({ id: doc._id.toString(), code: doc.code, name: doc.name, municipality: doc.municipality }) : null;

// Los ids de geo se validan por existencia (null = no encontrado), no con un
// error de dominio propio: son un catálogo auxiliar consultado por otros
// módulos (companies, branches), y un ObjectId con formato inválido debe
// tratarse igual que "no encontrado", no como un 500 de Mongoose.
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Adaptador concreto del puerto GeoRepository. Único archivo del módulo que
 * conoce Mongoose. Todas las consultas son de lectura pura sobre catálogos
 * ya sembrados (ver infrastructure/persistence/seed/).
 */
export class MongoGeoRepository extends GeoRepository {
    async findAllDepartments() {
        const docs = await DepartmentModel.find().sort({ code: 1 });
        return docs.map(toDepartment);
    }

    async findDepartmentById(id) {
        if (!isValidId(id)) return null;
        const doc = await DepartmentModel.findById(id);
        return toDepartment(doc);
    }

    async findMunicipalitiesByDepartment(departmentId) {
        if (!isValidId(departmentId)) return [];
        const docs = await MunicipalityModel.find({ department: departmentId }).sort({ code: 1 });
        return docs.map(toMunicipality);
    }

    async findMunicipalityById(id) {
        if (!isValidId(id)) return null;
        const doc = await MunicipalityModel.findById(id);
        return toMunicipality(doc);
    }

    async findDistrictsByMunicipality(municipalityId) {
        if (!isValidId(municipalityId)) return [];
        const docs = await DistrictModel.find({ municipality: municipalityId }).sort({ code: 1 });
        return docs.map(toDistrict);
    }

    async findDistrictById(id) {
        if (!isValidId(id)) return null;
        const doc = await DistrictModel.findById(id);
        return toDistrict(doc);
    }
}
