"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { motion } from "framer-motion";
import { ShieldOff, Eye, EyeOff, Sparkles } from "lucide-react";
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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/login-bg.png"
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Toast */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Blocked modal */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
          >
            <ShieldOff className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Your account has been <span className="font-semibold text-red-500">blocked</span>.
              <br />Please contact the admin for further assistance.
            </p>
            <button
              onClick={() => setShowBlockedModal(false)}
              className="px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Login Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-green-200"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/teja (5).png"
            alt="teja-logo"
            width={140}
            height={50}
            className="object-contain rounded-3xl"
          />
        </div>

        
         <h1 className="text-3xl font-bold text-center text-green-700 mb-2">Welcome</h1>
        <p className="text-center text-sm text-gray-600 mb-6">Please log in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Input with Floating Label */}
          <div className="relative">
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full border border-gray-300 rounded-md px-4 pt-6 pb-2 text-base text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Email"
              disabled={loading}
            />
            <label
              htmlFor="email"
              className="absolute left-5 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
            >
              Email address*
            </label>
          </div>



          {/* Password field with floating label */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="peer w-full border border-gray-300 rounded-md py-4 px-5 text-lg bg-transparent placeholder-transparent pr-12 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-5 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit button */}
          {loading ? (
            <div className="flex flex-col items-center py-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 mb-2"></div>
              <span className="text-green-600 font-medium">Logging in...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold text-lg py-3 rounded-md hover:bg-green-700 transition duration-300 shadow-md"
            >
              Log In
            </button>
          )}
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4 text-green-500 animate-pulse" />
            Powered by{" "}
            <span className="text-green-600 font-semibold not-italic hover:underline transition">
              Solvimate
            </span>
            <Sparkles className="h-4 w-4 text-green-500 animate-pulse" />
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
