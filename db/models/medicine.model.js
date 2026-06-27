import mongoose, { Schema } from "mongoose";

const medicineSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'outOfStock'],
        default: 'available'
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
}, {
    timestamps: true
});

medicineSchema.pre('save', function(next) {
    this.status = this.quantity > 0 ? 'available' : 'outOfStock';
    next();
});

export const Medicine = mongoose.model('Medicine', medicineSchema);
