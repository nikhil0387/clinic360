import Slot from "../models/slots.model.js";
import Doctor from "../models/doctor.model.js";
import validator from "validator";
import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";

export const updateData = async (req, res) => {
  const { name, speciality, experience, location } = req.body;
  const doctor = req.user;
  try {
    if (name && (name.length < 6 || name.length > 18)) {
      return res
        .status(400)
        .json({ message: "Name must be between 6 and 18 characters" });
    }
    if (name) doctor.name = name;
    if (speciality) doctor.speciality = speciality;
    if (experience) doctor.experience = experience;
    if (location) doctor.location = location;

    await doctor.save();

    return res.status(200).json({
      message: "Data updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log("Error in updating doctor data", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removeSlot = async (req, res) => {
  const { slotId } = req.body;

  try {
    if (!mongoose.isValidObjectId(slotId)) {
      return res.status(400).json({ message: "Invalid Slot Id" });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found to delete" });
    }

    if (slot.doctorId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized action" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: "Cannot delete a booked slot" });
    }

    await Slot.findByIdAndDelete(slotId);

    return res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    console.log("Error in deleting slot", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate("userId", "name")
      .populate("slot");

    return res.status(200).json({
      message: "Appointments fetched successfully",
      data:appointments,
    });
  } catch (error) {
    console.log("Error while fetching appointments", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMyData = async (req, res) => {
  const slots = await Slot.find({ doctorId: req.user._id.toString() });

  return res.status(200).json({
    message: "Data fetched successfully",
    data: req.user,
    slots,
  });
};

export const updateSlots = async (req, res) => {
  try {
    const doctorId = req.user?._id?.toString();
    let { date, timeRange, slotInterval } = req.body;

    if (!doctorId || !validator.isMongoId(doctorId))
      return res.status(400).json({ message: "Invalid doctor ID" });

    const isDateRange = Array.isArray(date) && date.length > 0;
    const isEveryday = date === "everyday";

    if (!isDateRange && !isEveryday && !validator.isISO8601(date))
      return res.status(400).json({ message: "Invalid date format" });

    if (
      !validator.matches(timeRange.startTime, /^([01]\d|2[0-3]):([0-5]\d)$/) ||
      !validator.matches(timeRange.endTime, /^([01]\d|2[0-3]):([0-5]\d)$/)
    )
      return res
        .status(400)
        .json({ message: "Invalid time format (HH:mm required)" });

    if (
      slotInterval &&
      !validator.isInt(slotInterval.toString(), { min: 5, max: 120 })
    )
      return res
        .status(400)
        .json({ message: "Slot interval should be between 5 and 120 minutes" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const formatTime = (hours, minutes) => {
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )} ${ampm}`;
    };

    const generateSlots = (date) => {
      let slots = [];
      let [startHour, startMin] = timeRange.startTime.split(":").map(Number);
      let [endHour, endMin] = timeRange.endTime.split(":").map(Number);

      let currentTime = new Date(date);
      currentTime.setHours(startHour, startMin, 0, 0);

      let endTime = new Date(date);
      endTime.setHours(endHour, endMin, 0, 0);

      if (!slotInterval) {
        slots.push({
          doctorId,
          date,
          startTime: formatTime(startHour, startMin),
          endTime: formatTime(endHour, endMin),
          expiry: endTime,
        });
      } else {
        while (currentTime < endTime) {
          let start = formatTime(
            currentTime.getHours(),
            currentTime.getMinutes()
          );
          let slotExpiry = new Date(currentTime);
          currentTime.setMinutes(currentTime.getMinutes() + slotInterval);
          let end = formatTime(
            currentTime.getHours(),
            currentTime.getMinutes()
          );

          if (currentTime <= endTime)
            slots.push({
              doctorId,
              date,
              startTime: start,
              endTime: end,
              expiry: slotExpiry,
            });
        }
      }
      return slots;
    };

    let dates = [];
    if (isEveryday) {
      let today = new Date();
      for (let i = 0; i < 7; i++) {
        dates.push(
          new Date(today.setDate(today.getDate() + (i === 0 ? 0 : 1)))
            .toISOString()
            .split("T")[0]
        );
      }
    } else if (isDateRange) {
      dates = date.slice(0, 7);
    } else {
      dates = [date];
    }

    await Slot.deleteMany({ doctorId });

    let allSlots = [];
    for (let d of dates) {
      allSlots.push(...generateSlots(d));
    }

    await Slot.insertMany(allSlots);
    res.json({ message: "Slots updated successfully", slots: allSlots });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
