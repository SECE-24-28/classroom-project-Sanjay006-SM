const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// Get All Plans
router.get('/', async (req, res) => {
    try {
        const plans = await Plan.find().sort({ id: 1 });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching plans' });
    }
});

// Create Plan (Admin)
router.post('/', async (req, res) => {
    try {
        const { price, validity, data, calls, sms, benefits, operator } = req.body;

        const lastPlan = await Plan.findOne().sort({ id: -1 });
        const newId = lastPlan ? lastPlan.id + 1 : 1;

        const newPlan = new Plan({
            id: newId,
            price,
            validity,
            data,
            calls,
            sms,
            benefits,
            operator: operator || 'Jio'
        });

        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ message: 'Error creating plan' });
    }
});

// Update Plan (Admin)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const plan = await Plan.findOneAndUpdate({ id: id }, updatedData, { new: true });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Error updating plan' });
    }
});

// Seed Initial Plans (Run once)
router.post('/seed', async (req, res) => {
    try {
        // Clear existing plans to avoid duplicates/conflicts during development
        await Plan.deleteMany({});

        const initialPlans = [
            // JIO PLANS
            {
                id: 1, operator: 'Jio', price: '₹299', validity: '28 Days', data: '2GB/day', calls: 'Unlimited', sms: '100/day',
                benefits: ['JioTV', 'JioCinema', 'JioCloud'], popular: true
            },
            {
                id: 2, operator: 'Jio', price: '₹666', validity: '84 Days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day',
                benefits: ['JioTV', 'JioCinema']
            },
            {
                id: 3, operator: 'Jio', price: '₹2999', validity: '365 Days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day',
                benefits: ['JioTV', 'JioCinema', '5G Data']
            },

            // AIRTEL PLANS
            {
                id: 11, operator: 'Airtel', price: '₹299', validity: '28 Days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day',
                benefits: ['Apollo 24|7', 'Free Hellotunes'], popular: true
            },
            {
                id: 12, operator: 'Airtel', price: '₹719', validity: '84 Days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day',
                benefits: ['Disney+ Hotstar', 'Xstream App']
            },
            {
                id: 13, operator: 'Airtel', price: '₹1799', validity: '365 Days', data: '24GB', calls: 'Unlimited', sms: '3600 SMS',
                benefits: ['Apollo 24|7', 'Wynk Music']
            },

            // VI PLANS
            {
                id: 21, operator: 'Vi', price: '₹299', validity: '28 Days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day',
                benefits: ['Binge All Night', 'Weekend Data Rollover'], popular: true
            },
            {
                id: 22, operator: 'Vi', price: '₹479', validity: '56 Days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day',
                benefits: ['Vi Movies & TV']
            },
            {
                id: 23, operator: 'Vi', price: '₹3099', validity: '365 Days', data: '2GB/day', calls: 'Unlimited', sms: '100/day',
                benefits: ['Disney+ Hotstar Mobile']
            },

            // BSNL PLANS
            {
                id: 31, operator: 'BSNL', price: '₹147', validity: '30 Days', data: '10GB', calls: 'Unlimited', sms: 'N/A',
                benefits: ['BSNL Tunes'], popular: true
            },
            {
                id: 32, operator: 'BSNL', price: '₹397', validity: '180 Days', data: '2GB/day', calls: 'Unlimited', sms: '100/day',
                benefits: ['Lokdhun Content']
            }
        ];

        await Plan.insertMany(initialPlans);
        res.json({ message: 'Plans seeded successfully with operator data!' });
    } catch (error) {
        res.status(500).json({ message: 'Error seeding plans', error: error.message });
    }
});

module.exports = router;
