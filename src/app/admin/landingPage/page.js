"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLandingPage() {
  const router = useRouter();

  const buttons = [
    { label: "Create Task", action: () => router.push("/admin/createTask") },
    { label: "Create User", action: () => router.push("/admin/createUser") },
    { label: "Manage Users", action: () => router.push("/admin/manageUser") },
    { label: "Add New Language", action: () => router.push("/admin/addLanguage") },
  ];

  // Testing Starts
  useEffect(() => {
    async function fetchAllTask() {
      alert("Open and see ouput in your console.")
      try {
        const response = await fetch("http://localhost:3000/api/employee/task/");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllTask();
  }, []);

  // Testing Ends
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-100 px-4 pt-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-10 text-center">
        Admin Panel
      </h1>

      <div className="grid gap-6 md:grid-cols-3 justify-center max-w-4xl mx-auto">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-green-500 active:scale-95 focus:outline-none text-lg font-medium hover:cursor-pointer"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
