import { Schema, model } from 'mongoose';

// Nota: el ERS (6.5.3) no incluye `is_active` en la tabla warehouse_category,
// pero 6.5.5/6.5.7 sí definen una operación y un permiso "Desactivar" —
// sin este campo esa operación no tendría nada que cambiar. Se agrega aquí
// como el mínimo necesario para que la regla del ERS sea implementable.
const warehouseCategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true,
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

export const WarehouseCategoryModel = model('WarehouseCategory', warehouseCategorySchema);
