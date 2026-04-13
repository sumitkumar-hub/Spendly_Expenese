import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// 🔥 TOOLTIP
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded-lg border border-white/10 shadow-lg">
        <p className="text-sm mb-1">{label}</p>
        <p className="text-green-400 text-sm">
          Income: ₹{payload[0]?.value}
        </p>
        <p className="text-red-400 text-sm">
          Expense: ₹{payload[1]?.value}
        </p>
      </div>
    );
  }
  return null;
};

export default function MonthlyChart({ data }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg">

      <h3 className="text-white font-semibold mb-6">
        Monthly Overview
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#2e3440" />

          <XAxis
            dataKey="month"
            stroke="#aaa"
          />

          {/* 🔥 IMPORTANT FIX */}
          <YAxis
            stroke="#aaa"
            tickFormatter={(value) => `₹${value / 1000}k`}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* 🔥 INCOME */}
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />

          {/* 🔥 EXPENSE */}
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}