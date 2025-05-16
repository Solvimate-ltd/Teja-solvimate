"use client";
import { useEffect, useState } from "react";

export default function TaskCreationPage() {
  const [sentences, setSentences] = useState([""]);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [taskName, setTaskName] = useState("");
  const [languages, setLanguages] = useState([]);
  const [primaryLang, setPrimaryLang] = useState("");
  const [secondaryLang, setSecondaryLang] = useState("");
  const [qaList, setQaList] = useState([]);
  const [filteredQAs, setFilteredQAs] = useState([]);
  const [mode, setMode] = useState("public");
  const [selectedQA, setSelectedQA] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sheetName, setSheetName] = useState("");
  const [columnName, setColumnName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false); // NEW: Show DB save loader

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("/api/language");
        const data = await res.json();
        setLanguages(data.languages || []);
      } catch (err) {
        console.error("Failed to fetch languages:", err);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const fetchQAs = async () => {
      try {
        const res = await fetch("/api/employee/quality-assurance");
        const data = await res.json();
        setQaList(data.quality_assurances || []);
      } catch (err) {
        console.error("Failed to fetch QAs:", err);
      }
    };
    fetchQAs();
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch("/api/employee/candidate");
        const data = await res.json();
        setCandidates(data.candidates || []);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      }
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (primaryLang && secondaryLang) {
      const filtered = qaList.filter((qa) => {
        if (!qa.languages) return false;
        const langIds = qa.languages.map((l) => l._id);
        return langIds.includes(primaryLang) && langIds.includes(secondaryLang);
      });
      setFilteredQAs(filtered);

      const filteredCands = candidates.filter((cand) => {
        if (!cand.languages) return false;
        const langIds = cand.languages.map((l) => l._id);
        return langIds.includes(primaryLang) && langIds.includes(secondaryLang);
      });
      setFilteredCandidates(filteredCands);
    } else {
      setFilteredQAs([]);
      setFilteredCandidates([]);
    }
  }, [primaryLang, secondaryLang, qaList, candidates]);

  const handleSentenceChange = (index, value) => {
    const updated = [...sentences];
    updated[index] = value;
    setSentences(updated);
  };

  const addSentenceField = () => setSentences([...sentences, ""]);

  const removeSentenceField = (index) => {
    if (sentences.length > 1) {
      const updated = [...sentences];
      updated.splice(index, 1);
      setSentences(updated);
    }
  };

  const isDeadlineValid = () => {
    const selectedDate = new Date(deadlineDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const resetForm = () => {
    setTaskName("");
    setDeadlineDate("");
    setPrimaryLang("");
    setSecondaryLang("");
    setSelectedQA("");
    setMode("public");
    setSelectedCandidate("");
    setSentences([""]);
    setShowUploadButton(true);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDeadlineValid()) {
      alert("Deadline must be today or a future date.");
      return;
    }

    const payload = {
      taskName,
      deadlineDate,
      sentences,
      fromLanguage: primaryLang,
      toLanguage: secondaryLang,
      mode,
      qualityAssurance: selectedQA,
      candidate: selectedCandidate || null,
    };

    setLoading(true); // Show spinner while saving

    try {
      const response = await fetch("/api/employee/service/translation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        resetForm();
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        alert("❌ Task creation failed.");
      }
    } catch (error) {
      alert("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false); // Hide spinner after saving
    }
  };

  const handleModalFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setShowUploadModal(false);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("sheetName", sheetName);
    formData.append("columnName", columnName);

    try {
      const res = await fetch(
        "/api/employee/service/translation/extract-data-from-sheet",
        {
          method: "POST",
          body: formData,
        },
      );
      const json = await res.json();

      if (res.ok && Array.isArray(json.data)) {
        setSentences(json.data);
        setShowUploadButton(false);
      } else {
        alert(json.message || "Failed to extract data from sheet");
      }
    } catch (err) {
      alert("Error uploading or processing the file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-10 px-6 relative">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
        Create New Task
      </h1>

      {/* Upload Sheet Button */}
      {showUploadButton && (
        <div className="max-w-3xl mx-auto mb-6 text-center">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 cursor-pointer"
          >
            Upload Google Sheet
          </button>
        </div>
      )}

      {/* Uploading Spinner */}
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="text-lg font-semibold text-green-700">
              Uploading & Processing...
            </p>
          </div>
        </div>
      )}

      {/* DB Saving Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow-lg flex items-center gap-4">
            <div className="animate-spin h-6 w-6 border-4 border-green-600 border-t-transparent rounded-full"></div>
            <span className="text-green-700 font-semibold text-lg">
              Saving Task...
            </span>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Upload File Details</h2>

            <input
              type="file"
              accept=".xlsx,.xlsm"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mb-3 cursor-pointer"
            />

            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="Sheet Name e.g., Sheet1"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="Column Name (e.g., A)"
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleModalFileUpload}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 cursor-pointer"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6"
      >
        <div>
          <label className="block mb-1 font-medium">Task Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Deadline</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.target.value)}
            required
          />
          {!isDeadlineValid() && deadlineDate && (
            <p className="text-red-600 text-sm mt-1">
              Deadline must be today or later.
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Primary Language</label>
          <select
            className="w-full border rounded p-2"
            value={primaryLang}
            onChange={(e) => {
              setPrimaryLang(e.target.value);
              setSecondaryLang("");
            }}
            required
          >
            <option value="">Select Primary Language</option>
            {languages.map((lang) => (
              <option key={lang._id} value={lang._id}>
                {lang.language}
              </option>
            ))}
          </select>
        </div>

        {primaryLang && (
          <div>
            <label className="block mb-1 font-medium">Secondary Language</label>
            <select
              className="w-full border rounded p-2"
              value={secondaryLang}
              onChange={(e) => setSecondaryLang(e.target.value)}
              required
            >
              <option value="">Select Secondary Language</option>
              {languages
                .filter((lang) => lang._id !== primaryLang)
                .map((lang) => (
                  <option key={lang._id} value={lang._id}>
                    {lang.language}
                  </option>
                ))}
            </select>
          </div>
        )}

        {primaryLang && secondaryLang && (
          <div>
            <label className="block mb-1 font-medium">Available QAs</label>
            <select
              className="w-full border rounded p-2 bg-white"
              value={selectedQA}
              onChange={(e) => setSelectedQA(e.target.value)}
              required
              disabled={filteredQAs.length === 0}
            >
              <option value="">
                {filteredQAs.length === 0
                  ? "No QAs available for selected languages"
                  : "Select QA"}
              </option>
              {filteredQAs.map((qa) => (
                <option key={qa._id} value={qa._id}>
                  {qa.fullName}
                </option>
              ))}
            </select>
            {filteredQAs.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                No QA supports both selected languages.
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Assignment</label>
          <select
            className="w-full border rounded p-2"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="assigned">Assign To</option>
          </select>
        </div>

        {mode === "assigned" && primaryLang && secondaryLang && (
          <div>
            <label className="block mb-1 font-medium">
              Assign to Candidate
            </label>
            <select
              className="w-full border rounded p-2 bg-white"
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              required
              disabled={filteredCandidates.length === 0}
            >
              <option value="">
                {filteredCandidates.length === 0
                  ? "No candidates available for selected languages"
                  : "Select Candidate"}
              </option>
              {filteredCandidates.map((candidate) => (
                <option key={candidate._id} value={candidate._id}>
                  {candidate.fullName}
                </option>
              ))}
            </select>
            {filteredCandidates.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                No candidate supports both selected languages.
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Sentences</label>
          {sentences.map((sentence, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={sentence}
                onChange={(e) => handleSentenceChange(index, e.target.value)}
                className="flex-1 border rounded p-2"
                required
              />
              {sentences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSentenceField(index)}
                  className="text-red-600 font-bold px-2"
                >
                  −
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSentenceField}
            className="mt-2 bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800"
          >
            + Add Sentence
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 text-white font-bold py-3 rounded hover:bg-green-800"
        >
          Create Task
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center text-green-700 font-semibold">
            ✅ Task Created Successfully!
          </div>
        </div>
      )}
    </div>
  );
}
