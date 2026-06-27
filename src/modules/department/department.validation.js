import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


const objectIdValidation = joi.string().hex().length(24)



export const addDepartmentValidation = joi.object({
    name : generalFields.name.required(),

})


export const getDepartmentByIdValidation = joi.object({
    id : objectIdValidation.required()
})


export const updateDepartmentValidation = joi.object({
    id : objectIdValidation.required(),
    name : generalFields.name.required()
})


export const deleteDepartmentValidation = joi.object({
    id : objectIdValidation.required()
})