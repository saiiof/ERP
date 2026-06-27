import mongoose, { Schema } from "mongoose";

const prescriptionSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    medicines: [{
        medicine: {
            type: Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'dispensed', 'cancelled'],
        default: 'pending'
    },
    dispensedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    dispensedAt: {
        type: Date
    }
}, {
    timestamps: true
});

export const Prescription = mongoose.model('Prescription', prescriptionSchema);
