import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { updateProfile } from "../api/user";

export default function ProfileDrawer({ open, onClose }) {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // 🔥 update form when user changes
  useEffect(() => {
    if (open) {
      const updatedUser = JSON.parse(localStorage.getItem("user")) || {};
      setForm({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        password: "",
      });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await updateProfile(form);

      localStorage.setItem("user", JSON.stringify(res.user));
      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Profile updated");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
      />

      {/* 🔥 DRAWER WITH ANIMATION */}
      <div
        className={`fixed top-0 right-0 h-full w-[350px] bg-slate-900 z-50 shadow-2xl p-6 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="text-white text-xl mb-4 hover:text-red-400 transition"
        >
          ✕
        </button>

        <h2 className="text-white text-xl font-bold mb-6">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Name"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="New Password"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-500 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

        </form>
      </div>
    </>
  );
}