import { Schema, model } from 'mongoose';

const warehouseSchema = new Schema({
    branch: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: [true, 'La sucursal es obligatoria']
    },
    warehouseCategory: {
        type: Schema.Types.ObjectId,
        ref: 'WarehouseCategory',
        required: [true, 'La categoría de almacén es obligatoria']
    },
    name: {
        type: String,
        required: [true, 'El nombre del almacén es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Nombre único dentro de la misma sucursal (ERS 6.5.8), no global.
warehouseSchema.index({ branch: 1, name: 1 }, { unique: true });

export const WarehouseModel = model('Warehouse', warehouseSchema);
