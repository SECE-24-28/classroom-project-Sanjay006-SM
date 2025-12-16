const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// POST: Save a new recharge transaction
router.post('/', async (req, res) => {
    try {
        const { userId, mobileNumber, operator, plan, amount } = req.body;

        // Simple validation
        if (!mobileNumber || !operator || !plan || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Generate a random Transaction ID (e.g., TXN-123456789)
        const transactionId = 'TXN-' + Math.floor(100000000 + Math.random() * 900000000);

        const newTransaction = new Transaction({
            transactionId,
            userId, // Optional: can be null for guest checkouts if needed, but schema says ref User
            mobileNumber,
            operator,
            plan,
            amount,
            status: 'Success', // Default to success for now
            date: new Date()
        });

        const savedTransaction = await newTransaction.save();

        res.status(201).json({
            message: 'Recharge successful',
            transaction: savedTransaction
        });

    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET: Retrieve history for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await Transaction.find({ userId }).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
