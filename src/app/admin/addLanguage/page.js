"use client";
import { useState } from "react";

export default function AddLanguage() {
  const [language, setLanguage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    

    if (!language.trim()) {
      setError("Language name is required");
      return;
    }
    

    try {
      const response = await fetch("/api/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: language.trim() }),
      });

      if (response.ok) {
        setSuccess("✅ Language added successfully!");
        setLanguage("");
      } else {
        const data = await response.json();
        setError(data.message || "❌ Failed to add language");
      }
    } catch (err) {
      setError("❌ Something went wrong. Try again.");
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Language</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Enter language name"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {success && <p className="text-sm text-green-600 mt-1">{success}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition hover:cursor-pointer"
          >
            Add Language
          </button>
        </form>
      </div>
    </div>
  );
}
