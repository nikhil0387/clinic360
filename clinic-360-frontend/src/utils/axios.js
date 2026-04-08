import axios from "axios"

export const axiosInstance = axios.create({
    // baseURL:"http://localhost:5001",
    baseURL:"https://clinic360-server.onrender.com",
    withCredentials:true,
}) 