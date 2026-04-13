import React from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const showSearch = location.pathname === "/transactions";

  return (
    <div className="flex justify-between items-center mb-8 p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-md">

      {/* LEFT */}
      <div className="flex items-center gap-6">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">
            S
          </div>
          <span className="text-white font-semibold text-lg">
            Spendly
          </span>
        </div>

        {/* SEARCH */}
        {showSearch && (
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-80 backdrop-blur-md">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="bg-transparent outline-none text-white ml-2 w-full placeholder-gray-500"
            />
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* 🔔 NOTIFICATION */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 cursor-pointer">
          <Bell size={18} className="text-gray-300" />
        </div>

      </div>
    </div>
  );
}