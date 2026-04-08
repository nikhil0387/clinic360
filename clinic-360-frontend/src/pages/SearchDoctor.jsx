import React, { useState, useEffect, useCallback } from "react";
import { useUserStore } from "../store/useUserStore";
import { Link } from "react-router-dom";
import { Search, Loader2, MapPin, BriefcaseMedical } from "lucide-react";

const SearchDoctor = () => {
  const { searchDoctor } = useUserStore();
  const [query, setQuery] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [location, setLocation] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    const filters = {};
    if (query.trim()) filters.name = query.trim();
    if (speciality && speciality !== "All Specialties") filters.speciality = speciality;
    if (location && location !== "All Locations") filters.location = location;
    
    const result = await searchDoctor(filters);
    setDoctors(result || []);
    setLoading(false);
  };

  const debouncedSearch = useCallback(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(fetchDoctors, 500));
  }, [query, speciality, location]);

  useEffect(() => {
    debouncedSearch();
    return () => clearTimeout(debounceTimer);
  }, [query, speciality, location]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-[72px]">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-blue-400" size={20} />
          <input
            type="text"
            placeholder="Search doctors by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-800 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <BriefcaseMedical className="absolute left-4 top-3.5 text-blue-400" size={20} />
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-800 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="All Specialties">All Specialties</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dentist">Dentist</option>
              <option value="Neurologist">Neurologist</option>
            </select>
          </div>

          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 text-blue-400" size={20} />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-800 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="All Locations">All Locations</option>
              <option value="Meerut">Meerut</option>
              <option value="Delhi">Delhi</option>
              <option value="Noida">Noida</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : doctors.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No doctors found</p>
          ) : (
            doctors.map((doctor) => (
              <Link
                key={doctor._id}
                to={`/doctor/${doctor._id}`}
                className="block p-6 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{doctor.name}</h3>
                    <p className="text-blue-400 mt-1">{doctor.speciality || "General Practitioner"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin size={16} />
                      {doctor.location}
                    </p>
                    {doctor.experience && (
                      <p className="text-sm text-gray-400 mt-1">
                        {doctor.experience} YOE
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDoctor;
