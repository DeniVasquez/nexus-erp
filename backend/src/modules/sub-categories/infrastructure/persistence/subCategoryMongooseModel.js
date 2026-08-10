import { Schema, model } from 'mongoose';

const subCategorySchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La categoría es obligatoria']
    },
    name: {
        type: String,
        required: [true, 'El nombre de la sub-categoría es obligatorio'],
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

// Nombre único dentro de la misma categoría, no global (igual que warehouses/branch).
subCategorySchema.index({ category: 1, name: 1 }, { unique: true });

export const SubCategoryModel = model('SubCategory', subCategorySchema);
