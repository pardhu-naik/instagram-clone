const db = require('../config/db');

exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!image_url) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const [result] = await db.execute(
            'INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)',
            [req.user.id, image_url, caption || null]
        );

        res.status(201).json({
            id: result.insertId,
            user_id: req.user.id,
            image_url,
            caption
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating post' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.image_url, p.caption, p.created_at, 
                   u.id as user_id, u.username, u.profile_picture,
                   (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as likes_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `;
        const [posts] = await db.execute(query);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching posts' });
    }
};
