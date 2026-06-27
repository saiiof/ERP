import slugify from "slugify"
import { Department } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"





// add department 
export const addDepartment = async (req , res , next) => {
    // get data from req
    let { name } = req.body
    name = name.toLowerCase()
    //check if department exist
    const departmentExist = await Department.findOne({ name })
    if (departmentExist) {
        return next(new AppError(messages.department.alreadyExist , 409))
    }

    const slug = slugify(name )
    // create department
    const department = new Department({ 
        name , 
        slug
    })
    const createdDepartment = await department.save()
    if (!createdDepartment) {
        return next(new AppError(messages.department.failedToCreate , 500))
    }
    // send response
    return res.status(201).json({
        status : 'success' , 
        message : messages.department.createdSuccessfully , 
        data : createdDepartment
    })
  
}



// get all departments
export const getAllDepartments = async (req , res , next) => {
    const departments = await Department.find()

    return res.status(200).json({
        status : 'success' ,
        data : departments
    })
}



// get department by id
export const getDepartmentById = async (req , res , next) => {
    const id = req.params.id || req.query.id

    const department = await Department.findById(id)
    if (!department) {
        return next(new AppError(messages.department.notFound , 404))
    }

    return res.status(200).json({
        status : 'success' ,
        data : department
    })
}



// update department
export const updateDepartment = async (req , res , next) => {
    const { id } = req.params
    let { name } = req.body
    name = name.toLowerCase()

    const departmentExist = await Department.findOne({
        name,
        _id : { $ne : id }
    })
    if (departmentExist) {
        return next(new AppError(messages.department.alreadyExist , 409))
    }

    const slug = slugify(name)
    const updatedDepartment = await Department.findByIdAndUpdate(
        id,
        { name , slug },
        { new : true }
    )

    if (!updatedDepartment) {
        return next(new AppError(messages.department.notFound , 404))
    }

    return res.status(200).json({
        status : 'success' ,
        message : messages.department.updatedSuccessfully ,
        data : updatedDepartment
    })
}



// delete department
export const deleteDepartment = async (req , res , next) => {
    const { id } = req.params

    const deletedDepartment = await Department.findByIdAndDelete(id)
    if (!deletedDepartment) {
        return next(new AppError(messages.department.notFound , 404))
    }

    return res.status(200).json({
        status : 'success' ,
        message : messages.department.deletedSuccessfully ,
        data : deletedDepartment
    })
}