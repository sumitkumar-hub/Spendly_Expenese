import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProfileModal from "./ProfileModal";

export default function Layout({ children }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div
        className={`flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${
          showProfile ? "blur-sm pointer-events-none" : ""
        }`}
      >

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN */}
        <div className="flex-1 p-4 sm:p-6">

          {/* NAVBAR */}
          <Navbar onOpenProfile={() => setShowProfile(true)} />

          {/* CONTENT */}
          {children}

        </div>
      </div>

      {/* 🔥 GLOBAL PROFILE MODAL */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
}