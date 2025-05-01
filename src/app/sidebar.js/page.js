"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { clearUser } from "../store/userSlice";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const pathName = usePathname();
  const router = useRouter();

  const logOutHandler = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const shouldShowSidebar = user && pathName !== "/login";
  if (!shouldShowSidebar) return null;

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className={`h-screen bg-white text-green-700 shadow-lg border-r border-green-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="text-2xl font-bold tracking-wide text-green-600">
            TEJA
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="transition-colors duration-300 text-green-600"
        >
          {collapsed ? <Menu /> : <X />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="px-4 mb-4">
          <p className="text-sm text-green-400">Welcome,</p>
          <p className="font-semibold">{user.fullName || user.email}</p>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex flex-col space-y-2 px-2">
        <SidebarLink href="/landingPage" icon="🏠" label="Home" collapsed={collapsed} currentPath={pathName} />
        <SidebarLink href="/about" icon="ℹ️" label="About" collapsed={collapsed} currentPath={pathName} />
        <SidebarLink href="/contact" icon="📞" label="Contact" collapsed={collapsed} currentPath={pathName} />

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logOutHandler}
          className="flex items-center gap-3 px-4 py-2 mt-6 bg-red-100 hover:bg-red-200 text-red-500 rounded-md text-left transition-all duration-300"
        >
          🚪 {!collapsed && "Logout"}
        </motion.button>
      </nav>
    </motion.div>
  );
};

// Reusable Sidebar Link
const SidebarLink = ({ href, icon, label, collapsed, currentPath }) => {
  const isActive = currentPath === href;

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative rounded-md">
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-r"
        />
      )}
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2 pl-5 rounded-md transition-all duration-300 relative ${
          isActive
            ? "bg-green-100 text-green-800 font-semibold"
            : "hover:bg-green-50 text-green-700"
        }`}
      >
        {icon} {!collapsed && label}
      </Link>
    </motion.div>
  );
};

export default Sidebar;
