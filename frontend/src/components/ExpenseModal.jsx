import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];

export default function ExpenseModal({ onClose }) {

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: ""
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) {
      setError("Title and Amount are required");
      return;
    }

    try {
      await api.post("/transactions", {
        ...form,
        type: "expense",
        amount: Number(form.amount),
        date: form.date || new Date().toISOString(),
      });

      toast.success("Expense added ✅");
      onClose();
      window.location.reload(); // quick refresh

    } catch (err) {
      console.log(err);
      toast.error("Failed to add expense ❌");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3"
      onClick={onClose}
    >

      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 p-6 rounded-xl w-full max-w-sm space-y-4"
      >

        <h2 className="text-white text-lg">Add Expense</h2>

        {error && <p className="text-red-400">{error}</p>}

        <input
          placeholder="Title"
          className="w-full p-2 bg-white/10 text-white"
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 bg-white/10 text-white"
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />

        <select
          className="w-full p-2 bg-white/10 text-white"
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
          {expenseCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="date"
          className="w-full p-2 bg-white/10 text-white"
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        <button className="bg-orange-500 w-full py-2 rounded text-white">
          Add Expense
        </button>

      </form>
    </div>
  );
}