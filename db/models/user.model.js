import mongoose, { Schema } from "mongoose";


//schema 
const userSchema = new Schema ({
    name : {
        type : String,
        required : true,
        trim: true ,

    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim: true ,
        lowercase: true,
    },
    phone : {
        type : String,
        required : true,
        unique : true,
        trim: true ,
    }, 
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['patient'],
        default : 'patient'
    }
    ,
    dateOfBirth: {
        type: Date
    }
}, {
    timestamps: true , 
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});



//model
export const User = mongoose.model("User", userSchema)