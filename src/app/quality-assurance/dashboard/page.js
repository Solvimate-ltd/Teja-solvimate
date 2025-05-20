'use client';

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import CardItem from "../../components/CardItem";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    async function fetchTranslationTasks() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/employee/service/translation/");
        const data = await response.json();
        setCards(data.tasks || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    }

    if (activeSection === "translation") {
      fetchTranslationTasks();
    } else if (activeSection === "transcription") {
      setCards([]); // Replace with mock if needed
    } else {
      setCards([]);
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 bg-gradient-to-br dark:text-white from-green-50 to-green-100 px-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.fullName || user?.email}</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`bg-green-600 text-white px-4 py-2 rounded transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-green-700 ${
            activeSection === "translation" ? "ring-2 ring-white" : ""
          } cursor-pointer`}
          onClick={() => setActiveSection("translation")}
        >
          Review Translations
        </button>
        <button
          className={`bg-green-600 text-white px-4 py-2 rounded transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-green-700 ${
            activeSection === "transcription" ? "ring-2 ring-white" : ""
          } cursor-pointer`}
          onClick={() => setActiveSection("transcription")}
        >
          Review Transcriptions
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4 min-h-[200px]">
              {/* Loading State */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-green-600 text-xl font-semibold animate-pulse py-10"
                >
                  Loading tasks...
                </motion.div>
              )}

              {/* No Tasks */}
              {!loading && cards.length === 0 && (
                <motion.div
                  key="no-tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center text-gray-500 text-lg font-medium py-10"
                >
                  🎉 No tasks available at the moment.
                </motion.div>
              )}

              {/* Task Cards */}
              {!loading &&
                cards.map((card) => (
                  <motion.div
                    key={card._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardItem
                      task={card}
                      onStatusClick={() => console.log("Status clicked:", card.taskName)}
                      onOpenClick={() => console.log("Open clicked:", card.taskName)}
                    />
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
