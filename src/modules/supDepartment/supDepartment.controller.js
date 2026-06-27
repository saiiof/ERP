import slugify from "slugify"
import { SupDepartment } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"





// add supDepartment 
export const addSupDepartment = async (req , res , next) => {
    // get data from req
    let { name , department } = req.body
    name = name.toLowerCase()
    //check if supDepartment exist
    const supDepartmentExist = await SupDepartment.findOne({ name })
    if (supDepartmentExist) {
        return next(new AppError(messages.supDepartment.alreadyExist , 409))
    }

    const slug = slugify(name )
    // create supDepartment
    const supDepartment = new SupDepartment({ 
        name , 
        slug,
        department
    })
    const createdSupDepartment = await supDepartment.save()
    if (!createdSupDepartment) {
        return next(new AppError(messages.supDepartment.failedToCreate , 500))
    }
    // send response
    return res.status(201).json({
        status : 'success' , 
        message : messages.supDepartment.createdSuccessfully , 
        data : createdSupDepartment
    })
  
}



// get all supDepartments
export const getAllSupDepartments = async (req , res , next) => {
    const supDepartments = await SupDepartment.find()

    return res.status(200).json({
        status : 'success' ,
        data : supDepartments
    })
}



// get supDepartment by id
export const getSupDepartmentById = async (req , res , next) => {
    const id = req.params.id || req.query.id

    const supDepartment = await SupDepartment.findById(id)
    if (!supDepartment) {
        return next(new AppError(messages.supDepartment.notFound , 404))
    }

    return res.status(200).json({
        status : 'success' ,
        data : supDepartment
    })
}



// update supDepartment
export const updateSupDepartment = async (req , res , next) => {
    const { id } = req.params
    let { name , department } = req.body
    name = name.toLowerCase()

    const supDepartmentExist = await SupDepartment.findOne({
        name,
        _id : { $ne : id }
    })
    if (supDepartmentExist) {
        return next(new AppError(messages.supDepartment.alreadyExist , 409))
    }

    const slug = slugify(name)
    const updatedSupDepartment = await SupDepartment.findByIdAndUpdate(
        id,
        { name , slug , department },
        { new : true }
    )

    if (!updatedSupDepartment) {
        return next(new AppError(messages.supDepartment.notFound , 404))
    }

    return res.status(200).json({
        status : 'success' ,
        message : messages.supDepartment.updatedSuccessfully ,
        data : updatedSupDepartment
    })
}



// delete supDepartment
export const deleteSupDepartment = async (req , res , next) => {
    const { id } = req.params

    const deletedSupDepartment = await SupDepartment.findByIdAndDelete(id)
    if (!deletedSupDepartment) {
        return next(new AppError(messages.supDepartment.notFound , 404))
    }

    return res.status(200).json({
        status : 'success' ,
        message : messages.supDepartment.deletedSuccessfully ,
        data : deletedSupDepartment
    })
}