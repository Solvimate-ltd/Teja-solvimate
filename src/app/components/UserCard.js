"use client";
import Image from "next/image";

export default function UserCard({ user, onToggleBlock, onDelete }) {
  const {
    _id,
    name,
    email,
    password,
    role,
    languages,
    isBlocked,
  } = user;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-green-200 hover:shadow-xl transition">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-300 shadow-sm">
          <Image
            src="/images/profile_logo.webp"
            alt={name || "User"}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="text-xl font-bold mt-3 text-green-800">{name}</h2>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-700 mt-4 space-y-1">
        <p><span className="font-semibold">Email:</span> {email}</p>
        <p><span className="font-semibold">Password:</span> {password}</p>
        <p><span className="font-semibold">Role:</span> {role}</p>
        <p>
          <span className="font-semibold">Languages:</span>{" "}
          {languages?.length > 0
            ? languages.map((lang) => lang.language).join(", ")
            : "N/A"}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => onToggleBlock(_id, isBlocked)}
          className={`px-4 py-2 rounded-lg text-white font-medium transition ${
            isBlocked
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-500 hover:bg-red-600"
          } cursor-pointer`}
        >
          {isBlocked ? "Unblock" : "Block"}
        </button>
        <button
          onClick={() => onDelete(_id)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-black transition hover: cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
