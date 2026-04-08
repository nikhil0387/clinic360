import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Briefcase, MapPin, Calendar } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

const SignUpDoctor = () => {
  const { signUpDoctor, isSigningUp } = useAuthStore();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    speciality: "", 
    experience: "", 
    location: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.speciality || !form.experience || !form.location) return toast.error("All fields are required");
    if (form.name.length < 6 || form.name.length > 18) return toast.error("Name must be between 6 and 18 characters");
    if (!validateEmail(form.email)) return toast.error("Invalid email format");
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    if (form.experience < 0) return toast.error("Experience cannot be negative");
    await signUpDoctor({ name: form.name, email: form.email, password: form.password, speciality: form.speciality, experience: form.experience, location: form.location });
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-[60px] flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Doctor Registration</h1>
            <p className="text-gray-400">Join our medical professional network</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-white">
            <div className="space-y-5">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Professional Email"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  name="speciality"
                  placeholder="Medical Speciality"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                  value={form.speciality}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="number"
                  name="experience"
                  placeholder="Years of Experience"
                  min="0"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  name="location"
                  placeholder="Practice Location"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create Password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSigningUp}
            >
              {isSigningUp && <Loader className="w-5 h-5 animate-spin" />}
              {isSigningUp ? "Registering..." : "Complete Registration"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Existing account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Login Here
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden md:block  relative">
          <img 
            src="/login.jpg" 
            alt="Medical professionals" 
            className="w-full h-full object-cover mix-blend-multiply opacity-60" 
          />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center text-white space-y-4">
              <h2 className="text-4xl font-bold">Medical Excellence</h2>
              <p className="text-lg text-blue-100">Join our network of trusted healthcare providers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpDoctor;