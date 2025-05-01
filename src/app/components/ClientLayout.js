"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Sidebar from "../sidebar.js/page";

export default function ClientLayout({ children }) {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const pathname = usePathname();

  // Define public (unauthenticated) routes
  const publicPaths = ["/login", "/signup", "/forgot-password"];

  useEffect(() => {
    if (!user && !publicPaths.includes(pathname)) {
      router.push("/login");
    }
  }, [user, pathname, router]);

  // Prevent content flash while redirecting unauthenticated users
  if (!user && !publicPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className="flex">
      {user && !publicPaths.includes(pathname) && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
