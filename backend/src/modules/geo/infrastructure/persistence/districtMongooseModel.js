import { Schema, model } from 'mongoose';

const districtSchema = new Schema({
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    municipality: { type: Schema.Types.ObjectId, ref: 'Municipality', required: true },
});

export const DistrictModel = model('District', districtSchema);
