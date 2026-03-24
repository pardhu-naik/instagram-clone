const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const [users] = await db.execute('SELECT id, username, bio, profile_picture, created_at FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = users[0];

        const [posts] = await db.execute(`
            SELECT p.id, p.image_url, p.caption, p.created_at,
                   (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as likes_count
            FROM posts p
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `, [user.id]);

        res.json({ user, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }

        const searchTerm = `%${q}%`;
        const [users] = await db.execute('SELECT id, username, profile_picture FROM users WHERE username LIKE ? LIMIT 10', [searchTerm]);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error searching users' });
    }
};
