import React, { useEffect, useState } from "react";
import { Calendar, Clock, User } from "lucide-react";
import { useUserStore } from "../../store/useUserStore";
import Loader from "../../components/Loader";

const UpComingAppointments = () => {
  const { getDoctorAppointments } = useUserStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getDoctorAppointments();
      setData(res || []);
      setLoading(false);
    };
    getData();
  }, [getDoctorAppointments]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader className="text-blue-500 size-12" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-[72px]">
      <div className="max-w-3xl mx-auto space-y-6">
        {data.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No Upcoming Appointments
          </div>
        ) : (
          data.map((appointment) => (
            <div
              key={appointment._id}
              className="group bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <User className="text-blue-400 flex-shrink-0" size={24} />
                  <div>
                    <h2 className="text-xl font-bold text-blue-400">
                      {appointment.userId?.name || "Unknown"}
                    </h2>
                    <span className="mt-1 px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 bg-green-500/20 text-green-300">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="text-blue-400 flex-shrink-0" size={20} />
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

export default UpComingAppointments;
