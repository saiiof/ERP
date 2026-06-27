import { Employee } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// add employee
export const addEmployee = async (req, res, next) => {
    const { employeeId, firstName, lastName, email, password, phone, role, dateOfBirth, department, supDepartment, position, hireDate, status, avatar } = req.body;

    // check duplicate employeeId
    if (employeeId) {
        const existing = await Employee.findOne({ employeeId });
        if (existing) return next(new AppError(messages.employee.alreadyExist, 409));
    }

    // check duplicate email
    const emailExists = await Employee.findOne({ email });
    if (emailExists) return next(new AppError(messages.user.emailAlreadyExist, 409));

    // check duplicate phone
    const phoneExists = await Employee.findOne({ phone });
    if (phoneExists) return next(new AppError(messages.user.phoneAlreadyExist, 409));

    // hash password
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS || 10));

    const employee = new Employee({
        employeeId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        role,
        dateOfBirth,
        department,
        supDepartment,
        position,
        hireDate,
        status,
        avatar
    });
    const created = await employee.save();
    if (!created) return next(new AppError(messages.employee.failedToCreate, 500));

    const returnedEmployee = created.toObject();
    delete returnedEmployee.password;

    return res.status(201).json({ status: 'success', message: messages.employee.createdSuccessfully, data: returnedEmployee });
}


// get all employees
export const getAllEmployees = async (req, res, next) => {
    const employees = await Employee.find().select('-password').populate('department supDepartment', 'name');
    return res.status(200).json({ status: 'success', data: employees });
}


// get employee by id
export const getEmployeeById = async (req, res, next) => {
    const id = req.params.id || req.query.id;
    const employee = await Employee.findById(id).select('-password').populate('department supDepartment', 'name');
    if (!employee) return next(new AppError(messages.employee.notFound, 404));
    return res.status(200).json({ status: 'success', data: employee });
}


// update employee
export const updateEmployee = async (req, res, next) => {
    const { id } = req.params;
    const { employeeId, firstName, lastName, email, password, phone, role, dateOfBirth, department, supDepartment, position, hireDate, status, avatar } = req.body;

    if (employeeId) {
        const exists = await Employee.findOne({ employeeId, _id: { $ne: id } });
        if (exists) return next(new AppError(messages.employee.alreadyExist, 409));
    }

    const updateData = {};
    if (employeeId) updateData.employeeId = employeeId;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (department) updateData.department = department;
    if (supDepartment) updateData.supDepartment = supDepartment;
    if (position) updateData.position = position;
    if (hireDate) updateData.hireDate = hireDate;
    if (status) updateData.status = status;
    if (avatar) updateData.avatar = avatar;
    if (role) updateData.role = role;

    // check duplicate email
    if (email) {
        const emailExists = await Employee.findOne({ email, _id: { $ne: id } });
        if (emailExists) return next(new AppError(messages.user.emailAlreadyExist, 409));
        updateData.email = email;
    }

    // check duplicate phone
    if (phone) {
        const phoneExists = await Employee.findOne({ phone, _id: { $ne: id } });
        if (phoneExists) return next(new AppError(messages.user.phoneAlreadyExist, 409));
        updateData.phone = phone;
    }

    // hash password if provided
    if (password) {
        updateData.password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS || 10));
    }

    const updated = await Employee.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!updated) return next(new AppError(messages.employee.notFound, 404));

    return res.status(200).json({ status: 'success', message: messages.employee.updatedSuccessfully, data: updated });
}


// delete employee
export const deleteEmployee = async (req, res, next) => {
    const { id } = req.params;
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) return next(new AppError(messages.employee.notFound, 404));
    return res.status(200).json({ status: 'success', message: messages.employee.deletedSuccessfully, data: deleted });
}


// login employee
export const loginEmployee = async (req, res, next) => {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
        return next(new AppError('Invalid email or password', 404));
    }

    if (employee.status !== 'active') {
        return next(new AppError('This account is inactive or terminated', 403));
    }

    const match = bcrypt.compareSync(password, employee.password);
    if (!match) {
        return next(new AppError('Invalid email or password', 401));
    }

    const token = jwt.sign(
        { id: employee._id, email: employee.email, role: employee.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1d' }
    );

    return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        token
    });
}
