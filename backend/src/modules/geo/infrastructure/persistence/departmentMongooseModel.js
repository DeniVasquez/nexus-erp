import { Schema, model } from 'mongoose';

const departmentSchema = new Schema({
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
});

export const DepartmentModel = model('Department', departmentSchema);
