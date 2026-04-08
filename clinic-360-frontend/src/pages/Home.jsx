import React from 'react';
import { Stethoscope, Calendar, UserCircle, HeartPulse, Brain, BriefcaseMedical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Home = () => {
    const {userAuth} = useAuthStore();
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <section className="py-20 flex flex-col-reverse md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 text-center md:text-left mt-10 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Your Health, Our Priority <span className="text-blue-400">360° Care</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Connect with expert doctors and experience personalized healthcare like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
              to={userAuth ? "/search":"login"} className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-4 rounded-lg transition duration-300 flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Link>
              <Link
              to={userAuth ? "/search":"/login"}
               className="border border-blue-500 hover:bg-blue-800 text-blue-500 hover:text-white font-medium px-8 py-4 rounded-lg transition duration-300 flex items-center justify-center">
                <UserCircle className="w-5 h-5 mr-2" />
                {!userAuth && <span>Patient Login</span>}
                {userAuth && <span>Search Doctors</span>}

              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img src="./Doctor1.png" alt="Healthcare team" className="w-10/12" />
          </div>
        </section>
        <section className="py-16 grid gap-8 md:grid-cols-3">
          <div className="bg-gray-800 hover:shadow-2xl transition-shadow duration-300 p-8 rounded-xl text-center">
            <HeartPulse className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">100+ Specialities</h3>
            <p className="text-gray-300">Expert care across multiple disciplines.</p>
          </div>
          <div className="bg-gray-800 hover:shadow-2xl transition-shadow duration-300 p-8 rounded-xl text-center">
            <Brain className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-300">AI-powered recommendations for optimal care.</p>
          </div>
          <div className="bg-gray-800 hover:shadow-2xl transition-shadow duration-300 p-8 rounded-xl text-center">
            <BriefcaseMedical className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Emergency Care</h3>
            <p className="text-gray-300">24/7 urgent support when you need it most.</p>
          </div>
        </section>
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-10">About Clinic 360</h2>
          <div className="bg-gray-800 rounded-xl shadow-2xl p-10">
            <p className="text-gray-300 text-lg leading-relaxed">
              Clinic 360 is dedicated to providing comprehensive healthcare services. Our mission is to deliver personalized and state-of-the-art care in a compassionate environment. Our team of expert doctors and healthcare professionals is committed to your well-being, ensuring you receive timely and effective treatment.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center justify-center">
                <Stethoscope className="w-10 h-10 text-blue-400 mr-3" />
                <span className="text-xl font-semibold">Expert Doctors</span>
              </div>
              <div className="flex items-center justify-center">
                <Calendar className="w-10 h-10 text-blue-400 mr-3" />
                <span className="text-xl font-semibold">Timely Appointments</span>
              </div>
              <div className="flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-blue-400 mr-3" />
                <span className="text-xl font-semibold">Personalized Care</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
