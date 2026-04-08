import mongoose from "mongoose"

export const connectDB =  async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("Error connecting MongoDB",error?.message)
    }
}