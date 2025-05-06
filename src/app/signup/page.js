"use client";
<<<<<<< HEAD
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

=======
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    languages: [],
  });

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [errors, setErrors] = useState({});
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Fetch languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/language");
        const data = await response.json();
        if (Array.isArray(data)) {
          setAvailableLanguages(data);
        }
      } catch (error) {
        console.error("Failed to fetch languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  // Close dropdown on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setLanguageDropdownOpen(false);
      }
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

  const handleLanguageToggle = (lang) => {
    setFormData((prev) => {
      const updated = prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: updated };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.name = "Name is required";
>>>>>>> c27bcbe (Adding new Files)
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
<<<<<<< HEAD

=======
>>>>>>> c27bcbe (Adding new Files)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
<<<<<<< HEAD

=======
>>>>>>> c27bcbe (Adding new Files)
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
<<<<<<< HEAD

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

=======
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    if (formData.languages.length < 2) {
      newErrors.languages = "Select at least 2 languages";
    }
    return newErrors;
  };

>>>>>>> c27bcbe (Adding new Files)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
<<<<<<< HEAD
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
          }),
=======
          body: JSON.stringify(formData),
>>>>>>> c27bcbe (Adding new Files)
        });

        const data = await response.json();

        if (response.ok) {
<<<<<<< HEAD
          alert("✅ User saved in DB successfully!");
          // Optionally reset the form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });

          window.location.href='./login';

        } else {
          alert(`❌ Failed to save user: ${data.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error during signup:", error);
        alert("❌ Something went wrong. Please try again later.");
=======
          alert("✅ User created successfully!");
          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
            languages: [],
          });
          router.push("/login");
        } else {
          alert(`❌ Failed: ${data.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("❌ Something went wrong. Try again.");
>>>>>>> c27bcbe (Adding new Files)
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-gray-50 p-8 sm:p-12 rounded-2xl shadow-lg w-full max-w-xl">
        <div className="flex justify-center mt-[-50px] mb-1">
          <Image
            src="/images/teja-logo.jpg"
            alt="teja-logo"
            width={180}
            height={50}
            className="object-contain rounded-3xl"
          />
        </div>
<<<<<<< HEAD
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
=======
        <h1 className="text-4xl font-bold text-center text-black mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-3 px-5 text-lg bg-white"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="candidate">Candidate</option>
            <option value="qa">QA</option>
          </select>
          {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}

          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setLanguageDropdownOpen((prev) => !prev)}
              className="cursor-pointer w-full border border-gray-300 rounded-md py-3 px-5 text-lg bg-white"
            >
              {formData.languages.length > 0
                ? formData.languages.join(", ")
                : "Select Languages"}
            </div>

            {languageDropdownOpen && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {availableLanguages.map((langObj) => (
                  <label
                    key={langObj.name}
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(langObj.name)}
                      onChange={() => handleLanguageToggle(langObj.name)}
                      className="mr-2"
                    />
                    {langObj.name}
                  </label>
                ))}
              </div>
            )}
            {errors.languages && (
              <p className="text-sm text-red-500 mt-1">{errors.languages}</p>
>>>>>>> c27bcbe (Adding new Files)
            )}
          </div>

          <button
            type="submit"
<<<<<<< HEAD
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

=======
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?
            <a href="/login" className="text-green-600 hover:underline ml-1">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
>>>>>>> c27bcbe (Adding new Files)
  );
}
