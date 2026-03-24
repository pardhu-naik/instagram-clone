CREATE DATABASE IF NOT EXISTS instagram_clone;
USE instagram_clone;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) DEFAULT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE(user_id, post_id)
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Dummy Data
-- Passwords for dummy users are invalid hashes, effectively preventing login. These are just for display.
INSERT IGNORE INTO users (id, username, email, password, bio, profile_picture) VALUES
(1, 'alex_photo', 'alex@example.com', '$2b$10$dummyHashToPreventLogin1234567890123456789', 'Capturing the world 📸', 'https://ui-avatars.com/api/?name=Alex+Photo&background=random'),
(2, 'sarah_travels', 'sarah@example.com', '$2b$10$dummyHashToPreventLogin1234567890123456789', 'Wanderlust ✨', 'https://ui-avatars.com/api/?name=Sarah+Travels&background=random');

INSERT IGNORE INTO posts (id, user_id, image_url, caption) VALUES
(1, 1, 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba', 'Golden hour at the beach! 🌅'),
(2, 2, 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538', 'Exploring the mountains ⛰️');

INSERT IGNORE INTO likes (user_id, post_id) VALUES
(1, 2),
(2, 1);

INSERT IGNORE INTO comments (user_id, post_id, comment_text) VALUES
(2, 1, 'Amazing shot!'),
(1, 2, 'So jealous!');
