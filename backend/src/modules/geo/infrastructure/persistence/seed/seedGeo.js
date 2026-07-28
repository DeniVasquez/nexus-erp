import { DepartmentModel } from '../departmentMongooseModel.js';
import { MunicipalityModel } from '../municipalityMongooseModel.js';
import { DistrictModel } from '../districtMongooseModel.js';
import { elSalvadorGeo } from './elSalvadorGeo.js';

/**
 * Siembra el catálogo geográfico (departamentos, municipios, distritos) una
 * sola vez. Es idempotente: si ya existe algún departamento no vuelve a
 * insertar nada (el catálogo es de solo lectura y no cambia entre corridas).
 */
export const seedGeo = async () => {
    const alreadySeeded = await DepartmentModel.exists({});
    if (alreadySeeded) return;

    console.log('🌱 Sembrando catálogo geográfico (departamentos/municipios/distritos)...');

    for (const dept of elSalvadorGeo) {
        const departmentDoc = await DepartmentModel.create({
            code: dept.code,
            name: dept.name,
            shortName: dept.shortName,
        });

        for (const muni of dept.municipalities) {
            const municipalityDoc = await MunicipalityModel.create({
                code: muni.code,
                name: muni.name,
                department: departmentDoc._id,
            });

            await DistrictModel.insertMany(
                muni.districts.map((dist) => ({
                    code: dist.code,
                    name: dist.name,
                    municipality: municipalityDoc._id,
                })),
            );
        }
    }

    const [departments, municipalities, districts] = await Promise.all([
        DepartmentModel.countDocuments(),
        MunicipalityModel.countDocuments(),
        DistrictModel.countDocuments(),
    ]);
    console.log(`✅ Catálogo geográfico sembrado: ${departments} departamentos, ${municipalities} municipios, ${districts} distritos`);
};
