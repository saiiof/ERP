import { Appointment, User, Employee } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";

// ==========================================
// Book Appointment
// ==========================================
export const bookAppointment = async (req, res, next) => {
    let patientId;

    if (req.user.role === 'patient') {
        patientId = req.user._id;
    } else {
        // Staff booking on behalf of a patient
        patientId = req.body.patient;
        if (!patientId) {
            return next(new AppError("Patient ID is required when booking on behalf of a patient", 400));
        }
    }

    const { doctor, appointmentDate, timeSlot, reason } = req.body;

    // Check if patient exists
    const patientUser = await User.findById(patientId);
    if (!patientUser) {
        return next(new AppError("Patient not found", 404));
    }

    // Check if doctor exists and has the doctor role
    const doctorEmployee = await Employee.findById(doctor);
    if (!doctorEmployee) {
        return next(new AppError("Doctor not found", 404));
    }
    if (doctorEmployee.role !== 'doctor') {
        return next(new AppError("Selected employee is not a doctor", 400));
    }

    // Standardize appointment date to start of the day (YYYY-MM-DD)
    const dateObj = new Date(appointmentDate);
    dateObj.setUTCHours(0, 0, 0, 0);

    // Check if slot is already booked for this doctor (excluding cancelled appointments)
    const alreadyBooked = await Appointment.findOne({
        doctor,
        appointmentDate: dateObj,
        timeSlot,
        status: { $ne: 'cancelled' }
    });

    if (alreadyBooked) {
        return next(new AppError("This doctor is already booked for the selected time slot", 409));
    }

    const appointment = new Appointment({
        patient: patientId,
        doctor,
        appointmentDate: dateObj,
        timeSlot,
        reason
    });

    const created = await appointment.save();
    if (!created) {
        return next(new AppError("Failed to book appointment", 500));
    }

    return res.status(201).json({
        status: 'success',
        message: "Appointment booked successfully",
        data: created
    });
};

// ==========================================
// Update Appointment Status
// ==========================================
export const updateAppointmentStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new AppError("Appointment not found", 404));
    }

    // Role-based authorization check
    if (req.user.role === 'patient') {
        // Patients can only cancel their own appointments
        if (appointment.patient.toString() !== req.user._id.toString()) {
            return next(new AppError("You do not have permission to update this appointment", 403));
        }
        if (status !== 'cancelled') {
            return next(new AppError("Patients are only allowed to cancel their appointments", 400));
        }
    } else if (req.user.role === 'doctor') {
        // Doctors can only manage their own appointments
        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return next(new AppError("You do not have permission to update this appointment", 403));
        }
    } else if (!['admin', 'receptionist'].includes(req.user.role)) {
        // HR or other employees have no permission
        return next(new AppError("You do not have permission to update appointment status", 403));
    }

    appointment.status = status;
    const updated = await appointment.save();

    return res.status(200).json({
        status: 'success',
        message: `Appointment status updated to ${status}`,
        data: updated
    });
};

// ==========================================
// Add Clinical Notes (Assigned Doctor only)
// ==========================================
export const addAppointmentNotes = async (req, res, next) => {
    const { id } = req.params;
    const { notes } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new AppError("Appointment not found", 404));
    }

    // Only the assigned doctor can edit notes
    if (appointment.doctor.toString() !== req.user._id.toString()) {
        return next(new AppError("Only the assigned doctor can add notes to this appointment", 403));
    }

    appointment.notes = notes;
    const updated = await appointment.save();

    return res.status(200).json({
        status: 'success',
        message: "Clinical notes added successfully",
        data: updated
    });
};

// ==========================================
// Get Appointments (Filters based on role)
// ==========================================
export const getAppointments = async (req, res, next) => {
    const query = {};

    if (req.user.role === 'patient') {
        query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
        query.doctor = req.user._id;
    } else if (['admin', 'receptionist', 'hr'].includes(req.user.role)) {
        // Staff can optionally filter by doctor, patient, or status
        if (req.query.doctor) query.doctor = req.query.doctor;
        if (req.query.patient) query.patient = req.query.patient;
        if (req.query.status) query.status = req.query.status;
    } else {
        return next(new AppError("You do not have permission to view appointments", 403));
    }

    if (req.query.date) {
        const dateObj = new Date(req.query.date);
        dateObj.setUTCHours(0, 0, 0, 0);
        query.appointmentDate = dateObj;
    }

    const appointments = await Appointment.find(query)
        .populate("patient", "name email phone")
        .populate("doctor", "firstName lastName role position")
        .sort({ appointmentDate: 1, timeSlot: 1 });

    return res.status(200).json({
        status: 'success',
        data: appointments
    });
};

// ==========================================
// Get Appointment By ID
// ==========================================
export const getAppointmentById = async (req, res, next) => {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
        .populate("patient", "name email phone")
        .populate("doctor", "firstName lastName role position");

    if (!appointment) {
        return next(new AppError("Appointment not found", 404));
    }

    // Check permissions
    if (req.user.role === 'patient') {
        if (appointment.patient._id.toString() !== req.user._id.toString()) {
            return next(new AppError("You do not have permission to view this appointment", 403));
        }
    } else if (req.user.role === 'doctor') {
        if (appointment.doctor._id.toString() !== req.user._id.toString()) {
            return next(new AppError("You do not have permission to view this appointment", 403));
        }
    } else if (!['admin', 'receptionist', 'hr'].includes(req.user.role)) {
        return next(new AppError("You do not have permission to view this appointment", 403));
    }

    return res.status(200).json({
        status: 'success',
        data: appointment
    });
};
