'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

/**
 * Format ISO date string to DD/MM/YYYY format.
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB');
}

export default function CandidateTaskPage(paramsPromise) {
  const { id } = paramsPromise.params;
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [error, setError] = useState(false);
  const [translations, setTranslations] = useState({});
  const [visibleSentences, setVisibleSentences] = useState([]);

  const STORAGE_KEY = `candidate-task-translations-${id}`;

  // Fetch task on mount
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/employee/candidate/service/translation/${id}`);
        if (!res.ok) throw new Error('Task not found');
        const data = await res.json();
        setTask(data.task);
        setVisibleSentences(data.task.sentences);

        const savedTranslations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        setTranslations(savedTranslations);
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError(true);
      }
    };

    fetchTask();
  }, [id]);

  // Handle user input change
  const handleTranslationChange = (sentenceId, value) => {
    setTranslations(prev => {
      const updated = { ...prev, [sentenceId]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Done click
  const handleDone = async (sentenceId) => {
    const translatedSentence = translations[sentenceId];
    if (!translatedSentence || translatedSentence.trim() === '') return;

    try {
      const res = await fetch(`http://localhost:3000/api/employee/candidate/service/translation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: sentenceId, translatedSentence }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      // Remove from UI
      setVisibleSentences(prev => prev.filter(sentence => sentence._id !== sentenceId));

      // Remove from state and localStorage
      setTranslations(prev => {
        const updated = { ...prev };
        delete updated[sentenceId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      toast.success('Translation submitted successfully!');
    } catch (error) {
      console.error('Error submitting translation:', error);
      toast.error('Failed to submit translation.');
    }
  };

  if (error) {
    return <div className="p-6 text-center text-red-600">Task not found or an error occurred.</div>;
  }

  if (!task) {
    return <div className="p-6 text-center text-green-700">Loading task...</div>;
  }

  const { taskName, deadLine, fromLanguage, toLanguage } = task;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl shadow p-6 border border-green-200 sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-green-700 mb-2">{taskName}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
          <p><strong>From:</strong> {fromLanguage}</p>
          <p><strong>To:</strong> {toLanguage}</p>
          <p><strong>Deadline:</strong> {formatDate(deadLine)}</p>
        </div>
      </div>

      {/* Sentences */}
      <div className="space-y-4">
        {visibleSentences.map((sentence) => (
          <div
            key={sentence._id}
            className="bg-white border border-green-300 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex-1 space-y-2">
              {/* Original sentence */}
              <label className="block text-sm text-green-800 font-medium">Original Sentence</label>
              <textarea
                value={sentence.sentence}
                readOnly
                className="w-full border border-green-200 rounded-md bg-green-50 p-2 text-gray-700 resize-none"
              />

              {/* Translated input */}
              <label className="block text-sm text-green-800 font-medium mt-2 flex items-center justify-between">
                <span>Translated Sentence</span>
                {translations[sentence._id]?.trim() && (
                  <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                    ✅ Saved
                  </span>
                )}
              </label>
              <textarea
                value={translations[sentence._id] || ''}
                onChange={(e) => handleTranslationChange(sentence._id, e.target.value)}
                className="w-full border border-green-400 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                placeholder="Enter your translation..."
              />
            </div>

            {/* Done button */}
            <div className="flex-shrink-0 mt-2 md:mt-0 md:ml-4">
              <button
                onClick={() => handleDone(sentence._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
