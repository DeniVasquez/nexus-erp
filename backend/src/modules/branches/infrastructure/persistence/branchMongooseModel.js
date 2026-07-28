import { Schema, model } from 'mongoose';

const branchSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'La empresa es obligatoria']
    },
    name: {
        type: String,
        required: [true, 'El nombre de la sucursal es obligatorio'],
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'El departamento es obligatorio']
    },
    municipality: {
        type: Schema.Types.ObjectId,
        ref: 'Municipality',
        required: [true, 'El municipio es obligatorio']
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: 'District',
        required: [true, 'El distrito es obligatorio']
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email no válido']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// RN-BRA-005: el nombre debe ser único dentro de la misma empresa (no global).
branchSchema.index({ company: 1, name: 1 }, { unique: true });

export const BranchModel = model('Branch', branchSchema);
