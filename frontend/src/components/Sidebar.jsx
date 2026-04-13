import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { removeToken } from "../utils/auth";
import ProfileDrawer from "./ProfileDrawer";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {
      name: "User",
      email: "user@gmail.com",
    }
  );

  const dropdownRef = useRef();

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <ArrowLeftRight size={18} />
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 size={18} />
    },
  ];

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔥 Live user update
  useEffect(() => {
    const updateUser = () => {
      const updated = JSON.parse(localStorage.getItem("user"));
      if (updated) setUser(updated);
    };

    window.addEventListener("userUpdated", updateUser);
    return () => window.removeEventListener("userUpdated", updateUser);
  }, []);

  // 🔥 Close dropdown outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div className="w-64 h-screen bg-slate-900 text-white flex flex-col justify-between">

        {/* TOP */}
        <div>
          <h1 className="text-xl font-bold p-6">Spendly</h1>

          <div className="flex flex-col gap-2 px-4">

            {menu.map((item) => {
              const active = location.pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      active
                        ? "bg-indigo-500 text-white shadow-lg"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              );
            })}

          </div>
        </div>

        {/* PROFILE */}
        <div className="p-4 border-t border-white/10 relative" ref={dropdownRef}>

          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          {open && (
            <div className="mt-3 bg-slate-800 rounded-xl shadow-lg p-2 flex flex-col gap-1">

              <button
                onClick={() => {
                  setOpen(false);
                  setShowDrawer(true);
                }}
                className="text-left px-3 py-2 rounded hover:bg-white/10"
              >
                Profile
              </button>

              <button className="text-left px-3 py-2 rounded hover:bg-white/10">
                Support
              </button>

              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 rounded text-red-400 hover:bg-red-500/10"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </div>

      {/* DRAWER */}
      <ProfileDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
    </>
  );
}