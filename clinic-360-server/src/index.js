import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.connect.js";
import authRouter from "./routes/auth.route.js";
import doctorRouter from "./routes/doctor.route.js";
import userRouter from "./routes/user.route.js"
import { checkAuth, checkDoctorAuth } from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173","https://clinic-360.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(cookieParser());


app.use("/auth",authRouter);

app.use('/doctor',checkAuth,checkDoctorAuth,doctorRouter);

app.use("/user",checkAuth,userRouter);

app.use("/ping",(req,res)=>{
  return res.send("Pong")
})


app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log("App is listening on port ",process.env.PORT);
});
