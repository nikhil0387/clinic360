import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import Loader from "../components/Loader";

const Login = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password }, isDoctor);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-xl flex w-full max-w-4xl shadow-xl overflow-hidden">
        <div className="hidden md:block relative w-1/2">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-900/50" />
          <img
            src="/login.jpg"
            alt="Medical illustration"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-10 space-y-2 text-center">
            <h1 className="text-3xl font-bold text-blue-400">Clinic 360</h1>
            <p className="text-gray-400">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-700 rounded-lg placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-700 rounded-lg placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setIsDoctor(!isDoctor)}
            >
              <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors
                ${isDoctor ? 'bg-blue-400 border-blue-400' : 'border-gray-500 group-hover:border-gray-300'}`}>
                {isDoctor && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
              <span className="text-gray-300 group-hover:text-gray-100 transition-colors">
                Login as Doctor
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-12 cursor-pointer bg-blue-400 hover:bg-blue-500 rounded-lg font-medium text-gray-900 
                disabled:bg-blue-400/70 disabled:hover:bg-blue-400/70 transition-colors duration-200
                flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader className="w-5 h-5" />
                  <span>Authenticating...</span>
                </>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-400">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-blue-400 hover:text-blue-500 underline underline-offset-4 transition-colors"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;