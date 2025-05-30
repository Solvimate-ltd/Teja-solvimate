'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, X, AlertCircle, Trash2, Undo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import warningAnim from '@/lottie/warningAnim.json'
import successAnim from '@/lottie/successAnim.json'
 // Adjust path as per your structure

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
  const [showReviewWarning, setShowReviewWarning] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const baseURL =
          typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : process.env.NEXT_PUBLIC_API_URL || '';

        const res = await fetch(`${baseURL}/api/employee/quality-assurance/service/translation/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const data = await res.json();
        if (!data.task) {
          setAllDone(true);
          return;
        }

        setTask(data.task);
        const initTranslations = {};
        const initActions = {};
        data.task.sentences.forEach(s => {
          initTranslations[s._id] = s.translatedSentence || '';
          initActions[s._id] = { verified: false, deleted: false, reworked: false, remark: '' };
        });

        setTranslations(initTranslations);
        setActions(initActions);
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError(true);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmitAll = async () => {
    const allReviewed = Object.values(actions).every(action => action.verified || action.deleted || action.reworked);
    if (!allReviewed) {
      setShowReviewWarning(true);
      setTimeout(() => setShowReviewWarning(false), 2000); // 2 seconds
      return;
    }

    const verifiedSentences = [], deletedSentences = [], reworkedSentences = [];

    for (let sentenceId in actions) {
      if (actions[sentenceId].verified) {
        verifiedSentences.push({
          _id: sentenceId,
          finalTranslatedSentence: translations[sentenceId]
        });
      }
      if (actions[sentenceId].deleted) deletedSentences.push(sentenceId);
      if (actions[sentenceId].reworked) {
        reworkedSentences.push({ _id: sentenceId, remark: actions[sentenceId].remark });
      }
    }

    try {
      const baseURL =
        typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : process.env.NEXT_PUBLIC_API_URL || '';

      const res = await fetch(`${baseURL}/api/employee/quality-assurance/service/translation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: id, verifiedSentences, deletedSentences, reworkedSentences }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to submit all actions');

      toast.success('All actions submitted successfully!');
      setAllDone(true);
    } catch (err) {
      console.error('Submit failed:', err);
      toast.error('Failed to submit actions');
    }
  };

  const handleActionChange = (id, type) => {
    if (actions[id].verified || actions[id].deleted || actions[id].reworked) return;
    setActions(prev => ({ ...prev, [id]: { ...prev[id], [type]: true } }));
    toast.success(`Marked as ${type}`);
  };

  const openReworkModal = (id) => {
    if (actions[id].verified || actions[id].deleted || actions[id].reworked) return;
    setModalSentenceId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRemark('');
  };

  const handleReworkSubmit = () => {
    if (!remark.trim()) return toast.error('Please enter a remark');
    setActions(prev => ({
      ...prev,
      [modalSentenceId]: { ...prev[modalSentenceId], reworked: true, remark }
    }));
    closeModal();
    toast.success('Marked as Rework');
  };

  const handleRevert = (id) => {
    setActions(prev => ({
      ...prev,
      [id]: { verified: false, deleted: false, reworked: false, remark: '' }
    }));
    toast('Action reverted');
  };

  const getBadge = (a) => {
    if (a.verified) return { text: 'Verified', color: 'green', icon: <CheckCircle className="w-4 h-4 mr-1" /> };
    if (a.reworked) return { text: 'Rework Requested', color: 'yellow', icon: <AlertCircle className="w-4 h-4 mr-1" /> };
    if (a.deleted) return { text: 'Deleted', color: 'red', icon: <Trash2 className="w-4 h-4 mr-1" /> };
    return null;
  };

  if (error) return <div className="p-6 text-center text-red-600">Task not found.</div>;
  if (allDone) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-green-700 text-center space-y-4">
      <Lottie animationData={successAnim} loop={false} className="w-40 h-40" />
      <h2 className="text-2xl font-bold">All Sentences Reviewed!</h2>
    </div>
  );
  if (!task) return <div className="p-6 text-center text-green-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4 py-6">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow p-6 border border-green-200 sticky top-0 z-10">
          <h1 className="text-3xl font-bold text-green-700 mb-2">{task.taskName}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
            <p><strong>From:</strong> {task.fromLanguage.language}</p>
            <p><strong>To:</strong> {task.toLanguage.language}</p>
            <p><strong>Deadline:</strong> {formatDate(task.deadLine)}</p>
          </div>
        </div>

        {task.sentences.map(sentence => {
          const a = actions[sentence._id];
          const badge = getBadge(a);

          return (
            <div key={sentence._id} className="bg-white border border-green-300 rounded-xl p-4 shadow space-y-2">
              {badge && (
                <div className={`flex items-center text-sm font-semibold text-${badge.color}-700 bg-${badge.color}-100 px-3 py-1 rounded-full w-fit`}>
                  {badge.icon}{badge.text}
                </div>
              )}
              <textarea readOnly value={sentence.sentence} className="w-full p-2 rounded bg-green-50 border border-green-200 resize-none" />
              <textarea
                value={translations[sentence._id]}
                onChange={e => setTranslations(prev => ({ ...prev, [sentence._id]: e.target.value }))}
                readOnly={a.verified || a.deleted || a.reworked}
                className="w-full p-2 rounded border border-green-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <button onClick={() => handleActionChange(sentence._id, 'verified')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer">Verify</button>
                <button onClick={() => openReworkModal(sentence._id)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer">Rework</button>
                <button onClick={() => handleActionChange(sentence._id, 'deleted')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer">Delete</button>
                {(a.verified || a.deleted || a.reworked) && (
                  <button onClick={() => handleRevert(sentence._id)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer flex items-center gap-1">
                    <Undo size={16} /> Revert
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex justify-center">
          <button
            onClick={handleSubmitAll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 mt-6 rounded-md cursor-pointer"
          >
            Submit All Actions
          </button>
        </div>
      </div>

      {/* Rework Modal */}
      {showModal && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }}>
              <button onClick={closeModal} className="absolute top-3 right-3 text-gray-700 hover:text-red-600 cursor-pointer">
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold text-yellow-600 mb-4">Rework Remark</h2>
              <textarea
                value={remark}
                onChange={e => setRemark(e.target.value)}
                className="w-full p-3 rounded border border-yellow-300 bg-yellow-50 resize-none focus:ring-2 focus:ring-yellow-400"
                rows={4}
              />
              <button onClick={handleReworkSubmit} className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded cursor-pointer">
                Submit Remark
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Review Warning Modal */}
      {showReviewWarning && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md flex flex-col items-center justify-center gap-4">
            <Lottie animationData={warningAnim} loop={true} className="w-24 h-24" />
            <p className="text-lg text-gray-800 font-semibold text-center">Please review all sentences before submitting.</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
