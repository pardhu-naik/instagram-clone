const db = require('../config/db');

exports.toggleLike = async (req, res) => {
    try {
        const { post_id } = req.body;
        const user_id = req.user.id;

        const [likes] = await db.execute('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', [user_id, post_id]);

        if (likes.length > 0) {
            await db.execute('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [user_id, post_id]);
            res.json({ message: 'Post unliked', action: 'unliked' });
        } else {
            await db.execute('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [user_id, post_id]);
            res.json({ message: 'Post liked', action: 'liked' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error toggling like' });
    }
};

exports.getPostLikes = async (req, res) => {
    try {
        const { id } = req.params;
        const [likes] = await db.execute(`
            SELECT u.id, u.username, u.profile_picture 
            FROM likes l
            JOIN users u ON l.user_id = u.id
            WHERE l.post_id = ?
        `, [id]);
        res.json(likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching likes' });
    }
};
