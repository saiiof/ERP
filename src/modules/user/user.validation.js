import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


const objectIdValidation = joi.string().hex().length(24)
const emailValidation = joi.string().email().required()
const phoneValidation = joi.string().required()
const passwordValidation = joi.string().min(6).required()
const roleValidation = joi.string().valid('admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'lab_technician', 'accountant', 'ward_manager', 'patient')



export const registerUserValidation = joi.object({
    name : generalFields.name.required(),
    email : emailValidation,
    phone : phoneValidation,
    password : passwordValidation,
    role : roleValidation.required(),
    dateOfBirth: joi.date().iso()
})


export const loginUserValidation = joi.object({
    email : emailValidation,
    password : passwordValidation
})


export const getUserByIdValidation = joi.object({
    id : objectIdValidation.required()
})


export const updateUserValidation = joi.object({
    id : objectIdValidation.required(),
    name : generalFields.name,
    email : emailValidation,
    phone : phoneValidation,
    role : roleValidation
    ,
    dateOfBirth: joi.date().iso()
})


export const deleteUserValidation = joi.object({
    id : objectIdValidation.required()
})
