import express from "express"
import { doctorSignup, login, logout, signup, userAuth } from "../controllers/auth.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.get("/checkAuth",checkAuth,userAuth);

router.post("/doctor/signup",doctorSignup);

router.post("/doctor/login",login);

router.post("/doctor/logout",logout);


export default router