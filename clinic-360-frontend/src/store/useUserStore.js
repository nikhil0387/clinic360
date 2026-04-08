import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  doctorData: null,
  myAppointments: null,

  getDoctorData: async () => {
    try {
      const res = await axiosInstance.get("/doctor/myData");
      set({ doctorData: res?.data });
    } catch (error) {
      set({ doctorData: null });
    }
  },

  getDoctorAppointments: async () => {
    try {
      const res = await axiosInstance.get("/doctor/getMyAppointments");
      return res?.data?.data;
    } catch (error) {
      console.log("Error while getting doctor appointments", error);
    }
  },

  searchDoctor: async (filters) => {
    try {
      const queryString = filters
        ? Object.entries(filters)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&")
        : "";

      const res = await axiosInstance.get(
        `/user/search/doctor${queryString ? `?${queryString}` : ""}`
      );

      return res?.data?.data;
    } catch (error) {
      return null;
    }
  },

  updateSlots: async (data) => {
    try {
      const res = await axiosInstance.post("/doctor/updateSlots", data);
      const res2 = await axiosInstance.get("/doctor/myData");
      set({ doctorData: res2?.data });
      toast.success("Slots updated successfully");
    } catch (error) {
      console.log("Error while updating slots", error);
      toast.error(error?.response?.data?.message);
    }
  },

  getDoctorDetails: async (id) => {
    try {
      const res = await axiosInstance.get(`/user/doctor/details/${id}`);
      return res?.data;
    } catch (error) {
      console.log("Error in getting doctor details");
      toast.error(error?.response?.data?.message);
    }
  },

  bookSlot: async (id) => {
    try {
      await axiosInstance.post("/user/bookSlot", { slotId: id });
      const res2 = await axiosInstance.get("/user/myAppointments");
      set({ myAppointments: res2?.data?.data });
      toast.success("Slot Booked successfully");
    } catch (error) {
      console.log("Error in booking slot");
      toast.error(error?.response?.data?.message);
    }
  },

  cancelAppointment: async (id) => {
    const { myAppointments } = get();
    try {
      await axiosInstance.post("/user/cancelAppointment", {
        appointmentId: id,
      });
      const updatedAppointments = myAppointments.filter(
        (item) => item._id !== id
      );
      set({ myAppointments: updatedAppointments });
      toast.success("Appointment cancelled");
    } catch (error) {
      console.log("Error in canceling appointment");
      toast.error(error?.response?.data?.message);
    }
  },

  setMyAppointments: (data) => {
    set({ myAppointments: data });
  },

  getMyAppointments: async () => {
    try {
      const res = await axiosInstance.get("/user/myAppointments");
      set({ myAppointments: res?.data?.data });
    } catch (error) {
      set({ myAppointments: null });
    }
  },

  deleteSlot: async (id) => {
    try {
      await axiosInstance.post("/doctor/removeSlot", { slotId: id });
      toast.success("Slot Removed successfully");
    } catch (error) {
      console.log("Error while deleting slot", error);
      toast.error(error?.response?.data?.message);
    }
  },
}));
