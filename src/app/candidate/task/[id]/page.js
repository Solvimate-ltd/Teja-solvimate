'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, BellRing, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return isNaN(date) ? '' : date.toLocaleDateString('en-GB');
}

export default function CandidateTaskPage(paramsPromise) {
  const { id } = paramsPromise.params;
  

  const [task, setTask] = useState(null);
  const [allDone, setAllDone] = useState(false);
  const [error, setError] = useState(false);
  const [translations, setTranslations] = useState({});
  const [visibleSentences, setVisibleSentences] = useState([]);
  const [activeReview, setActiveReview] = useState(null); // For modal

  const STORAGE_KEY = `candidate-task-translations-${id}`;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/employee/candidate/service/translation/${id}`);
        const data = await res.json();
        console.log(data);

        if (!data.task) {
          setAllDone(true);
          return;
        }

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

  const handleTranslationChange = (sentenceId, value) => {
    setTranslations((prev) => {
      const updated = { ...prev, [sentenceId]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

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

      setVisibleSentences((prev) => prev.filter((sentence) => sentence._id !== sentenceId));

      setTranslations((prev) => {
        const updated = { ...prev };
        delete updated[sentenceId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      toast.success('Translation submitted successfully!');

      if (visibleSentences.length === 1) {
        setAllDone(true);
      }

    } catch (error) {
      console.error('Error submitting translation:', error);
      toast.error('Failed to submit translation.');
    }
  };

  if (error) {
    return <div className="p-6 text-center text-red-600">Task not found or an error occurred.</div>;
  }

  if (allDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <CheckCircle className="w-20 h-20 text-green-600 mb-4 animate-pulse" />
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">All Sentences Completed!</h2>
        <p className="text-gray-600 text-lg max-w-xl">
          You have completed all the sentences and now they are under QA review. Thank you for your contribution!
        </p>
      </div>
    );
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
            className="bg-white border border-green-300 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative"
          >
            <div className="flex-1 space-y-2">
              <label className="block text-sm text-green-800 font-medium">Original Sentence</label>
              <textarea
                value={sentence.sentence}
                readOnly
                className="w-full border border-green-200 rounded-md bg-green-50 p-2 text-gray-700 resize-none"
              />

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

            {/* Actions */}
            <div className="flex flex-col items-center gap-2 mt-2 md:mt-0 md:ml-4">
              <button
                onClick={() => handleDone(sentence._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Done
              </button>

              {/* Bell Icon if review exists */}
              {sentence.review && (
                <button
                  onClick={() => setActiveReview(sentence.review)}
                  className="mt-1 p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition animate-bounce"
                  title="View Review Feedback"
                >
                  <BellRing className="text-yellow-600 w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Animated Modal */}
{activeReview && (
  <AnimatePresence>
    <motion.div
      key="review-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl w-full max-w-md p-6 relative"
      >
        <button
          onClick={() => setActiveReview(null)}
          className="absolute top-3 right-3 text-gray-700 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold text-yellow-600 mb-4">Review Feedback</h2>
        <div className="mb-3">
          <p className="text-sm text-gray-700 font-medium">Submitted Sentence:</p>
          <p className="text-gray-900 italic border border-yellow-200 bg-yellow-50 rounded p-2 mt-1">
            {activeReview.submittedSentence}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-700 font-medium">Remark:</p>
          <p className="text-red-600 font-medium bg-red-50 border border-red-200 rounded p-2 mt-1">
            {activeReview.remark}
          </p>
        </div>
        <button
          onClick={() => setActiveReview(null)}
          className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
        >
          OK
        </button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
)}
 </div>
  );
}
