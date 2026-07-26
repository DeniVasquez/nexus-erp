import { Schema, model } from 'mongoose';

const companySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la empresa es obligatorio'],
        trim: true
    },
    legalName: {
        type: String,
        trim: true
    },
    taxId: {
        type: String,
        required: [true, 'El RFC/NIT/RUC es obligatorio'],
        unique: true,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email no válido']
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        zipCode: { type: String, trim: true }
    },
    logo: {
        type: String,
        default: null
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    plan: {
        type: String,
        enum: ['free', 'basic', 'pro', 'enterprise'],
        default: 'free'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const CompanyModel = model('Company', companySchema);
