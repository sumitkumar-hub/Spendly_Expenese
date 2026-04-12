import Transaction from '../models/Transaction.js';

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const transactions = await Transaction.find({ userId });

    const { totalIncome, totalExpense } = transactions.reduce(
      (acc, tx) => {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'income') acc.totalIncome += amt;
        if (tx.type === 'expense') acc.totalExpense += amt;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );

    const balance = totalIncome - totalExpense;

    return res.json({ success: true, data: { totalIncome, totalExpense, balance } });
  } catch (err) {
    console.error('getDashboardData error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default getDashboardData;
