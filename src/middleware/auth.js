import jwt from "jsonwebtoken";
import { User, Employee } from "../../db/index.js";
import { AppError } from "../utils/appError.js";
import { asynkHandler } from "./asyncHandler.js";

export const isAuthenticated = asynkHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.token;
    
    if (!authHeader) {
        return next(new AppError("Token is required for authentication", 401));
    }

    let token = authHeader;
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        
        let account;
        if (decoded.role === "patient") {
            account = await User.findById(decoded.id);
        } else {
            account = await Employee.findById(decoded.id);
            if (account && account.status !== "active") {
                return next(new AppError("This account is inactive or terminated", 403));
            }
        }

        if (!account) {
            return next(new AppError("User not found or invalid token", 404));
        }

        req.user = account;
        next();
    } catch (err) {
        return next(new AppError("Invalid or expired token", 401));
    }
});

export const isAuthorized = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403));
        }
        next();
    };
};
