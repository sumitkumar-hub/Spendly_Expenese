import React, { useState, useEffect } from "react";

export default function EditExpenseModal({ isOpen, onClose, expense, onUpdate }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.category,
        amount: expense.amount,
        date: expense.date?.slice(0, 10),
      });
    }
  }, [expense]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate({
      ...expense,
      category: form.title,
      amount: Number(form.amount),
      date: form.date,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 text-white p-6 rounded-xl w-full max-w-md">

        <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Category"
          className="w-full mb-3 p-2 rounded bg-white/10 border border-white/10"
        />

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full mb-3 p-2 rounded bg-white/10 border border-white/10"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-white/10 border border-white/10"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 rounded-lg"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
}
