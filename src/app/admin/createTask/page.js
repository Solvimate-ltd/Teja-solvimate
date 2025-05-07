"use client";
import { useEffect, useState } from "react";

export default function TaskCreationPage() {
  const [sentences, setSentences] = useState([""]);
  const [deadline, setDeadline] = useState("");
  const [taskName, setTaskName] = useState("");
  const [languages, setLanguages] = useState([]);
  const [primaryLang, setPrimaryLang] = useState("");
  const [secondaryLang, setSecondaryLang] = useState("");
  const [qaList, setQaList] = useState([]);
  const [filteredQAs, setFilteredQAs] = useState([]);
  const [assignmentType, setAssignmentType] = useState("public");
  const [selectedQA, setSelectedQA] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");

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
        const res = await fetch("/api/quality-assurance");
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
        const res = await fetch("/api/candidate");
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
    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isDeadlineValid()) {
      alert("Deadline must be today or a future date.");
      return;
    }

    const payload = {
      taskName,
      deadline,
      sentences,
      primaryLanguageId: primaryLang,
      secondaryLanguageId: secondaryLang,
      assignmentType,
      assignedQA: selectedQA,
      assignedCandidate: selectedCandidate,
    };

    console.log("Sending to backend:", payload);

    // fetch("/api/tasks", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
  };

  return (
    <div className="min-h-screen bg-green-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-800">Create New Task</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">

        {/* Task Name */}
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

        {/* Deadline */}
        <div>
          <label className="block mb-1 font-medium">Deadline</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          {!isDeadlineValid() && deadline && (
            <p className="text-red-600 text-sm mt-1">Deadline must be today or later.</p>
          )}
        </div>

        {/* Primary Language */}
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

        {/* Secondary Language */}
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

        {/* QA Dropdown */}
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

        {/* Assignment Type */}
        <div>
          <label className="block mb-1 font-medium">Assignment</label>
          <select
            className="w-full border rounded p-2"
            value={assignmentType}
            onChange={(e) => setAssignmentType(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="assign">Assign To</option>
          </select>
        </div>

        {/* Candidate Dropdown */}
        {assignmentType === "assign" && primaryLang && secondaryLang && (
          <div>
            <label className="block mb-1 font-medium">Assign to Candidate</label>
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

        {/* Sentences Section */}
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
            className="mt-2 px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
          >
            + Add Sentence
          </button>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}