import { Schema, model } from 'mongoose';

const supplierContactSchema = new Schema({
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'El proveedor es obligatorio']
    },
    fullName: {
        type: String,
        required: [true, 'El nombre del contacto es obligatorio'],
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
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const SupplierContactModel = model('SupplierContact', supplierContactSchema);
