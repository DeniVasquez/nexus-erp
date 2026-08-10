import { Schema, model } from 'mongoose';

const unitSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la unidad es obligatorio'],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: [true, 'El tipo de la unidad es obligatorio'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const UnitModel = model('Unit', unitSchema);
