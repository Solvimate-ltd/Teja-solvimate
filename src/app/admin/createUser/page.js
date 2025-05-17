"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const dropdownRef = useRef(null);

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState([]);
  const [selectedLanguageNames, setSelectedLanguageNames] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    languages: [],
  });

  const [errors, setErrors] = useState({});
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/language");
        const data = await response.json();
        if (data.languages) setAvailableLanguages(data.languages);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setLanguageDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLanguageToggle = (langObj) => {
    const alreadySelected = selectedLanguageIds.includes(langObj._id);
    let updatedIds = [];
    let updatedNames = [];

    if (alreadySelected) {
      updatedIds = selectedLanguageIds.filter((id) => id !== langObj._id);
      updatedNames = selectedLanguageNames.filter((name) => name !== langObj.language);
    } else {
      updatedIds = [...selectedLanguageIds, langObj._id];
      updatedNames = [...selectedLanguageNames, langObj.language];
    }

    setSelectedLanguageIds(updatedIds);
    setSelectedLanguageNames(updatedNames);
    setFormData((prev) => ({ ...prev, languages: updatedIds }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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
    if (!formData.role) newErrors.role = "Role is required";
    if (formData.languages.length < 2) newErrors.languages = "Select at least 2 languages";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("✅ User created successfully!");
          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
            languages: [],
          });
          setSelectedLanguageIds([]);
          setSelectedLanguageNames([]);
        } else {
          toast.error(`❌ Failed: ${data.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error("❌ Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4">
      <Toaster position="top-right" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white bg-opacity-90 p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl backdrop-filter backdrop-blur-lg"
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

        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          Create New User
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-green-300 rounded-md py-3 px-5 text-lg pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-green-300 rounded-md py-3 px-5 text-lg pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}

          {/* Role Select */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-md py-3 px-5 text-lg bg-white"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="candidate">Candidate</option>
            <option value="quality-assurance">QA</option>
          </select>
          {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}

          {/* Language Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setLanguageDropdownOpen((prev) => !prev)}
              className="cursor-pointer w-full border border-green-300 rounded-md py-3 px-5 text-lg bg-white"
            >
              {selectedLanguageNames.length > 0
                ? selectedLanguageNames.join(", ")
                : "Select Languages"}
            </div>

            {languageDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute mt-2 w-full bg-white border border-green-300 rounded-md shadow-md z-10 max-h-60 overflow-y-auto"
              >
                {availableLanguages.map((langObj) => (
                  <label
                    key={langObj._id}
                    className="flex items-center px-4 py-2 hover:bg-green-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLanguageIds.includes(langObj._id)}
                      onChange={() => handleLanguageToggle(langObj)}
                      className="mr-2 accent-green-600"
                    />
                    {langObj.language}
                  </label>
                ))}
              </motion.div>
            )}
            {errors.languages && (
              <p className="text-sm text-red-500 mt-1">{errors.languages}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition hover:cursor-pointer shadow-md"
          >
            Create User
          </button>
        </form>
      </motion.div>
    </div>
  );
}
