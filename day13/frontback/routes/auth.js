const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for admin credentials explicitly (Hardcoded Admin)
        if (email === 'admin@rechargehub.com' && password === 'admin123') {
            const token = jwt.sign(
                { id: 'admin-1', role: 'admin' },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.json({
                token,
                user: {
                    id: 'admin-1',
                    name: 'Administrator',
                    email: 'admin@rechargehub.com',
                    role: 'admin'
                }
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare Password (Bcrypt)
        // NOTE: This will fail for existing plain-text users until they reset or we clear DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Fallback for DEV ONLY: If compare fails, check plaintext (for existing users)
            // Remove this block in production!
            if (user.password === password) {
                // Logic to upgrade password could go here
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        }

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check existing
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

module.exports = router;
