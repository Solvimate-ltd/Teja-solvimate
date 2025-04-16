// components/Login.js
"use client";
import Image from "next/image";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.user) {
          alert("User is existed but because further pages are not ready that's why you see this alert.");
        } else {
          alert("Invalid credentials or user does not exist.");
        }
      } else {
        alert("Error: " + response.statusText);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-gray-50 p-8 sm:p-12 rounded-2xl shadow-lg w-full max-w-xl">
        {/* Image Section */}
        <div className="flex justify-center mt-[-50px] mb-1">
          <Image
            src="/images/teja-logo.jpg"
            alt="teja-logo"
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
