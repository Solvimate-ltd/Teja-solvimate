'use client';

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import CardItem from "../../components/CardItem";

// Mock data
const mockTranslationData = [
  { id: 1, title: "English to Marathi (2)", date: "01/03/2026", count: "0/7360", fromLang: "English", toLang: "Marathi" },
  { id: 2, title: "French to Hindi (1)", date: "02/03/2026", count: "120/2000", fromLang: "French", toLang: "Hindi" },
];

const mockTranscriptionData = [
  { id: 1, title: "Transcribe Interview Audio", date: "04/03/2026", count: "500/5000", fromLang: "-", toLang: "-" },
  { id: 2, title: "Transcribe Podcast", date: "05/03/2026", count: "300/4000", fromLang: "-", toLang: "-" },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [cards, setCards] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    async function fetchTranslationTasks()
    {
      try
      {
        const response = await fetch("http://localhost:3000/api/employee/task");
        const data = await response.json();
        console.log(data);
      }
      catch(error)
      {
        console.log(error);
      }
    }

    if (activeSection === "translation") {
      // setCards(mockTranslationData);
      fetchTranslationTasks();
    } else if (activeSection === "transcription") {
      setCards(mockTranscriptionData);
    } else {
      setCards([]);
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.fullName || user?.email}</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`bg-green-600 text-white px-4 py-2 rounded transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-green-700 ${
            activeSection === "translation" ? "ring-2 ring-white" : ""
          } cursor-pointer`}
          onClick={() => setActiveSection("translation")}
        >
          Start New Translation
        </button>
        <button
          className={`bg-green-600 text-white px-4 py-2 rounded transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-green-700 ${
            activeSection === "transcription" ? "ring-2 ring-white" : ""
          } cursor-pointer`}
          onClick={() => setActiveSection("transcription")}
        >
          Start New Transcription
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
            <div className="space-y-4">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardItem
                    title={card.title}
                    date={card.date}
                    count={card.count}
                    fromLang={card.fromLang}
                    toLang={card.toLang}
                    onStatusClick={() => console.log("Status clicked:", card.title)}
                    onOpenClick={() => console.log("Open clicked:", card.title)}
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
