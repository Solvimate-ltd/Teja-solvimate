"use client";

import { InfoIcon, NotebookPen } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskCard({ task }) {
  const {
    _id,
    taskName,
    deadLine,
    fromLanguage,
    toLanguage,
    mode,
    status,
    qualityAssurance,
    candidate,
    createdAt,
  } = task;

  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const downloadTranslatedSentences = async () => {
    if (!user?.role) return;

    setShowModal(true); // Show loading modal

    try {
      const res = await fetch(`/api/employee/service/translation/summary/${_id}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${taskName.replace(" ", "-")}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setShowModal(false); // Hide modal
    }
  };

  const formattedDeadline = new Date(deadLine).toLocaleDateString("en-GB");
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString("en-GB");
  const assignedTo =
    mode === "PUBLIC" ? "Public" : candidate?.fullName || "Unassigned";

  return (
    <div className="relative">
      {/* Task Card */}
      <div className="border border-green-600 rounded-lg p-4 m-4 shadow-sm flex flex-col gap-2 relative z-10 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <NotebookPen />
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-800">{taskName}</h2>
              <p className="text-sm text-gray-500">Deadline: {formattedDeadline}</p>
              <p className="text-sm text-gray-500">Created at: {formattedCreatedAt}</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p>
              <span className="font-semibold">Language:</span>
            </p>
            <div className="flex items-center gap-1">
              <span className="border px-2 py-1 rounded">{fromLanguage?.language || "N/A"}</span>
              <span className="text-gray-500">→</span>
              <span className="border px-2 py-1 rounded">{toLanguage?.language || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-sm">
            <span className="font-medium">Assigned To:</span> {assignedTo}
          </p>
          <p className="text-sm">
            <span className="font-medium">QA:</span>{" "}
            {qualityAssurance?.fullName || "N/A"}
          </p>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-1 rounded flex items-center gap-1 text-sm">
              <InfoIcon size={16} /> {status}
            </button>
            <button
              onClick={downloadTranslatedSentences}
              disabled={status !== "COMPLETED"}
              className={`px-4 py-1 rounded flex items-center gap-1 text-sm transition 
                ${
                  status === "COMPLETED"
                    ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              title={
                status === "COMPLETED"
                  ? ""
                  : "Action not allowed. Task is not completed."
              }
            >
              → Download
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* ✅ Pure Blur Overlay Without Tint */}
            <motion.div
              className="fixed inset-0 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Box */}
            <motion.div
              className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-600 border-b-transparent"></div>
              <p className="text-lg font-medium text-gray-700">
                Your Excel is processing...
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}