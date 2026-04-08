import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Calendar, LockKeyholeOpen } from "lucide-react";
import {useAuthStore} from "../store/useAuthStore.js"

const Header = () => {
    const {userAuth,logout} =useAuthStore();


    return (
        <header className="bg-gray-900 text-white fixed top-0 w-full shadow-lg z-50 py-3 px-6 flex items-center justify-between border-b border-gray-800">
            <Link 
                to="/" 
                className="text-2xl font-bold text-blue-400 hover:text-blue-500 transition-colors duration-300"
            >
                Clinic 360
            </Link>

            <nav className="flex items-center gap-6">
                {userAuth  && (
                    <Link 
                        to={ userAuth?.speciality ? "/doctor/appointments" :"/appointments"} 
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="hidden sm:block">My Appointments</span>
                    </Link>
                )}
                
                {userAuth?.speciality && (
                    <Link 
                        to="/profile" 
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
                    >
                        <User className="w-5 h-5" />
                        <span className="hidden sm:block">Profile</span>
                    </Link>
                )}

                {userAuth ? (
                    <button className="flex items-center  cursor-pointer gap-2 text-red-400 hover:text-red-500 transition-colors duration-300 text-sm font-medium" onClick={()=>logout()}>
                        <LogOut className="w-5 h-5" />
                        <span className="hidden sm:block">Logout</span>
                    </button>
                ) : (
                    <Link 
                        to="/login" 
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
                    >
                        <LockKeyholeOpen className="w-5 h-5" />
                        <span className="hidden sm:block">Login</span>
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;