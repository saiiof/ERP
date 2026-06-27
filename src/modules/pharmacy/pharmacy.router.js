import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { isAuthenticated, isAuthorized } from "../../middleware/auth.js";
import {
    addMedicineValidation,
    updateMedicineValidation,
    getMedicineByIdValidation,
    addPrescriptionValidation,
    dispensePrescriptionValidation,
    getPrescriptionByIdValidation
} from "./pharmacy.validation.js";
import {
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getAllMedicines,
    getMedicineById,
    createPrescription,
    dispensePrescription,
    getAllPrescriptions,
    getPrescriptionById,
    getPatientPrescriptions
} from "./pharmacy.controller.js";

const pharmacyRouter = Router();

// ==========================================
// MEDICINE ROUTES
// ==========================================

// Add Medicine
pharmacyRouter.post(
    "/medicine",
    isAuthenticated,
    isAuthorized(["admin", "pharmacist"]),
    isValid(addMedicineValidation),
    addMedicine
);

// Update Medicine
pharmacyRouter.put(
    "/medicine/:id",
    isAuthenticated,
    isAuthorized(["admin", "pharmacist"]),
    isValid(updateMedicineValidation),
    updateMedicine
);

// Delete Medicine
pharmacyRouter.delete(
    "/medicine/:id",
    isAuthenticated,
    isAuthorized(["admin", "pharmacist"]),
    isValid(getMedicineByIdValidation),
    deleteMedicine
);

// Get All Medicines
pharmacyRouter.get(
    "/medicine",
    isAuthenticated,
    getAllMedicines
);

// Get Medicine By ID
pharmacyRouter.get(
    "/medicine/:id",
    isAuthenticated,
    isValid(getMedicineByIdValidation),
    getMedicineById
);


// ==========================================
// PRESCRIPTION ROUTES
// ==========================================

// Create Prescription (Doctors only)
pharmacyRouter.post(
    "/prescription",
    isAuthenticated,
    isAuthorized(["doctor"]),
    isValid(addPrescriptionValidation),
    createPrescription
);

// Dispense Prescription (Pharmacists / Admins only)
pharmacyRouter.put(
    "/prescription/:id/dispense",
    isAuthenticated,
    isAuthorized(["admin", "pharmacist"]),
    isValid(dispensePrescriptionValidation),
    dispensePrescription
);

// Get All Prescriptions (Employees only)
pharmacyRouter.get(
    "/prescription",
    isAuthenticated,
    isAuthorized(["admin", "doctor", "pharmacist"]),
    getAllPrescriptions
);

// Get Patient Prescriptions (Self or Employees)
pharmacyRouter.get(
    "/prescription/patient",
    isAuthenticated,
    getPatientPrescriptions
);

// Get Prescription By ID (Self or Employees)
pharmacyRouter.get(
    "/prescription/:id",
    isAuthenticated,
    isValid(getPrescriptionByIdValidation),
    getPrescriptionById
);

export default pharmacyRouter;
