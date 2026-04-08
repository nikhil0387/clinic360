import React from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  Appointments,
  Doctor,
  DoctorAppointments,
  Error,
  Footer,
  Header,
  Home,
  Loader,
  Login,
  Profile,
  SearchDoctor,
  Signup,
  SignUpDoctor,
} from "./pages";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const { userAuth, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !userAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-20" />
      </div>
    );
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!userAuth ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!userAuth ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/signup-doctor"
          element={!userAuth ? <SignUpDoctor /> : <Navigate to="/" />}
        />
        <Route
          path="/search"
          element={userAuth ? <SearchDoctor /> : <Navigate to="/" />}
        />
        <Route
          path="/doctor/:id"
          element={userAuth ? <Doctor /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={userAuth?.speciality ? <Profile /> : <Navigate to="/" />}
        />

        <Route
          path="/doctor/appointments"
          element={
            userAuth?.speciality ? <DoctorAppointments /> : <Navigate to="/" />
          }
        />
        <Route
          path="/appointments"
          element={userAuth ? <Appointments /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
      <Toaster />
    </div>
  );
};

export default App;
