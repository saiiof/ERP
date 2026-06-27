import { globalErrorHandler } from "./middleware/asyncHandler.js";
import { departmentRouter, supDepartmentRouter, userRouter, employeeRouter, pharmacyRouter, appointmentRouter } from "./modules/index.js";
export const initApp = (app , express) => {
    // parse req 
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))


    //routing 
    app.use('/department' , departmentRouter)
    app.use('/supDepartment' , supDepartmentRouter)
    app.use('/user' , userRouter)
    app.use('/employee' , employeeRouter)
    app.use('/pharmacy' , pharmacyRouter)
    app.use('/appointment' , appointmentRouter)




    // global error handler
    app.use(globalErrorHandler)
}