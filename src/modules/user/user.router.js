import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import {
    registerUserValidation,
    loginUserValidation,
    deleteUserValidation,
    getUserByIdValidation,
    updateUserValidation
} from "./user.validation.js";
import { asynkHandler } from "../../middleware/asyncHandler.js";
import {
    registerUser,
    loginUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
} from "./user.controller.js";

const userRouter = Router();

// register user
userRouter.post('/register' , isValid(registerUserValidation), asynkHandler(registerUser))

// login user
userRouter.post('/login' , isValid(loginUserValidation), asynkHandler(loginUser))

// get all users
userRouter.get('/allUsers' , asynkHandler(getAllUsers))

// get user by id
userRouter.get('/user/:id' , isValid(getUserByIdValidation), asynkHandler(getUserById))

// update user
userRouter.put('/updateUser/:id' , isValid(updateUserValidation), asynkHandler(updateUser))

// delete user
userRouter.delete('/deleteUser/:id' , isValid(deleteUserValidation), asynkHandler(deleteUser))


export default userRouter;
