import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { isAuthenticated, isAuthorized } from "../../middleware/auth.js";
import {
    addSupDepartmentValidation,
    deleteSupDepartmentValidation,
    getSupDepartmentByIdValidation,
    updateSupDepartmentValidation
} from "./supDepartment.validation.js";
import { asynkHandler } from "../../middleware/asyncHandler.js";
import {
    addSupDepartment,
    deleteSupDepartment,
    getAllSupDepartments,
    getSupDepartmentById,
    updateSupDepartment
} from "./supDepartment.controller.js";

const supDepartmentRouter = Router();

// add supDepartment
supDepartmentRouter.post('/addSupDepartment' , isAuthenticated, isAuthorized(['admin', 'hr']), isValid(addSupDepartmentValidation), asynkHandler(addSupDepartment))

// get all supDepartments
supDepartmentRouter.get('/allSupDepartments' , isAuthenticated, isAuthorized(['admin', 'doctor', 'hr', 'receptionist']), asynkHandler(getAllSupDepartments))

// get supDepartment by id
supDepartmentRouter.get('/supDepartment/:id' , isAuthenticated, isAuthorized(['admin', 'doctor', 'hr', 'receptionist']), isValid(getSupDepartmentByIdValidation), asynkHandler(getSupDepartmentById))

// update supDepartment
supDepartmentRouter.put('/updateSupDepartment/:id' , isAuthenticated, isAuthorized(['admin', 'hr']), isValid(updateSupDepartmentValidation), asynkHandler(updateSupDepartment))

// delete sub-department
supDepartmentRouter.delete('/deleteSupDepartment/:id' , isAuthenticated, isAuthorized(['admin', 'hr']), isValid(deleteSupDepartmentValidation), asynkHandler(deleteSupDepartment))


export default supDepartmentRouter;