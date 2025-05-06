"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

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
        dispatch(setUser(data.user));

        // ✅ Role-based redirect logic
        const rolePaths = {
          admin: "/admin/landingPage",
          candidate: "/candidate/landingPage",
          qa: "/qa/landingPage",
        };

        const redirectPath = rolePaths[data.user.role?.toLowerCase()] || "/landingPage";
        router.push(redirectPath);
      } else {
        setErrorMsg(data.message || "Wrong ID or password");
        setShowError(true);
        setTimeout(() => setShowError(false), 2500);
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg("Something went wrong. Try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white px-4">
      {/* Error Badge */}
      {errorMsg && (
        <div
          className={`rounded-xl fixed top-5 right-5 bg-red-500 text-white px-5 py-3 shadow-lg z-50 transition-transform duration-500 ease-in-out ${
            showError ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {errorMsg}
        </div>
      )}

      <div className="bg-gray-50 p-8 sm:p-12 rounded-2xl shadow-lg w-full max-w-xl">
        {/* Logo */}
        <div className="flex justify-center mt-[-50px] mb-1">
          <Image
            src="/images/teja-logo.jpg"
            alt="teja-logo"
            width={180}
            height={50}
            className="object-contain rounded-3xl"
          />
        </div>

        <h1 className="text-4xl font-bold text-center text-black mb-6">Log In</h1>

        <form onSubmit={handleSubmit}>
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

          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="block w-full border border-gray-300 rounded-md py-3 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
              disabled={loading}
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 mb-2"></div>
              <span className="text-green-600 font-medium">Please wait...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold text-lg py-3 px-6 rounded-md w-full hover:bg-green-500 transition duration-200"
            >
              Log in
            </button>
          )}

          <p className="mt-5 text-center">
            <a href="#" className="text-sm text-green-600 hover:underline">
              Forgot password?
            </a>
          </p>
          <p className="mt-3 text-center">
            <a href="/signup" className="text-green-600 hover:underline ml-1">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

