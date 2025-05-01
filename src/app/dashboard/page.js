"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // <-- import router

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const router = useRouter(); // <-- initialize router

  const handleStartTranscription = () => {
    router.push("/transcription"); // <-- navigate to /transcription page
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 flex justify-between items-center">
        <div className="text-green-600 text-xl font-bold flex items-center">
          <span className="text-2xl mr-2"></span> TEJA
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-black dark:text-white"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:ml-50">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user.fullName || user.email}
        </h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => console.log("Start New Translation")}
          >
            Start New Translation
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleStartTranscription} // <-- handle click
          >
            Start New Transcription
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
          <div className="space-y-2">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between">
              <span>Document1</span>
              <span className="text-blue-500">English → Spanish</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between">
              <span>Document2</span>
              <span className="text-blue-500">Transcription</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between">
              <span>Document3</span>
              <span className="text-blue-500">French → English</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
