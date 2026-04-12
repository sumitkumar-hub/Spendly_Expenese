import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

export const addTransaction = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { amount, type, category, date } = req.body;
    if (amount == null || !type || !category) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction type' });
    }

    const transaction = await Transaction.create({
      userId,
      amount,
      type,
      category,
      date: date ? new Date(date) : Date.now(),
    });

    return res.status(201).json({ success: true, message: 'Transaction added', data: transaction });
  } catch (err) {
    console.error('addTransaction error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    return res.json({ success: true, data: transactions });
  } catch (err) {
    console.error('getTransactions error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction id' });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== userId.toString()) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await transaction.deleteOne();

    return res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    console.error('deleteTransaction error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
