const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'An item must have a name'],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
            default: 'No description provided.',
        },
        quantity: {
            type: Number,
            required: [true, 'An item must have a quantity'],
            default: 1,
            min: [0, 'Quantity cannot be negative'],
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    },
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;