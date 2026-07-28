import { Schema, model } from 'mongoose';

const municipalitySchema = new Schema({
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
});

export const MunicipalityModel = model('Municipality', municipalitySchema);
