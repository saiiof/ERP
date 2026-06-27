import slugify from "slugify";
import { Medicine, Prescription, User } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";

// ==========================================
// MEDICINE CONTROLLERS
// ==========================================

// Add Medicine
export const addMedicine = async (req, res, next) => {
    const { name, description, quantity, price, expiryDate } = req.body;

    const slug = slugify(name, { lower: true });

    // Check duplicate name
    const existing = await Medicine.findOne({ slug });
    if (existing) {
        return next(new AppError("Medicine with this name already exists", 409));
    }

    const status = quantity > 0 ? "available" : "outOfStock";

    const medicine = new Medicine({
        name,
        slug,
        description,
        quantity,
        price,
        expiryDate,
        status,
        addedBy: req.user._id
    });

    const created = await medicine.save();
    if (!created) {
        return next(new AppError("Failed to create medicine", 500));
    }

    return res.status(201).json({
        status: "success",
        message: "Medicine added successfully",
        data: created
    });
};

// Update Medicine
export const updateMedicine = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, quantity, price, expiryDate } = req.body;

    const updateData = {};
    if (name) {
        const slug = slugify(name, { lower: true });
        const existing = await Medicine.findOne({ slug, _id: { $ne: id } });
        if (existing) {
            return next(new AppError("Medicine with this name already exists", 409));
        }
        updateData.name = name;
        updateData.slug = slug;
    }

    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;

    if (quantity !== undefined) {
        updateData.quantity = quantity;
        updateData.status = quantity > 0 ? "available" : "outOfStock";
    }

    const updated = await Medicine.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
        return next(new AppError("Medicine not found", 404));
    }

    return res.status(200).json({
        status: "success",
        message: "Medicine updated successfully",
        data: updated
    });
};

// Delete Medicine
export const deleteMedicine = async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Medicine.findByIdAndDelete(id);
    if (!deleted) {
        return next(new AppError("Medicine not found", 404));
    }

    return res.status(200).json({
        status: "success",
        message: "Medicine deleted successfully",
        data: deleted
    });
};

// Get All Medicines
export const getAllMedicines = async (req, res, next) => {
    const medicines = await Medicine.find().populate("addedBy", "firstName lastName role");
    return res.status(200).json({
        status: "success",
        data: medicines
    });
};

// Get Medicine By ID
export const getMedicineById = async (req, res, next) => {
    const { id } = req.params;

    const medicine = await Medicine.findById(id).populate("addedBy", "firstName lastName role");
    if (!medicine) {
        return next(new AppError("Medicine not found", 404));
    }

    return res.status(200).json({
        status: "success",
        data: medicine
    });
};


// ==========================================
// PRESCRIPTION CONTROLLERS
// ==========================================

// Create Prescription (by Doctor)
export const createPrescription = async (req, res, next) => {
    const { patient, medicines } = req.body;

    // Check if patient exists
    const patientUser = await User.findById(patient);
    if (!patientUser) {
        return next(new AppError("Patient not found", 404));
    }

    // Verify all medicines exist
    for (const item of medicines) {
        const med = await Medicine.findById(item.medicine);
        if (!med) {
            return next(new AppError(`Medicine with ID ${item.medicine} not found`, 404));
        }
    }

    const prescription = new Prescription({
        patient,
        doctor: req.user._id,
        medicines,
        status: "pending"
    });

    const created = await prescription.save();
    if (!created) {
        return next(new AppError("Failed to create prescription", 500));
    }

    return res.status(201).json({
        status: "success",
        message: "Prescription created successfully",
        data: created
    });
};

// Dispense Prescription (by Pharmacist / Admin)
export const dispensePrescription = async (req, res, next) => {
    const { id } = req.params;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
        return next(new AppError("Prescription not found", 404));
    }

    if (prescription.status !== "pending") {
        return next(new AppError(`Prescription is already ${prescription.status}`, 400));
    }

    // Check stock for all medicines in the prescription
    for (const item of prescription.medicines) {
        const med = await Medicine.findById(item.medicine);
        if (!med) {
            return next(new AppError(`Medicine in prescription not found in inventory`, 404));
        }
        if (med.quantity < item.quantity) {
            return next(new AppError(`Insufficient stock for medicine: ${med.name} (Available: ${med.quantity}, Required: ${item.quantity})`, 400));
        }
    }

    // Deduct stock and update status
    for (const item of prescription.medicines) {
        const med = await Medicine.findById(item.medicine);
        med.quantity -= item.quantity;
        med.status = med.quantity > 0 ? "available" : "outOfStock";
        await med.save();
    }

    prescription.status = "dispensed";
    prescription.dispensedBy = req.user._id;
    prescription.dispensedAt = new Date();
    await prescription.save();

    const result = await Prescription.findById(id)
        .populate("patient", "name email phone")
        .populate("doctor", "firstName lastName role")
        .populate("medicines.medicine", "name price")
        .populate("dispensedBy", "firstName lastName role");

    return res.status(200).json({
        status: "success",
        message: "Prescription dispensed successfully and inventory updated",
        data: result
    });
};

// Get All Prescriptions (Employees only)
export const getAllPrescriptions = async (req, res, next) => {
    const prescriptions = await Prescription.find()
        .populate("patient", "name email phone")
        .populate("doctor", "firstName lastName role")
        .populate("medicines.medicine", "name price")
        .populate("dispensedBy", "firstName lastName role");

    return res.status(200).json({
        status: "success",
        data: prescriptions
    });
};

// Get Prescription By ID
export const getPrescriptionById = async (req, res, next) => {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
        .populate("patient", "name email phone")
        .populate("doctor", "firstName lastName role")
        .populate("medicines.medicine", "name price")
        .populate("dispensedBy", "firstName lastName role");

    if (!prescription) {
        return next(new AppError("Prescription not found", 404));
    }

    // Patients can only view their own prescriptions
    if (req.user.role === "patient" && prescription.patient._id.toString() !== req.user._id.toString()) {
        return next(new AppError("You do not have permission to view this prescription", 403));
    }

    return res.status(200).json({
        status: "success",
        data: prescription
    });
};

// Get Patient Prescriptions
export const getPatientPrescriptions = async (req, res, next) => {
    let patientId;

    if (req.user.role === "patient") {
        patientId = req.user._id;
    } else {
        patientId = req.query.patientId;
        if (!patientId) {
            return next(new AppError("Patient ID query parameter is required for employees", 400));
        }
    }

    const prescriptions = await Prescription.find({ patient: patientId })
        .populate("patient", "name email phone")
        .populate("doctor", "firstName lastName role")
        .populate("medicines.medicine", "name price")
        .populate("dispensedBy", "firstName lastName role");

    return res.status(200).json({
        status: "success",
        data: prescriptions
    });
};
