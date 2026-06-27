import joi from "joi"
import { AppError } from "../utils/appError.js"




export const generalFields = {
    name : joi.string().trim()
}

export const isValid = (schema ) => {
    return (req , res , next) =>{
        let data = {...req.body , ...req.params , ...req.query}
        const { error } = schema.validate(data , {abortEarly : true })
        if (error) {
            return next(new AppError(error.details?.[0]?.message || 'Validation error', 400))
        }
        next()
    }
}