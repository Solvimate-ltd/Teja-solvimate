"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function AddLanguage() {
  const [language, setLanguage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
        toast.success("Language added successfully!");
        setLanguage("");
      } else {
        const data = await response.json();
        setError(data.message || "❌ Failed to add language");
        toast.error(data.message || "❌ Failed to add language");
      }
    } catch (err) {
      setError("❌ Something went wrong. Try again.");
      toast.error("❌ Something went wrong. Try again.");
      console.error("Error:", err);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            fontWeight: "500",
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-50 px-4"
      >
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-green-200">
          <h2 className="text-4xl font-extrabold mb-8 text-center text-green-800 tracking-wide">
            Add New Language
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter language name"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg placeholder-green-400 focus:outline-none focus:ring-4 focus:ring-green-400 focus:border-transparent transition duration-300"
              />
              {error && (
                <p className="text-sm text-red-600 mt-2 select-none">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 active:scale-95 transition-transform duration-150 shadow-lg hover:cursor-pointer"
            >
              Add Language
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
