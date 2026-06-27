import joi from "joi";

const objectIdValidation = joi.string().hex().length(24);

export const bookAppointmentValidation = joi.object({
    patient: objectIdValidation, // optional because it defaults to req.user._id if booking as a patient
    doctor: objectIdValidation.required(),
    appointmentDate: joi.date().iso().required(),
    timeSlot: joi.string().required(),
    reason: joi.string().trim()
});

export const updateStatusValidation = joi.object({
    id: objectIdValidation.required(),
    status: joi.string().valid('scheduled', 'completed', 'cancelled', 'noShow').required()
});

export const addNotesValidation = joi.object({
    id: objectIdValidation.required(),
    notes: joi.string().trim().required()
});

export const getAppointmentByIdValidation = joi.object({
    id: objectIdValidation.required()
});
