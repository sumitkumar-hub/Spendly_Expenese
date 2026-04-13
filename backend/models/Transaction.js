import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    // 🔥 UPGRADED CATEGORY SYSTEM
    category: {
      type: String,
      enum: [
        // INCOME
        "Salary",
        "Freelance",
        "Business",

        // EXPENSE
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Health",
        "Entertainment",

        // DEFAULT
        "Other",
      ],
      default: "Other",
    },

    note: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

export default Transaction;