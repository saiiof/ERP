import mongoose, { Schema } from "mongoose";
const employeeSchema = new Schema({
    employeeId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    role : {
        type : String,
        enum : ['admin', 'doctor', 'hr', 'receptionist', 'pharmacist'],
        default : 'doctor'
    } ,
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    supDepartment: { type: Schema.Types.ObjectId, ref: 'SupDepartment' },
    position: { type: String, trim: true },
    hireDate: { type: Date },
    status: { type: String, enum: ['active','inactive','terminated'], default: 'active' },
    avatar: { type: String, trim: true }
}, {
    timestamps: true
});


export const Employee = mongoose.model('Employee', employeeSchema);
