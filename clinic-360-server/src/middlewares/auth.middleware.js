import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";

export const checkAuth = async (req, res, next) => {
  try {
    const isDoctorRoute = (req) => req.originalUrl.startsWith("/doctor");

    const isDoctor = req.query?.doctor === "true" || isDoctorRoute(req);

    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = isDoctor
      ? await Doctor.findById(decodedToken.userId).select("-password")
      : await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or token expired" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

export const checkDoctorAuth = async (req, res, next) => {
  if (!req.user.role === "doctor") {
    return res.status(401).json({
      message: "Unauthorized route",
    });
  }
  next();
};
