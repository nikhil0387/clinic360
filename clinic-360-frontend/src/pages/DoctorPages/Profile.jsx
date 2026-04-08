import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, MoreVertical, X } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../../store/useUserStore";
import Loader from "../../components/Loader";

const Profile = () => {
  const { doctorData, getDoctorData, deleteSlot, updateSlots } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [showUpdateSlots, setShowUpdateSlots] = useState(false);
  const [deleteMenuIndex, setDeleteMenuIndex] = useState(null);
  const [slots, setSlots] = useState([]);

  const [availability, setAvailability] = useState({
    date: "everyday",
    customDates: [],
    singleDate: "",
    timeRange: { startTime: "", endTime: "" },
    slotInterval: 30,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDoctorData();
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getDoctorData]);

  useEffect(() => {
    if (doctorData?.slots) {
      setSlots(doctorData.slots);
    }
  }, [doctorData]);

  const toggleDeleteMenu = (id) => {
    setDeleteMenuIndex(deleteMenuIndex === id ? null : id);
  };

  const handleDeleteSlot = async (id) => {
    setSlots((prev) => prev.filter((slot) => slot._id !== id));
    await deleteSlot(id);
    setDeleteMenuIndex(null);
  };

  const handleChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (e) => {
    setAvailability({
      ...availability,
      timeRange: { ...availability.timeRange, [e.target.name]: e.target.value },
    });
  };

  const addCustomDate = () => {
    if (!availability.singleDate) return;
    if (availability.customDates.includes(availability.singleDate)) {
      return toast.error("Date already added");
    }
    setAvailability((prev) => ({
      ...prev,
      customDates: [...prev.customDates, availability.singleDate],
      singleDate: "",
    }));
  };

  const removeCustomDate = (date) => {
    setAvailability((prev) => ({
      ...prev,
      customDates: prev.customDates.filter((d) => d !== date),
    }));
  };

  const validateData = () => {
    const { startTime, endTime } = availability.timeRange;
    const slotInterval = parseInt(availability.slotInterval);
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    if (!startTime || !endTime || startTime >= endTime)
      return "Invalid time range";
    if (isNaN(slotInterval) || slotInterval < 10 || slotInterval > 360)
      return "Invalid slot interval (10-360 mins)";

    const validateDate = (dateString) => {
      const date = new Date(dateString);
      return date >= now && date <= nextWeek;
    };

    if (availability.date === "custom") {
      for (const date of availability.customDates) {
        if (!validateDate(date)) return "Dates must be within next 7 days";
      }
    }

    if (availability.date === "single") {
      if (!validateDate(availability.singleDate))
        return "Date must be within next 7 days";
      if (availability.singleDate === today) {
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const slotStartTime = new Date(now);
        slotStartTime.setHours(startHours, startMinutes, 0);

        if (slotStartTime < new Date(now.getTime() + 30 * 60000)) {
          return "Start time must be at least 30 minutes ahead";
        }
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validateData();
    if (error) return toast.error(error);

    const newSlot = {
      date:
        availability.date === "everyday"
          ? "everyday"
          : new Date().toISOString().split("T")[0],
      timeRange: {
        startTime: availability.timeRange.startTime,
        endTime: availability.timeRange.endTime,
      },
      slotInterval: availability.slotInterval || 30,
    };

    await updateSlots(newSlot);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-14" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 pt-[60px] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Doctor Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <ProfileField label="Name" value={doctorData?.data?.name} />
            <ProfileField label="Email" value={doctorData?.data?.email} />
            <ProfileField
              label="Speciality"
              value={doctorData?.data?.speciality}
            />
            <ProfileField
              label="Experience"
              value={`${doctorData?.data?.experience} years`}
            />
            <ProfileField label="Location" value={doctorData?.data?.location} />
            <ProfileField
              label="Member Since"
              value={new Date(doctorData?.data?.createdAt).toLocaleDateString()}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-6">
            Current Slots ({slots.length})
          </h3>
          <div className="flex overflow-x-auto pb-4 gap-4">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className={`flex-shrink-0 w-64 p-4 rounded-xl relative ${
                  slot.isBooked ? "bg-red-600" : "bg-green-600"
                }`}
              >
                <p className="font-medium">
                  {new Date(slot.date).toLocaleDateString()}
                </p>
                <p className="text-sm mt-2">
                  {slot.startTime} - {slot.endTime}
                </p>
                <span className="text-xs mt-2 inline-block px-2 py-1 rounded-full bg-black/20">
                  {slot.isBooked ? "Booked" : "Available"}
                </span>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleDeleteMenu(slot._id)}
                    className="text-white"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {deleteMenuIndex === slot._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded-lg shadow-lg">
                      <button
                        onClick={() => handleDeleteSlot(slot._id)}
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-600 rounded-lg"
                      >
                        Delete Slot
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-700 p-5 rounded-md flex items-center justify-between">
          <h3 className="text-2xl font-bold">
            Manage Availability{" "}
            <span className="text-lg">
              (This will remove all you available slots and assign new slots)
            </span>
          </h3>
          {showUpdateSlots ? (
            <ChevronUp
              onClick={() => setShowUpdateSlots(false)}
              className="cursor-pointer text-xl"
            />
          ) : (
            <ChevronDown
              onClick={() => setShowUpdateSlots(true)}
              className="cursor-pointer text-xl"
            />
          )}
        </div>

        {showUpdateSlots && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl space-y-6">
            <div className="space-y-4">
              <select
                name="date"
                value={availability.date}
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="everyday">Everyday</option>
                <option value="custom">Custom Dates</option>
                <option value="single">Single Date</option>
              </select>

              {availability.date === "custom" && (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="date"
                      name="singleDate"
                      value={availability.singleDate}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    <button
                      onClick={addCustomDate}
                      className="bg-green-500 hover:bg-green-600 px-6 rounded-xl transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availability.customDates.map((date) => (
                      <div
                        key={date}
                        className="bg-gray-700 px-4 py-2 rounded-xl flex items-center gap-2"
                      >
                        {date}
                        <X
                          className="cursor-pointer hover:text-red-400 transition-colors"
                          size={18}
                          onClick={() => removeCustomDate(date)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availability.date === "single" && (
                <input
                  type="date"
                  name="singleDate"
                  value={availability.singleDate}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  name="startTime"
                  value={availability.timeRange.startTime}
                  onChange={handleTimeChange}
                  className="p-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                  type="time"
                  name="endTime"
                  value={availability.timeRange.endTime}
                  onChange={handleTimeChange}
                  className="p-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <input
                type="number"
                name="slotInterval"
                value={availability.slotInterval}
                onChange={handleChange}
                min="10"
                max="360"
                className="w-full p-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Slot interval (minutes)"
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 py-4 rounded-xl font-medium transition-colors"
              >
                Save Availability
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="space-y-1">
    <span className="text-gray-400">{label}:</span>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

export default Profile;
