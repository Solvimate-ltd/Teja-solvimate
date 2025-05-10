'use client';
import { useEffect, useState } from 'react';
import TaskCard from '@/app/components/TaskCard';

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/employee/task/')
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => console.error('Failed to fetch tasks:', err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Translation Tasks</h1>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        tasks.map((task) => <TaskCard key={task._id} task={task} />)
      )}
    </div>
  );
}
