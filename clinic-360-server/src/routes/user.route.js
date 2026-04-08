import express from "express"
import { bookSlot, cancelAppointment, getDoctorDetails, getMyAppointments, searchDoctor } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/search/doctor",searchDoctor)

router.get("/doctor/details/:doctorId",getDoctorDetails)

router.post("/bookSlot",bookSlot);

router.get("/myAppointments",getMyAppointments);

router.post("/cancelAppointment",cancelAppointment);

export default router