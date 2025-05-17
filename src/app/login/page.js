"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { motion } from "framer-motion";
import { ShieldOff, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.user) {
        if (data.user.isBlocked) {
          setShowBlockedModal(true);
          return;
        }

        dispatch(setUser(data.user));

        const rolePaths = {
          admin: "/admin/landingPage",
          candidate: "/candidate/landingPage",
          "quality-assurance": "/quality-assurance/landingPage",
        };

        const redirectPath = rolePaths[data.user.role?.toLowerCase()] || "/landingPage";

        toast.success("Logged in successfully!", { duration: 2000 });
        setTimeout(() => router.push(redirectPath), 1500);
      } else {
        toast.error(data.message || "❌ Wrong ID or password");
      }
    } catch (error) {
      setLoading(false);
      toast.error("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">

      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Blocked User Modal */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-filter backdrop-blur-lg text-center"
          >
            <ShieldOff className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Your account has been <span className="font-semibold text-red-500">blocked</span>.
              <br />Please contact the admin for further assistance.
            </p>
            <button
              onClick={() => setShowBlockedModal(false)}
              className="px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-xl border border-green-200"
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/images/teja-logo.jpg"
            alt="teja-logo"
            width={180}
            height={50}
            className="object-contain rounded-3xl"
          />
        </div>

        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Log In</h1>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="block w-full border border-gray-300 rounded-md py-3 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
              disabled={loading}
            />
          </div>

          {/* Password Field with Visibility Toggle */}
          <div className="mb-8 relative">
            <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="block w-full border border-gray-300 rounded-md py-3 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-green-300 pr-12"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-11 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button / Loader */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 mb-2"></div>
              <span className="text-green-600 font-medium">Logging in...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold text-lg py-3 px-6 rounded-md w-full hover:bg-green-700 transition duration-300 shadow-md hover:cursor-pointer"
            >
              Log In
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
