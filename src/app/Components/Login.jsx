// components/Login.js
"use client";
import Image from "next/image";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-white px-4 mt-[-60px]">
      <div className="bg-gray-50 p-8 sm:p-12 rounded-2xl shadow-lg w-full max-w-xl">
        {/* Image Section */}
        <div className="flex justify-center mt-[-50px] mb-1">
          <Image
            src="/teja_logo.jpg"
            alt="teja_logo"
            width={180}
            height={50}
            className="object-contain rounded-3xl"
          />
        </div>

        {/* Form Section */}
        <h1 className="text-4xl font-bold text-center text-black mb-6">
          Log in
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="block w-full border border-gray-300 rounded-md py-3 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="block w-full border border-gray-300 rounded-md py-3 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold text-lg py-3 px-6 rounded-md w-full hover:bg-green-500 transition duration-200"
          >
            Log in
          </button>
          <p className="mt-5 text-center">
            <a href="#" className="text-sm text-green-600 hover:underline">
              Forgot password?
            </a>
          </p>
          <p className="mt-3 text-center">
            <a href="#" className="text-sm text-gray-500 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
