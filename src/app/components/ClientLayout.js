"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import AdminSidebar from "../components/sidebars/AdminSidebar";
import QASidebar from "../components/sidebars/QASidebar";
import CandidateSidebar from "../components/sidebars/CandidateSidebar";

export default function ClientLayout({ children }) {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);
  const [collapsed, setCollapsed] = useState(false); // sidebar collapse state

  const publicPaths = ["/", "/login", "/signup", "/forgot-password"];

  useEffect(() => {
    if (!user && !publicPaths.includes(pathname) && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push("/login");
      return;
    }

    if (user && !publicPaths.includes(pathname)) {
      const [, pathRole] = pathname.split("/");
      if (pathRole && pathRole !== user.role && !hasRedirected.current) {
        hasRedirected.current = true;
        router.push("/unauthorized");
      }
    }
  }, [user, pathname, router]);

  if (!user && !publicPaths.includes(pathname)) {
    return null;
  }

  const renderSidebarByRole = () => {
    if (!user) return null;
    switch (user.role) {
      case "admin":
        return <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
      case "quality-assurance":
        return <QASidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
      case "candidate":
        return <CandidateSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
      default:
        return null;
    }
  };

  const isSidebarVisible = user && !publicPaths.includes(pathname);
  const contentMargin = isSidebarVisible ? (collapsed ? "ml-20" : "ml-64") : "";

  return (
    <div className="flex">
      {isSidebarVisible && renderSidebarByRole()}
      <main className={`flex-1 transition-all duration-300 ${contentMargin}`}>
        {children}
      </main>
    </div>
  );
}
