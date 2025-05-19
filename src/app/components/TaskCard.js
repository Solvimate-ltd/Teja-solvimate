import { InfoIcon, NotebookPen } from 'lucide-react';
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';

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

  const handleProceed = () => {
  if (!user?.role) return;
   router.push(`/admin/task/${_id}`);
};

  const formattedDeadline = new Date(deadLine).toLocaleDateString('en-GB');
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString('en-GB');
  const assignedTo = mode === 'PUBLIC' ? 'Public' : candidate?.fullName;
  //const taskId = _id;
  

  return (
    <div className="border border-green-600 rounded-lg p-4 m-4 shadow-sm flex flex-col gap-2">
    <div className="flex items-start justify-between">
    <div className="flex items-center gap-3">
    <div className="bg-green-600 text-white p-2 rounded-lg">
    <NotebookPen />
    </div>
    <div>
    <h2 className="text-lg font-bold text-green-800">{taskName}</h2>
    <p className="text-sm text-gray-500">
    Deadline: {formattedDeadline}
    </p>
    <p className="text-sm text-gray-500">
    Created at: {formattedCreatedAt}
    </p>
    </div>
    </div>
    <div className="text-right text-sm">
    <p><span className="font-semibold">Language:</span></p>
    <div className="flex items-center gap-1">
    <span className="border px-2 py-1 rounded">{fromLanguage.language}</span>
    <span className="text-gray-500">→</span>
    <span className="border px-2 py-1 rounded">{toLanguage.language}</span>
    </div>
    </div>
    </div>

    <div className="flex justify-between items-center mt-2">
    <p className="text-sm">
    <span className="font-medium">Assigned To:</span> {assignedTo}
    </p>
    <p className="text-sm">
    <span className="font-medium">QA:</span> {qualityAssurance?.fullName}
    </p>
    <div className="flex gap-2">
    <button className="bg-green-600 text-white px-4 py-1 rounded flex items-center gap-1 text-sm">
    <InfoIcon size={16} /> {status}
    </button>
    <button
     onClick={handleProceed}
     className="bg-green-600 text-white px-4 py-1 rounded flex items-center gap-1 text-sm">
    → Open
    </button>
    </div> 

    </div>
    </div>
  );
}
