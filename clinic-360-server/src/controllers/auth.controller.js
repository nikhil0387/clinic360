import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import { generateAuthToken } from "../utils/helper.js";

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    if (name.length < 6 || name.length > 18) {
      return res.status(400).json({ message: "Name must be between 6 and 18 characters" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Weak password" });
    }

    const existingUser = await User.findOne({ email });
    const existingDoctor = await Doctor.findOne({email});

    if (existingUser || existingDoctor) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashPassword, name });

    generateAuthToken(newUser._id, res);
    return res.status(201).json({ message: "Registration successful", data: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userAuth = (req, res) => {
  return res.json({ message: "Authorized", data: req.user });
};

export const login = async (req, res) => {
  try {
    const isDoctor = req?.query?.doctor === "true";
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = isDoctor 
      ? await Doctor.findOne({ email }) 
      : await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateAuthToken(user._id, res);
    return res.status(200).json({ message: "Logged in successfully", data: user });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const doctorSignup = async (req, res) => {
  try {
    const { email, password, name, speciality, experience, location } = req.body;

    if (!email || !password || !name || !speciality || !experience || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    if (name.length < 6 || name.length > 18) {
      return res.status(400).json({ message: "Name must be between 6 and 18 characters" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Weak password" });
    }

    const existingUser = await User.findOne({ email });
    const existingDoctor = await Doctor.findOne({email});
    if (existingUser || existingDoctor) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await Doctor.create({
      email,
      password: hashPassword,
      name,
      speciality,
      role: "Doctor",
      experience,
      location,
    });

    generateAuthToken(newUser._id, res);
    return res.status(201).json({ message: "Registration successful", data: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
