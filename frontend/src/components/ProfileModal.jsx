import React, { useState } from "react";
import ReactDOM from "react-dom";
import toast from "react-hot-toast";
import { updateProfile } from "../api/user";

export default function ProfileModal({ isOpen, onClose }) {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await updateProfile(form);

      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success("Profile updated");

      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">

      <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md text-white relative shadow-2xl">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 rounded bg-slate-800 border border-white/10"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-800 border border-white/10"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full p-3 rounded bg-slate-800 border border-white/10"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-500 py-3 rounded-lg"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

        </form>

      </div>
    </div>,
    document.body // 🔥 KEY FIX
  );
}