// app/candidate/task/[id]/page.js
import { notFound } from 'next/navigation';

/**
 * Format ISO date string to DD/MM/YYYY format.
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB');
}

export default async function CandidateTaskPage({ params }) {
  const { id } = params;

  let task = null;
  console.log("Task ID is:", id)

  try {
    const res = await fetch(`http://localhost:3000/api/employee/candidate/${id}`, {
  
    }
    );
    console.log(res);

    if (!res.ok) throw new Error('Task not found');

    task = await res.json();
    console.log(task);
  } catch (err) {
    console.error(err);
    notFound();
  }

  const {
    taskName,
    deadLine,
    fromLanguage,
    toLanguage,
    sentences = [],
  } = task;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-4">{taskName}</h1>
      <p className="mb-2">
        <strong>From:</strong> {fromLanguage?.language}
      </p>
      <p className="mb-2">
        <strong>To:</strong> {toLanguage?.language}
      </p>
      <p className="mb-2">
        <strong>Deadline:</strong> {formatDate(deadLine)}
      </p>


      <h2 className="text-xl font-semibold text-green-600 mb-2">Sentences</h2>
      {sentences.length === 0 ? (
        <p className="text-gray-600">No sentences found.</p>
      ) : (
        <ul className="space-y-2">
          {sentences.map((sentence, index) => (
            <li key={index} className="bg-green-50 p-3 border border-green-200 rounded-md">
              {sentence.sentence}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
