"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function UnauthorizedPage() {
  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  const handleRedirect = () => {
    if (!user) {
      router.push("/login");
    } else {
      const roleLandingPaths = {
        admin: "/admin/landingPage",
        candidate: "/candidate/landingPage",
        qa: "/qa/landingPage",
      };

      const redirectPath = roleLandingPaths[user.role] || "/dashboard";
      router.push(redirectPath);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-700 mb-6">
          🚫 You don&apos;t have permission to view this page.
        </p>
        <button
          onClick={handleRedirect}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          Go to Your Landing Page
        </button>
      </div>
    </div>
  );
}
