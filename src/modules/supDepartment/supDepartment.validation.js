import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


const objectIdValidation = joi.string().hex().length(24)



export const addSupDepartmentValidation = joi.object({
    name : generalFields.name.required(),
    department : objectIdValidation.required()
})


export const getSupDepartmentByIdValidation = joi.object({
    id : objectIdValidation.required()
})


export const updateSupDepartmentValidation = joi.object({
    id : objectIdValidation.required(),
    name : generalFields.name.required(),
    department : objectIdValidation.required()
})


export const deleteSupDepartmentValidation = joi.object({
    id : objectIdValidation.required()
})