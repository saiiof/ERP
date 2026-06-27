import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { isAuthenticated, isAuthorized } from "../../middleware/auth.js";
import {
    addDepartmentValidation,
    deleteDepartmentValidation,
    getDepartmentByIdValidation,
    updateDepartmentValidation
} from "./department.validation.js";
import { asynkHandler } from "../../middleware/asyncHandler.js";
import {
    addDepartment,
    deleteDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment
} from "./department.controller.js";

const departmentRouter = Router();

// add department
departmentRouter.post('/addDepartment' , isAuthenticated, isAuthorized(['admin', 'hr']), isValid(addDepartmentValidation), asynkHandler(addDepartment))

// get all departments
departmentRouter.get('/allDepartments' , isAuthenticated, isAuthorized(['admin', 'doctor', 'hr', 'receptionist']), asynkHandler(getAllDepartments))

// get department by id
departmentRouter.get('/department/:id' , isAuthenticated, isAuthorized(['admin', 'doctor', 'hr', 'receptionist']), isValid(getDepartmentByIdValidation), asynkHandler(getDepartmentById))

// update department
departmentRouter.put('/updateDepartment/:id' , isAuthenticated, isAuthorized(['admin', 'hr']), isValid(updateDepartmentValidation), asynkHandler(updateDepartment))

// delete department
departmentRouter.delete('/deleteDepartment/:id' , isAuthenticated, isAuthorized(['admin', 'hr']), isValid(deleteDepartmentValidation), asynkHandler(deleteDepartment))


export default departmentRouter;