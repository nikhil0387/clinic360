import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

const Doctor = () => {
  const { id } = useParams();
  const [doctorData, setDoctorData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const { getDoctorDetails, bookSlot } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDoctorDetails(id);
      setDoctorData(res);
    };
    fetchData();
  }, [getDoctorDetails, id]);

  const handleSlotClick = (slotId) => {
    setSelectedSlot(slotId);
    setShowConfirmation(true);
  };

  const handleBook = async () => {
    if (selectedSlot) {
      setIsBooking(true);
      setShowConfirmation(false);
      await bookSlot(selectedSlot);
      const updatedData = await getDoctorDetails(id);
      setDoctorData(updatedData);
      setIsBooking(false);
    }
  };

  if (!doctorData) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loader className="text-blue-500 size-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-[72px] relative">
      {isBooking && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center">
          <Loader className="text-blue-500 size-16" />
          <p className="mt-4 text-lg text-gray-300">Booking...</p>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">Confirm Booking</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to book this slot?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBook}
                className="px-4 py-2 rounded-lg cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-blue-400">{doctorData.data.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              <ProfileField label="Speciality" value={doctorData.data.speciality || 'General Practitioner'} />
              <ProfileField label="Experience" value={`${doctorData.data.experience} Years`} />
              <ProfileField label="Location" value={doctorData.data.location} />
              <ProfileField 
                label="Member Since" 
                value={new Date(doctorData.data.createdAt).toLocaleDateString()} 
              />
            </div>
          </div>
        </div>

        {Array.isArray(doctorData.slots) && doctorData.slots?.length > 0 ? (
  <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
    <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">Available Slots</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {doctorData.slots?.map((slot, index) => (
        <div
          key={index}
          className={`p-5 rounded-xl border transition-all transform duration-300 ${
            slot.isBooked
              ? 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-75'
              : 'bg-blue-500/10 border-blue-400/20 hover:bg-blue-500/30 hover:scale-105 cursor-pointer'
          }`}
          onClick={() => !slot.isBooked && handleSlotClick(slot._id)}
        >
          <div className="space-y-2 text-center">
            <p className="font-semibold text-blue-400 tracking-wide">
              {new Date(slot.date).toLocaleDateString()}
            </p>
            <p className="text-gray-300 font-light">
              {slot.startTime} - {slot.endTime}
            </p>
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium tracking-wide ${
              slot.isBooked
                ? 'bg-red-500/20 text-red-400'
                : 'bg-green-500/20 text-green-400'
            }`}>
              {slot.isBooked ? 'Booked' : 'Available'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="text-gray-400 text-lg text-center mt-4">No available slots</div>
)}

      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="space-y-1">
    <span className="text-gray-400">{label}:</span>
    <p className="font-medium">{value}</p>
  </div>
);

export default Doctor;