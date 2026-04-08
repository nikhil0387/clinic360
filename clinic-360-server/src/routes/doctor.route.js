import express from 'express'
import { getMyAppointments, getMyData, removeSlot, updateData, updateSlots } from '../controllers/doctor.controller.js';

const router = express.Router();

router.get("/myData",getMyData);

router.patch("/updateData",updateData);

router.post("/updateSlots",updateSlots);

router.post("/removeSlot",removeSlot);

router.get("/getMyAppointments",getMyAppointments);



export default router;