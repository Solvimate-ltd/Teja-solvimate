"use client";
import { useEffect, useState } from "react";
import UserCard from "@/app/components/UserCard";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [candidatesRes, qasRes] = await Promise.all([
          fetch("/api/candidate"),
          fetch("/api/quality-assurance"),
        ]);

        const candidatesData = await candidatesRes.json();
        const qasData = await qasRes.json();

        const mergedUsers = [...candidatesData.candidates,...qasData.quality_assurances];
        setUsers(mergedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false); // stop loading after fetch
      }
    };

    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, currentStatus) => {
    console.log(userId, currentStatus);
    // try {
    //   await fetch(`/api/users/${userId}/block`, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ isBlocked: !currentStatus }),
    //   });

    //   setUsers((prev) =>
    //     prev.map((user) =>
    //       user._id === userId ? { ...user, isBlocked: !currentStatus } : user
    //     )
    //   );
    // } catch (error) {
    //   console.error("Failed to toggle block status:", error);
    // }
  };

  const handleDelete = async (userId) => {
    console.log(userId);
    // try {
    //   await fetch(`/api/users/${userId}`, { method: "DELETE" });
    //   setUsers((prev) => prev.filter((user) => user._id !== userId));
    // } catch (error) {
    //   console.error("Failed to delete user:", error);
    // }
  };

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
        All Users
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 border-opacity-70"></div>
          <p className="mt-4 text-green-700 text-lg font-medium animate-pulse">
            Please wait, fetching users...
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onToggleBlock={handleToggleBlock}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
