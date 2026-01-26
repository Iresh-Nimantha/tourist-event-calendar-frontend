// src/components/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // 🔹 ADDED (for mobile sidebar)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "My Profile",
      path: "/admin/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      name: "Add Hotel",
      path: "/admin/hotels/new",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      name: "Add Event",
      path: "/admin/events/new",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      name: "View Hotels",
      path: "/admin/hotels",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      name: "View Events",
      path: "/admin/events",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 🔹 Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg flex flex-col h-screen fixed left-0 top-0 z-50
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Event<span className="text-blue-600">Haven</span>
            </h1>
          </div>
          <p className="text-xs text-gray-500 ml-12">Admin Panel</p>

          {user && (
            <div className="mt-3 flex items-center gap-3">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-y-auto w-full">
        {/* 🔹 Mobile Top Bar */}
        <div className="md:hidden bg-white shadow px-4 py-3 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 text-xl"
          >
            ☰
          </button>
          <h2 className="ml-4 font-semibold">Admin Panel</h2>
        </div>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
