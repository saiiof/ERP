import { User } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";





// register user 
export const registerUser = async (req , res , next) => {
    // get data from req
    const { name, email, phone, password, role, dateOfBirth } = req.body
    
    //check if user exist by email
    const userByEmail = await User.findOne({ email })
    if (userByEmail) {
        return next(new AppError(messages.user.emailAlreadyExist , 409))
    }

    //check if user exist by phone
    const userByPhone = await User.findOne({ phone })
    if (userByPhone) {
        return next(new AppError(messages.user.phoneAlreadyExist , 409))
    }

    // hash password
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS || 10))

    // create user
    const user = new User({ 
        name, 
        email,
        phone,
        password : hashedPassword,
        role,
        dateOfBirth
    })
    const createdUser = await user.save()
    if (!createdUser) {
        return next(new AppError(messages.user.failedToCreate , 500))
    }
    // send response
    return res.status(201).json({
        status : 'success' , 
        message : messages.user.createdSuccessfully , 
        data : createdUser
    })
  
}



// login user
export const loginUser = async (req , res , next) => {
    const { email, password } = req.body

    // find user by email
    const user = await User.findOne({ email })
    if (!user) {
        return next(new AppError(messages.user.notFound , 404))
    }

    // compare password
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
        return next(new AppError('Invalid email or password' , 401))
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1d' }
    );

    const returnedUser = user.toObject();
    delete returnedUser.password;

    return res.status(200).json({
        status : 'success' ,
        message : 'Login successful',
        token,
        data : returnedUser
    })
}



// get all users
export const getAllUsers = async (req , res , next) => {
    const users = await User.find().select('-password')

    return res.status(200).json({
        status : 'success' ,
        data : users
    })
}



// get user by id
export const getUserById = async (req , res , next) => {
    const id = req.params.id || req.query.id

    const user = await User.findById(id).select('-password')
    if (!user) {
        return next(new AppError(messages.user.notFound , 404))
    }

    return res.status(200).json({
        status : 'success' ,
        data : user
    })
}



// update user
export const updateUser = async (req , res , next) => {
    const { id } = req.params
    const { name, email, phone, role, dateOfBirth } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (role) updateData.role = role
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth

    // check if email already exists (for another user)
    if (email) {
        const userByEmail = await User.findOne({
            email,
            _id : { $ne : id }
        })
        if (userByEmail) {
            return next(new AppError(messages.user.emailAlreadyExist , 409))
        }
        updateData.email = email
    }

    // check if phone already exists (for another user)
    if (phone) {
        const userByPhone = await User.findOne({
            phone,
            _id : { $ne : id }
        })
        if (userByPhone) {
            return next(new AppError(messages.user.phoneAlreadyExist , 409))
        }
        updateData.phone = phone
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new : true }
    ).select('-password')

    if (!updatedUser) {
        return next(new AppError(messages.user.notFound , 404))
    }

    return res.status(200).json({
        status : 'success' ,
        message : messages.user.updatedSuccessfully ,
        data : updatedUser
    })
}



// delete user
export const deleteUser = async (req , res , next) => {
    const { id } = req.params

    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
        return next(new AppError(messages.user.notFound , 404))
    }

    return res.status(200).json({
        status : 'success' ,
        message : messages.user.deletedSuccessfully ,
        data : deletedUser
    })
}
