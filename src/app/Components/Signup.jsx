"use client";
import { useState } from "react";
import Image from "next/image";


export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("✅ Validated Sign Up Data:", formData);
      // 👉 Send to backend or API route
    }
  };

  return (

      <div className="flex items-start justify-center min-h-screen bg-white px-4 mt-[-60px]">
        <div className="bg-gray-50 p-8 sm:p-12 rounded-2xl shadow-lg w-full max-w-xl">
         <div className="flex justify-center mt-[-50px] mb-1">
           <Image
             src="/teja_logo.jpg"
             alt="teja_logo"
             width={180}
             height={50}
             className="object-contain rounded-3xl"
           />
         </div>
          <h1 className="text-4xl font-bold text-center text-black mb-6">
            Sign Up
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md py-3 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md py-3 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md py-3 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md py-3 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Sign up
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?
            <a href="/login" className="text-green-600 hover:underline ml-1">
              Log in
            </a>
          </p>
        </div>
      </div>

  );
}
