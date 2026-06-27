import { AppError } from "../utils/appError.js"

export const asynkHandler = (fn) => {
    return (req , res , next) => {
        Promise.resolve(fn(req , res , next)).catch((err) => next(new AppError(err.message , err.statusCode )))
    }
}


export const globalErrorHandler = (err , req , res , next) => {
    return res.status(err.statusCode || 500).json({
        message : err.message || 'internal server error',
        success : false
    })
}