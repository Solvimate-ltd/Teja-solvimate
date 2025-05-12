'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Info, ArrowRight, X } from "lucide-react";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB');
}

export default function CardItem({ task, onStatusClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const {
    taskName,
    deadlineDate,
    fromLanguage,
    toLanguage,
    status,
    _id,
  } = task;

  const instructions = [
    'Check that the translation avoids literal rendering and that the message is accurately conveyed.',
    'Verify that no machine-generated translations are used; ensure the work feels human and natural.',
    'Ensure the language used is simple, clear, and appropriate for the target audience.',
    'Confirm that numbers are translated in a natural, reader-friendly format.',
    'Check adherence to the punctuation rules of the target language.',
    'Review idioms to ensure their meanings are conveyed naturally rather than translated word-for-word.',
    'Make sure the translation reads naturally and flows conversationally.',
    'Check for compliance with the grammar rules of the target language.',
    'Check spelling, word usage, and overall accuracy to avoid errors.',
    'Ensure the original tense and gender references are maintained unless grammar rules require changes.',
  ];

  const handleProceed = () => {
    router.push(`/candidate/task/${_id}`);
  };

  return (
    <>
      <div className="bg-white border border-green-600 rounded-xl p-4 text-green-800 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-lg transition">
        <div className="flex items-start gap-3">
          <div className="bg-green-600 text-white p-3 rounded-lg relative">
            <span className="text-xl">📝</span>
            <span className="absolute bottom-[-6px] right-[-6px] bg-white text-green-600 text-xs rounded-full px-1 py-0.5 border border-green-600">
              🌐
            </span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{taskName}</h2>
            <div className="flex items-center gap-4 text-sm mt-1">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-green-700" />
                <span>{formatDate(deadlineDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2 text-sm">
          <div className="flex items-center gap-2">
            Language:
            <span className="border border-green-600 px-2 py-0.5 rounded">
              {fromLanguage?.language}
            </span>
            <ArrowRight className="w-4 h-4 text-green-700" />
            <span className="border border-green-600 px-2 py-0.5 rounded">
              {toLanguage?.language}
            </span>
          </div>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => onStatusClick(task)}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
            >
              <Info className="w-4 h-4" />
              {status}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition hover:cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              Open
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white border-2 border-green-600 rounded-lg p-6 max-w-lg w-full relative shadow-lg text-green-900">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-green-600 hover:text-green-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-green-700 mb-4">{taskName}</h2>
            <p className="mb-2 text-sm">
              <span className="font-semibold">From:</span> {fromLanguage.language}
            </p>
            <p className="mb-4 text-sm">
              <span className="font-semibold">To:</span> {toLanguage.language}
            </p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-600 mb-2">Translation Instructions</h3>
              <ul className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                {instructions.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50 hover:cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleProceed}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 hover:cursor-pointer"
              >
                Proceed to Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
