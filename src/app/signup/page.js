'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState([]);
  const [selectedLanguageNames, setSelectedLanguageNames] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    languages: [],
  });

  const [errors, setErrors] = useState({});
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/language');
        const data = await response.json();
        if (data.languages) {
          setAvailableLanguages(data.languages);
        }
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  // Close dropdown on click outside or Esc key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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
    if (!formData.fullName.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    if (formData.languages.length < 2) {
      newErrors.languages = 'Select at least 2 languages';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    console.log(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          alert('✅ User created successfully!');
          router.push('/login');
        } else {
          alert(`❌ Failed: ${data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('❌ Something went wrong. Try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg w-full max-w-xl border border-green-200">
        <div className="flex justify-center mt-[-50px] mb-1">
          <Image
            src="/images/teja-logo.jpg"
            alt="teja-logo"
            width={180}
            height={50}
            className="object-contain rounded-3xl"
          />
        </div>
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-md py-3 px-5 text-lg"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}

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

          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setLanguageDropdownOpen((prev) => !prev)}
              className="cursor-pointer w-full border border-green-300 rounded-md py-3 px-5 text-lg bg-white"
            >
              {selectedLanguageNames.length > 0
                ? selectedLanguageNames.join(', ')
                : 'Select Languages'}
            </div>

            {languageDropdownOpen && (
              <div className="absolute mt-2 w-full bg-white border border-green-300 rounded-md shadow-md z-10 max-h-60 overflow-y-auto">
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
              </div>
            )}
            {errors.languages && (
              <p className="text-sm text-red-500 mt-1">{errors.languages}</p>
            )}
          </div>

          <button
            type="submit"
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
  );
}
