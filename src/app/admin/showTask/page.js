"use client";
import { useEffect, useState } from "react";
import TaskCard from "@/app/components/TaskCard";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // loader state

useEffect(() => {
  const baseURL =
    typeof window !== "undefined" && process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "";

  fetch(`${baseURL}/api/employee/service/translation/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Optional: include if using cookies/sessions
  })
    .then((res) => res.json())
    .then((data) => setTasks(data.tasks || []))
    .catch((err) => console.error("Failed to fetch tasks:", err))
    .finally(() => setLoading(false));
}, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-green-700 ">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Please wait...</p>
      </div>
    );
  }

  return (
    
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        Translation Tasks
      </h1>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        tasks.map((task) => <TaskCard key={task._id} task={task} />)
      )}
    </div>
    
  );
}
