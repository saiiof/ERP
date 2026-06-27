import joi from "joi";

const objectIdValidation = joi.string().hex().length(24);

export const addEmployeeValidation = joi.object({
    employeeId: joi.string(),
    firstName: joi.string().required(),
    lastName: joi.string(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    phone: joi.string().required(),
    role: joi.string().valid('admin', 'doctor', 'hr', 'receptionist', 'pharmacist'),
    dateOfBirth: joi.date().iso(),
    department: objectIdValidation,
    supDepartment: objectIdValidation,
    position: joi.string(),
    hireDate: joi.date().iso(),
    status: joi.string().valid('active','inactive','terminated'),
    avatar: joi.string()
});

export const loginEmployeeValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

export const getEmployeeByIdValidation = joi.object({
    id: objectIdValidation.required()
});

export const updateEmployeeValidation = joi.object({
    id: objectIdValidation.required(),
    employeeId: joi.string(),
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email(),
    password: joi.string().min(6),
    phone: joi.string(),
    role: joi.string().valid('admin', 'doctor', 'hr', 'receptionist', 'pharmacist'),
    dateOfBirth: joi.date().iso(),
    department: objectIdValidation,
    supDepartment: objectIdValidation,
    position: joi.string(),
    hireDate: joi.date().iso(),
    status: joi.string().valid('active','inactive','terminated'),
    avatar: joi.string()
});

export const deleteEmployeeValidation = joi.object({
    id: objectIdValidation.required()
});
