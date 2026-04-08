import React, { useEffect, useState } from "react";
import { BadgeCheck, Calendar, Clock, MapPin, User, X } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import Loader from "../components/Loader";

const Appointments = () => {
  const {
    myAppointments,
    getMyAppointments,
    cancelAppointment,
    setMyAppointments,
  } = useUserStore();
  const [cancelingId, setCancelingId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    if (!myAppointments) getMyAppointments();
  }, [myAppointments, getMyAppointments]);

  const handleCancel = async () => {
    if (cancelingId) {
      setIsCanceling(true);
      setShowCancelConfirm(false);
      await cancelAppointment(cancelingId);
      const updatedAppointments = myAppointments.filter(
        (item) => item._id !== cancelingId
      );
      setMyAppointments(updatedAppointments);
      setIsCanceling(false);
    }
  };

  if (!myAppointments)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader className="text-blue-500 size-12" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-[72px] relative">
      {isCanceling && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center">
          <Loader className="text-blue-500 size-16" />
          <p className="mt-4 text-lg text-gray-300">Canceling...</p>
        </div>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800  p-6 rounded-2xl border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">
              Confirm Cancellation
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg cursor-pointer bg-red-500 hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        {myAppointments.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No Appointments Found
          </div>
        ) : (
          myAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="group bg-gray-800 p-6 rounded-2xl border border-gray-700 relative hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <User className="text-blue-400 flex-shrink-0" size={24} />
                  <div>
                    <h2 className="text-xl font-bold text-blue-400">
                      {appointment.doctorId.name}
                    </h2>
                    <span
                      className={`mt-1 px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
                        appointment.status === "booked"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>
                </div>

                {appointment.status === "booked" && (
                  <button
                    onClick={() => {
                      setCancelingId(appointment._id);
                      setShowCancelConfirm(true);
                    }}
                    className="p-1.5 -mt-1 -mr-1 hover:bg-red-500/10 cursor-pointer rounded-lg transition-colors"
                  >
                    <X className="text-red-400 hover:text-red-300" size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                  <BadgeCheck className="text-blue-400 flex-shrink-0" size={20} />
                  <span>{appointment.doctorId.speciality}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="text-blue-400 flex-shrink-0" size={20} />
                  <span>{appointment.doctorId.location}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar
                      className="text-blue-400 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      {new Date(appointment.slot.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="text-blue-400 flex-shrink-0" size={20} />
                    <span>
                      {appointment.slot.startTime} - {appointment.slot.endTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
