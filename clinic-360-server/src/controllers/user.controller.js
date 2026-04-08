import mongoose from "mongoose";
import Doctor from "../models/doctor.model.js";
import Slot from "../models/slots.model.js";
import Appointment from "../models/appointment.model.js";
import { bookingCancelMail, bookingConfirmMail } from "../utils/mail.js";


export const searchDoctor = async (req, res) => {
  try {
    const allowedFields = ["speciality", "location", "name"];
    const query = {};

    Object.entries(req.query).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        query[key] = key === "name" ? new RegExp(`^${value}`, "i") : value;
      }
    });

    if (Object.keys(query).length === 0) {
      return res
        .status(400)
        .json({ message: "Please specify at least one field" });
    }

    const doctors = await Doctor.find(query).select("-password -email");
    res
      .status(200)
      .json({ message: "Doctors fetched successfully", data: doctors });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDoctorDetails = async (req, res) => {
  const { doctorId } = req.params;
  try {
    if (!mongoose.isValidObjectId(doctorId)) {
      return res.status(400).json({
        message: "Invalid Doctor Id",
      });
    }
    const doctor = await Doctor.findById(doctorId).select("-email -password");
    if (!doctor) {
      return res.status(400).json({
        message: "Doctor doesn't exist",
      });
    }
    const slots = await Slot.find({ doctorId });
    return res.status(200).json({
      message: "Doctor data fetched successfully",
      data: doctor,
      slots: slots.length > 0 ? slots : "No Available Slots",
    });
  } catch (error) {
    console.log("Error in getting doctor details", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const bookSlot = async (req, res) => {
  const { slotId } = req.body;
  const session = await mongoose.startSession();
  let transactionCommitted = false;

  session.startTransaction();

  try {
    if (!mongoose.isValidObjectId(slotId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid slot Id" });
    }

    const slot = await Slot.findById(slotId).session(session);
    if (!slot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Slot not found" });
    }

    if (slot.isBooked) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Slot Already Booked" });
    }

    const newAppointment = new Appointment({
      userId: req.user._id,
      doctorId: slot.doctorId,
      slot: slot._id,
      expiry: slot.expiry,
    });

    await newAppointment.save({ session });
    await Slot.findByIdAndUpdate(slotId, { isBooked: true }, { session });

    const doctorData = await newAppointment.populate(
      "doctorId",
      "name speciality experience location"
    );
    const slotData = await slot.populate();

    const appointmentData = { doctorData, slotData };

    await session.commitTransaction();
    transactionCommitted = true;
    session.endSession();

    await bookingConfirmMail(req.user.email, appointmentData);

    return res.status(200).json({
      message: "Appointment Booked Successfully",
      data: appointmentData,
    });
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
    console.log("Error in booking slot", error);
    session.endSession();
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.body;

  try {
    if (!mongoose.isValidObjectId(appointmentId)) {
      return res.status(400).json({ message: "Invalid Appointment Id" });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "name speciality experience location")
      .populate("slot");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Can cancel appointments of your own only" });
    }

    await Slot.findByIdAndUpdate(appointment.slot._id, { isBooked: false });
    await Appointment.findByIdAndDelete(appointmentId);
    await bookingCancelMail(req.user.email, appointment);

    return res
      .status(200)
      .json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.log("Error while canceling appointment", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appoiintments = await Appointment.find({ userId: req.user._id })
      .populate("doctorId", "speciality experience name location")
      .populate("slot");
    return res.status(200).json({
      message: "Appointments fetched successfully",
      data: appoiintments,
    });
  } catch (error) {
    console.log("Error while getting my appointment", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
