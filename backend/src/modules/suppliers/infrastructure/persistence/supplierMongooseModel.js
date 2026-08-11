import { Schema, model } from 'mongoose';

const supplierSchema = new Schema({
    code: {
        type: String,
        required: [true, 'El código del proveedor es obligatorio'],
        unique: true,
        trim: true
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: [true, 'El país es obligatorio']
    },
    name: {
        type: String,
        required: [true, 'El nombre del proveedor es obligatorio'],
        trim: true
    },
    address: {
        type: String,
        trim: true
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
    website: {
        type: String,
        trim: true,
        match: [/^https?:\/\/\S+\.\S+$/, 'Sitio web no válido']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const SupplierModel = model('Supplier', supplierSchema);
