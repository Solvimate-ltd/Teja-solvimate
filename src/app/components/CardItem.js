// components/CardItem.js
'use client';
import { CalendarDays, Clock, Info, ArrowRight } from "lucide-react";

/**
 * Format ISO date string to DD/MM/YYYY format.
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
}

export default function CardItem({ task, onStatusClick, onOpenClick }) {
  const {
    taskName,
    deadlineDate,
    fromLanguage,
    toLanguage,
    status
  } = task;

  return (
    <div className="bg-white border border-green-600 rounded-xl p-4 text-green-800 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-lg transition">
      {/* Left Section */}
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

      {/* Right Section */}
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
            onClick={() => onOpenClick(task)}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
          >
            <ArrowRight className="w-4 h-4" />
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
