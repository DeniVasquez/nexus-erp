import { Schema, model } from 'mongoose';

const countrySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del país es obligatorio'],
        unique: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const CountryModel = model('Country', countrySchema);
