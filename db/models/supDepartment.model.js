import mongoose, { Schema } from "mongoose";

const supDepartmentSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    slug : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    employee : [{
        type : Schema.Types.ObjectId,
        ref : "Employee"
    }],
    department : {
        type : Schema.Types.ObjectId,
        ref : "Department",
        required : true
    }






},{
    timestamps: true
})

export const SupDepartment = mongoose.model("SupDepartment", supDepartmentSchema)