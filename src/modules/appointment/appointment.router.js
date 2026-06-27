import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { isAuthenticated, isAuthorized } from "../../middleware/auth.js";
import {
    bookAppointmentValidation,
    updateStatusValidation,
    addNotesValidation,
    getAppointmentByIdValidation
} from "./appointment.validation.js";
import {
    bookAppointment,
    updateAppointmentStatus,
    addAppointmentNotes,
    getAppointments,
    getAppointmentById
} from "./appointment.controller.js";

const appointmentRouter = Router();

// Book Appointment
appointmentRouter.post(
    "/book",
    isAuthenticated,
    isValid(bookAppointmentValidation),
    bookAppointment
);

// Update Status
appointmentRouter.put(
    "/:id/status",
    isAuthenticated,
    isValid(updateStatusValidation),
    updateAppointmentStatus
);

// Add Notes (Doctor only)
appointmentRouter.put(
    "/:id/notes",
    isAuthenticated,
    isAuthorized(["doctor"]),
    isValid(addNotesValidation),
    addAppointmentNotes
);

// Get Appointments (Filters by role dynamically)
appointmentRouter.get(
    "/",
    isAuthenticated,
    getAppointments
);

// Get Appointment By ID
appointmentRouter.get(
    "/:id",
    isAuthenticated,
    isValid(getAppointmentByIdValidation),
    getAppointmentById
);

export default appointmentRouter;
