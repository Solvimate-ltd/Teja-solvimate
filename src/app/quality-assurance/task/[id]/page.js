'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, X, AlertCircle, Trash2, Undo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return isNaN(date) ? '' : date.toLocaleDateString('en-GB');
}

export default function QATaskReviewPage(paramsPromise) {
  const { id } = paramsPromise.params;
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [allDone, setAllDone] = useState(false);
  const [error, setError] = useState(false);
  const [translations, setTranslations] = useState({});
  const [actions, setActions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalSentenceId, setModalSentenceId] = useState(null);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
try {
  const baseURL =
    typeof window !== "undefined" && process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "";

  const res = await fetch(`${baseURL}/api/employee/quality-assurance/service/translation/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // optional: include if you rely on cookies/sessions
  });

  const data = await res.json();

  if (!data.task) {
    setAllDone(true);
    return;
  }

  setTask(data.task);

  const initialTranslations = {};
  const initialActions = {};
  data.task.sentences.forEach(s => {
    initialTranslations[s._id] = s.translatedSentence || '';
    initialActions[s._id] = {
      verified: false,
      deleted: false,
      reworked: false,
      remark: ''
    };
  });

  setTranslations(initialTranslations);
  setActions(initialActions);
} catch (err) {
  console.error('Failed to fetch task:', err);
  setError(true);
}

    };

    fetchTask();
  }, [id]);

  const handleTranslationChange = (sentenceId, value) => {
    setTranslations(prev => ({
      ...prev,
      [sentenceId]: value
    }));
  };

  const handleActionChange = (sentenceId, actionType) => {
    if (actions[sentenceId].verified || actions[sentenceId].reworked || actions[sentenceId].deleted) return;

    const updatedAction = {
      ...actions[sentenceId],
      [actionType]: true,
    };

    setActions(prev => ({
      ...prev,
      [sentenceId]: updatedAction,
    }));

    toast.success(`Marked as ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`);
  };

  const openReworkModal = (sentenceId) => {
    if (actions[sentenceId].verified || actions[sentenceId].reworked || actions[sentenceId].deleted) return;
    setModalSentenceId(sentenceId);
    setRemark('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRemark('');
  };

  const handleReworkSubmit = () => {
    if (remark.trim()) {
      setActions(prev => ({
        ...prev,
        [modalSentenceId]: {
          ...prev[modalSentenceId],
          reworked: true,
          remark
        }
      }));
      toast.success('Marked as Rework');
      closeModal();
    } else {
      toast.error('Please enter a remark.');
    }
  };

  const handleRevert = (sentenceId) => {
    setActions(prev => ({
      ...prev,
      [sentenceId]: { verified: false, reworked: false, deleted: false, remark: '' }
    }));
    toast('Action reverted');
  };

  const handleSubmitAll = async () => {
    const verifiedSentences = [];
    const deletedSentences = [];
    const reworkedSentences = [];

    for (let sentenceId in actions) {
      if (actions[sentenceId].verified) {
        verifiedSentences.push({
          _id: sentenceId,
          finalTranslatedSentence: translations[sentenceId]
        });
      }
      if (actions[sentenceId].deleted) deletedSentences.push(sentenceId);
      if (actions[sentenceId].reworked) {
        reworkedSentences.push({
          _id: sentenceId,
          remark: actions[sentenceId].remark
        });
      }
    }
    console.log(verifiedSentences);

try {
  const baseURL =
    typeof window !== "undefined" && process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "";

  const res = await fetch(`${baseURL}/api/employee/quality-assurance/service/translation`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      taskId: id,
      verifiedSentences,
      deletedSentences,
      reworkedSentences,
    }),
    credentials: 'include', // optional if you're working with auth cookies
  });

  if (!res.ok) throw new Error('Failed to submit all actions');

  toast.success('All actions submitted successfully!');
  setAllDone(true);
} catch (err) {
  console.error('Submit all actions failed:', err);
  toast.error('Failed to submit all actions');
}

  };

  const getActionBadge = (action) => {
    if (action.verified) return { text: 'Verified', color: 'green', icon: <CheckCircle className="w-4 h-4 mr-1" /> };
    if (action.reworked) return { text: 'Rework Requested', color: 'yellow', icon: <AlertCircle className="w-4 h-4 mr-1" /> };
    if (action.deleted) return { text: 'Deleted', color: 'red', icon: <Trash2 className="w-4 h-4 mr-1" /> };
    return null;
  };

  if (error) return <div className="p-6 text-center text-red-600">Task not found or an error occurred.</div>;
  if (allDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center ">
        <CheckCircle className="w-20 h-20 text-green-600 mb-4 animate-pulse" />
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">All Sentences Reviewed!</h2>
        <p className="text-gray-600 text-lg max-w-xl">You&apos;ve completed the QA review for all sentences. Great job!</p>
      </div>
    );
  }
  if (!task) return <div className="p-6 text-center text-green-700">Loading task...</div>;

  const { taskName, deadLine, fromLanguage, toLanguage, sentences } = task;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4 py-6">
    <div className="p-6 max-w-5xl mx-auto space-y-6 relative">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 border border-green-200 sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-green-700 mb-2">{taskName}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
          <p><strong>From:</strong> {fromLanguage.language}</p>
          <p><strong>To:</strong> {toLanguage.language}</p>
          <p><strong>Deadline:</strong> {formatDate(deadLine)}</p>
        </div>
      </div>

      {/* Sentences */}
      <div className="space-y-4">
        {sentences.map(sentence => {
          const action = actions[sentence._id];
          const badge = getActionBadge(action);

          return (
            <div key={sentence._id} className="bg-white border border-green-300 rounded-xl p-4 shadow space-y-2">
              {/* Status Badge */}
              {badge && (
                <div className={`flex items-center text-sm font-semibold text-${badge.color}-700 bg-${badge.color}-100 px-3 py-1 rounded-full w-fit`}>
                  {badge.icon}{badge.text}
                </div>
              )}

              <label className="block text-sm text-green-800 font-medium">Original Sentence</label>
              <textarea
                value={sentence.sentence}
                readOnly
                className="w-full border border-green-200 rounded-md bg-green-50 p-2 text-gray-700 resize-none"
              />

              <label className="block text-sm text-green-800 font-medium mt-2">Translated Sentence</label>
              <textarea
                value={translations[sentence._id] || ''}
                onChange={(e) => handleTranslationChange(sentence._id, e.target.value)}
                className="w-full border border-green-400 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                placeholder="Edit the translated sentence..."
                readOnly={action.verified || action.reworked || action.deleted}
              />

              {/* Action buttons */}
              <div className="flex flex-col md:flex-row gap-3 mt-2">
                <button
                  onClick={() => handleActionChange(sentence._id, 'verified')}
                  className={`px-4 py-2 rounded-md text-white ${action.verified || action.reworked || action.deleted ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={action.verified || action.reworked || action.deleted}
                >
                  Verify
                </button>
                <button
                  onClick={() => openReworkModal(sentence._id)}
                  className={`px-4 py-2 rounded-md text-white ${action.verified || action.reworked || action.deleted ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}
                  disabled={action.verified || action.reworked || action.deleted}
                >
                  Rework
                </button>
                <button
                  onClick={() => handleActionChange(sentence._id, 'deleted')}
                  className={`px-4 py-2 rounded-md text-white ${action.verified || action.reworked || action.deleted ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                  disabled={action.verified || action.reworked || action.deleted}
                >
                  Delete
                </button>
                {(action.verified || action.reworked || action.deleted) && (
                  <button
                    onClick={() => handleRevert(sentence._id)}
                    className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                  >
                    <Undo size={16} /> Revert
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmitAll}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Submit All Actions
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <AnimatePresence>
          <motion.div
            key="modal"
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
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-700 hover:text-red-500 transition"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold text-yellow-600 mb-4">Rework Remark</h2>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={4}
                className="w-full border border-yellow-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-yellow-50"
                placeholder="Describe the issue with this translation..."
              />
              <button
                onClick={handleReworkSubmit}
                className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
              >
                Submit
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
    </div>

  );
}
