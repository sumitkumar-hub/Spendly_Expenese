import express from 'express';
import { addTransaction, getTransactions, deleteTransaction } from '../controllers/transactionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', addTransaction);
router.get('/', getTransactions);
router.delete('/:id', deleteTransaction);

export default router;
