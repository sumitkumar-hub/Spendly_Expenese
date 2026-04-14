import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getExpenses } from "../api/expense";
import { getBudget, setBudget } from "../api/budget.js";
import { getCategoryBudgets, setCategoryBudget } from "../api/categoryBudget.js";
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

  // 🔥 BUDGET STATE
  const [budget, setBudgetState] = useState(0);
  const [input, setInput] = useState("");

  // 🔥 CATEGORY BUDGET STATE
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [categoryInputs, setCategoryInputs] = useState({});

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const data = await getExpenses();
      setExpenses(Array.isArray(data) ? data : []);

      const b = await getBudget(currentMonth);
      if (b?.amount) setBudgetState(b.amount);

      const catBudgets = await getCategoryBudgets(currentMonth);
      const map = {};
      catBudgets.forEach((b) => {
        map[b.category] = b.amount;
      });
      setCategoryBudgets(map);

    } catch {
      toast.error("Failed to load");
    }
  };

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
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
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

  // 🔥 MAIN BUDGET
  const remaining = budget - totalExpenses;
  const percent = budget ? (totalExpenses / budget) * 100 : 0;

  const handleSaveBudget = async () => {
    if (!input) return;

    await setBudget({
      amount: Number(input),
      month: currentMonth,
    });

    setBudgetState(Number(input));
    setInput("");
    toast.success("Budget updated");
  };

  // 🔥 CATEGORY SAVE
  const handleSaveCategoryBudget = async (category) => {
    const value = categoryInputs[category];
    if (!value) return;

    await setCategoryBudget({
      category,
      amount: Number(value),
      month: currentMonth,
    });

    setCategoryBudgets({
      ...categoryBudgets,
      [category]: Number(value),
    });

    setCategoryInputs({
      ...categoryInputs,
      [category]: "",
    });

    toast.success(`${category} budget updated`);
  };

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

  const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f97316"];

  return (
    <Layout>

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-white text-3xl font-bold">Dashboard</h2>
        <p className="text-gray-400">Welcome back 👋</p>
      </div>

      {/* 🔥 MAIN BUDGET */}
      <div className="bg-slate-900/80 border border-white/10 p-6 rounded-2xl mb-6">

        <h3 className="text-white font-semibold mb-4">Monthly Budget</h3>

        <div className="flex gap-3 mb-4">
          <input
            type="number"
            placeholder="Set budget"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="p-2 rounded bg-white/10 text-white w-full"
          />

          <button onClick={handleSaveBudget} className="bg-indigo-500 px-4 rounded text-white">
            Save
          </button>
        </div>

        <div className="text-gray-300 text-sm mb-2">
          Budget: ₹{budget} | Spent: ₹{totalExpenses}
        </div>

        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full ${percent > 100 ? "bg-red-500" : "bg-green-500"}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>

        <p className="text-sm mt-2">
          {remaining < 0 ? (
            <span className="text-red-400">
              ⚠️ Over budget by ₹{Math.abs(remaining)}
            </span>
          ) : (
            <span className="text-green-400">
              Remaining ₹{remaining}
            </span>
          )}
        </p>
      </div>

      {/* 🔥 CATEGORY BUDGET */}
      <div className="bg-slate-900/80 border border-white/10 p-6 rounded-2xl mb-6">

        <h3 className="text-white font-semibold mb-4">Category Budgets</h3>

        {["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment"].map((cat) => {
          const spent = filteredExpenses
            .filter((t) => t.category === cat && t.type === "expense")
            .reduce((acc, t) => acc + Number(t.amount || 0), 0);

          const budgetValue = categoryBudgets[cat] || 0;
          const percent = budgetValue ? (spent / budgetValue) * 100 : 0;

          return (
            <div key={cat} className="mb-5">

              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>{cat}</span>
                <span>₹{spent} / ₹{budgetValue}</span>
              </div>

              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Set budget"
                  value={categoryInputs[cat] || ""}
                  onChange={(e) =>
                    setCategoryInputs({
                      ...categoryInputs,
                      [cat]: e.target.value,
                    })
                  }
                  className="p-1 text-sm rounded bg-white/10 text-white w-full"
                />

                <button
                  onClick={() => handleSaveCategoryBudget(cat)}
                  className="bg-indigo-500 px-3 text-sm rounded text-white"
                >
                  Save
                </button>
              </div>

              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    percent > 100 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>

            </div>
          );
        })}

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MonthlyChart data={monthlyData} />
        <CategoryChart data={filteredExpenses} COLORS={COLORS} />
      </div>

      {/* TRANSACTIONS */}
      <TransactionList data={filteredExpenses} />

      {/* FLOAT BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <button onClick={() => setShowIncome(true)} className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 text-white rounded-full text-xl shadow-2xl hover:scale-110 transition">
          ₹
        </button>

        <button onClick={() => setShowExpense(true)} className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-500 text-white rounded-full text-2xl shadow-2xl hover:scale-110 transition">
          +
        </button>
      </div>

      {showExpense && <ExpenseModal onClose={() => setShowExpense(false)} />}
      {showIncome && <IncomeModal onClose={() => setShowIncome(false)} />}

    </Layout>
  );
}

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