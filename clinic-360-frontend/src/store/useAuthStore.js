import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  userAuth: null,
  isCheckingAuth: false,
  isLoggingIn: false,
  isSigningUp: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/checkAuth?doctor=true");
      set({ userAuth: res?.data?.data || null });
    } catch {
      try {
        const res2 = await axiosInstance.get("/auth/checkAuth");
        set({ userAuth: res2?.data?.data || null });
      } catch {
        set({ userAuth: null });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data, isDoctor = false) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post(
        `/auth/login${isDoctor ? "?doctor=true" : ""}`,
        data
      );
      set({ userAuth: res?.data?.data || null });
      toast.success("Logged in successfully");
    } catch (error) {
      set({ userAuth: null });
      toast.error(error?.response?.data?.message || "Failed to login");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ userAuth: res?.data?.data || null });
      toast.success("Signed Up Successfully");
    } catch (error) {
      set({ userAuth: null });
      toast.error(error?.response?.data?.message || "Sign-up failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  signUpDoctor: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/doctor/signup", data);
      set({ userAuth: res?.data?.data || null });
      toast.success("Signed Up Successfully");
    } catch (error) {
      set({ userAuth: null });
      toast.error(error?.response?.data?.message || "Sign-up failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({userAuth:null})
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error while logging out");
      toast.error(error.response.data.message);
    }
  },
}));
