import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { asynkHandler } from "../../middleware/asyncHandler.js";
import { isAuthenticated, isAuthorized } from "../../middleware/auth.js";
import {
    addEmployeeValidation,
    deleteEmployeeValidation,
    getEmployeeByIdValidation,
    updateEmployeeValidation,
    loginEmployeeValidation
} from "./employee.validation.js";
import {
    addEmployee,
    deleteEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    loginEmployee
} from "./employee.controller.js";

const employeeRouter = Router();

// login employee
employeeRouter.post('/login', isValid(loginEmployeeValidation), asynkHandler(loginEmployee));

// protected routes
employeeRouter.post('/addEmployee', isAuthenticated, isAuthorized(['admin', 'hr']), isValid(addEmployeeValidation), asynkHandler(addEmployee));
employeeRouter.get('/allEmployees', isAuthenticated, isAuthorized(['admin', 'doctor', 'hr', 'receptionist']), asynkHandler(getAllEmployees));
employeeRouter.get('/employee/:id', isAuthenticated, isAuthorized(['admin', 'doctor', 'hr', 'receptionist']), isValid(getEmployeeByIdValidation), asynkHandler(getEmployeeById));
employeeRouter.put('/updateEmployee/:id', isAuthenticated, isAuthorized(['admin', 'hr']), isValid(updateEmployeeValidation), asynkHandler(updateEmployee));
employeeRouter.delete('/deleteEmployee/:id', isAuthenticated, isAuthorized(['admin', 'hr']), isValid(deleteEmployeeValidation), asynkHandler(deleteEmployee));

export default employeeRouter;
