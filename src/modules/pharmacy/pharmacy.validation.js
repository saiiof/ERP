import joi from "joi";

const objectIdValidation = joi.string().hex().length(24);

export const addMedicineValidation = joi.object({
    name: joi.string().required(),
    description: joi.string(),
    quantity: joi.number().min(0).required(),
    price: joi.number().min(0).required(),
    expiryDate: joi.date().iso().required()
});

export const updateMedicineValidation = joi.object({
    id: objectIdValidation.required(),
    name: joi.string(),
    description: joi.string(),
    quantity: joi.number().min(0),
    price: joi.number().min(0),
    expiryDate: joi.date().iso()
});

export const getMedicineByIdValidation = joi.object({
    id: objectIdValidation.required()
});

export const addPrescriptionValidation = joi.object({
    patient: objectIdValidation.required(),
    medicines: joi.array().items(joi.object({
        medicine: objectIdValidation.required(),
        dosage: joi.string().required(),
        duration: joi.string().required(),
        quantity: joi.number().integer().min(1).required()
    })).min(1).required()
});

export const dispensePrescriptionValidation = joi.object({
    id: objectIdValidation.required()
});

export const getPrescriptionByIdValidation = joi.object({
    id: objectIdValidation.required()
});
