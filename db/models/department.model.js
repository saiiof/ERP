import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({
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
    }]






},{
    timestamps: true
})

export const Department = mongoose.model("Department", departmentSchema)
