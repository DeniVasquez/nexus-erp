import { isValidGeoLocation } from '#shared/lib/geoValidation.js';
import { CompanyNotFoundError, DuplicateNitError, DuplicateNrcError, InvalidLocationError } from '../../domain/errors.js';

export class UpdateCompanyUseCase {
  constructor(companyRepository, geoRepository) {
    this.companyRepository = companyRepository;
    this.geoRepository = geoRepository;
  }

  async execute(id, changes) {
    const company = await this.companyRepository.findById(id);
    if (!company) throw new CompanyNotFoundError();

    if (changes.nit && changes.nit !== company.nit) {
      const nitTaken = await this.companyRepository.findByNit(changes.nit);
      if (nitTaken) throw new DuplicateNitError();
    }

    if (changes.nrc && changes.nrc !== company.nrc) {
      const nrcTaken = await this.companyRepository.findByNrc(changes.nrc);
      if (nrcTaken) throw new DuplicateNrcError();
    }

    // Si se toca cualquier parte de la ubicación, se revalida la cadena completa
    // (no permitimos, por ejemplo, cambiar el municipio y dejar el distrito viejo).
    if (changes.department || changes.municipality || changes.district) {
      const validLocation = await isValidGeoLocation(this.geoRepository, {
        departmentId: changes.department || company.department,
        municipalityId: changes.municipality || company.municipality,
        districtId: changes.district || company.district,
      });
      if (!validLocation) throw new InvalidLocationError();
    }

    return this.companyRepository.update(id, changes);
  }
}
