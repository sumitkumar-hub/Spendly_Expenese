import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getExpenses } from "../api/expense.js";
import Layout from "../components/Layout";
import MonthlyChart from "../components/MonthlyChart";
import CategoryChart from "../components/CategoryChart";
import ExpenseModal from "../components/ExpenseModal.jsx";
import IncomeModal from "../components/IncomeModal";
import TransactionList from "../components/TransactionalList";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState("monthly");
  const [showExpense, setShowExpense] = useState(false);
  const [showIncome, setShowIncome] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load");
      }
    };
    fetchExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    const now = new Date();

    return expenses.filter((tx) => {
      if (!tx?.date) return false;

      const d = new Date(tx.date);
      if (isNaN(d)) return false;

      if (activeTab === "daily") return d.toDateString() === now.toDateString();
      if (activeTab === "weekly") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (activeTab === "monthly") {
        return d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear();
      }
      if (activeTab === "yearly") {
        return d.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [expenses, activeTab]);

  const totalIncome = filteredExpenses
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalExpenses = filteredExpenses
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const balance = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(v);

  const monthlyData = useMemo(() => {
    const map = new Map();

    filteredExpenses.forEach((tx) => {
      const d = new Date(tx.date);
      const label = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!map.has(label)) {
        map.set(label, { month: label, income: 0, expense: 0 });
      }

      const entry = map.get(label);

      if (tx.type === "income") entry.income += Number(tx.amount || 0);
      else entry.expense += Number(tx.amount || 0);
    });

    return Array.from(map.values());
  }, [filteredExpenses]);

  const categoryData = useMemo(() => {
    const map = new Map();

    filteredExpenses
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        const cat = tx.category || "Other";
        map.set(cat, (map.get(cat) || 0) + Number(tx.amount || 0));
      });

    return Array.from(map.entries()).map(([category, value]) => ({
      category,
      value,
    }));
  }, [filteredExpenses]);

  const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f97316"];

  return (
    <Layout>

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-white text-3xl font-bold">Dashboard</h2>
        <p className="text-gray-400">Welcome back 👋</p>
      </div>

      {/* 🔥 NEW CARDS DESIGN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <Card title="Balance" value={formatCurrency(balance)} color="green" />
        <Card title="Income" value={formatCurrency(totalIncome)} color="green" />
        <Card title="Expense" value={formatCurrency(totalExpenses)} color="red" />
        <Card title="Savings %" value={`${savingsRate}%`} color="blue" />

      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        {["daily", "weekly", "monthly", "yearly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl capitalize transition ${
              activeTab === tab
                ? "bg-indigo-500 text-white shadow-lg"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MonthlyChart data={monthlyData} />
        <CategoryChart data={categoryData} COLORS={COLORS} />
      </div>

      {/* TRANSACTIONS */}
      <TransactionList data={filteredExpenses} />

      {/* FLOAT BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        <button
          onClick={() => setShowIncome(true)}
          className="w-14 h-14 bg-green-500 text-white rounded-full text-xl shadow-2xl hover:scale-110 transition"
        >
          ₹
        </button>

        <button
          onClick={() => setShowExpense(true)}
          className="w-16 h-16 bg-indigo-500 text-white rounded-full text-2xl shadow-2xl hover:scale-110 transition"
        >
          +
        </button>
      </div>

      {/* MODALS */}
      {showExpense && (
        <ExpenseModal onClose={() => setShowExpense(false)} />
      )}

      {showIncome && (
        <IncomeModal onClose={() => setShowIncome(false)} />
      )}

    </Layout>
  );
}

// 🔥 NEW CARD COMPONENT
function Card({ title, value, color }) {
  return (
    <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-white/10 to-transparent hover:scale-[1.03] transition duration-300">

      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg">

        <p className="text-gray-400 text-sm mb-1">{title}</p>

        <h2 className={`text-${color}-400 text-2xl font-bold`}>
          {value}
        </h2>

      </div>
    </div>
  );
}