const db = require('../config/db');

exports.addComment = async (req, res) => {
    try {
        const { post_id, comment_text } = req.body;
        const user_id = req.user.id;

        if (!comment_text) {
            return res.status(400).json({ message: 'Please add a comment text' });
        }

        const [result] = await db.execute(
            'INSERT INTO comments (user_id, post_id, comment_text) VALUES (?, ?, ?)',
            [user_id, post_id, comment_text]
        );

        res.status(201).json({
            id: result.insertId,
            user_id,
            post_id,
            comment_text
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding comment' });
    }
};

exports.getPostComments = async (req, res) => {
    try {
        const { id } = req.params; // post id
        const [comments] = await db.execute(`
            SELECT c.id, c.comment_text, c.created_at, 
                   u.id as user_id, u.username, u.profile_picture 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `, [id]);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching comments' });
    }
};
