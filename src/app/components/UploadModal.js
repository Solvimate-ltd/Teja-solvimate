"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function UploadModal({
  showUploadModal,
  setShowUploadModal,
  selectedFile,
  setSelectedFile,
  sheetName,
  setSheetName,
  columnName,
  setColumnName,
  handleModalFileUpload,
}) {
  return (
    showUploadModal && (
      <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative bg-white bg-opacity-80 p-8 rounded-2xl shadow-2xl w-96 backdrop-filter backdrop-blur-lg"
        >
          <button
            onClick={() => setShowUploadModal(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-800 transition-colors duration-200 hover:cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📤 Upload File Details
          </h2>

          <input
            type="file"
            accept=".xlsx,.xlsm"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer bg-white bg-opacity-70"
          />

          <input
            type="text"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            placeholder="Sheet Name (e.g., Sheet1)"
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white bg-opacity-70"
          />

          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Header Name (e.g., Sentences)"
            className="w-full border border-gray-300 p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white bg-opacity-70"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200 hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleModalFileUpload}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:cursor-pointer"
            >
              Upload
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
}
