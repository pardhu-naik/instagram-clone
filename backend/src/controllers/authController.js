const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, bio, profile_picture } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Check if user exists
        const [users] = await db.execute('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, bio, profile_picture) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, bio || null, profile_picture || null]
        );

        const newUserId = result.insertId;

        res.status(201).json({
            id: newUserId,
            username,
            email,
            token: generateToken(newUserId)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please add email and password' });
        }

        // Check for user email
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            profile_picture: user.profile_picture,
            bio: user.bio,
            token: generateToken(user.id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, username, email, profile_picture, bio, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user profile' });
    }
};
