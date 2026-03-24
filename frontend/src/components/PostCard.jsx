import { useState, useContext } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const loadComments = async () => {
    if (!showComments) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/comments/${post.id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error('Failed to load comments', err);
      }
    }
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/likes/toggle`, { post_id: post.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.action === 'liked') {
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      } else {
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/comments`, {
        post_id: post.id,
        comment_text: newComment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setComments([...comments, {
        id: res.data.id,
        comment_text: newComment,
        user_id: user.id,
        username: user.username,
        profile_picture: user.profile_picture,
        created_at: new Date().toISOString()
      }]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const profilePic = post.profile_picture || `https://ui-avatars.com/api/?name=${post.username}&background=random`;

  return (
    <div className="bg-white border-b sm:border border-gray-200 sm:rounded-lg mb-6 max-w-[470px] mx-auto pb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${post.username}`} className="flex items-center space-x-3">
          <img src={profilePic} alt={post.username} className="w-8 h-8 rounded-full object-cover" />
          <span className="font-semibold text-sm">{post.username}</span>
          <span className="text-gray-500 text-sm">• {moment(post.created_at).fromNow(true)}</span>
        </Link>
        <button><MoreHorizontal size={20} className="text-gray-600" /></button>
      </div>

      {/* Post Image */}
      <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden max-h-[585px]">
        <img 
          src={post.image_url.startsWith('http') ? post.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${post.image_url}`} 
          alt="Post content" 
          className="w-full object-cover max-h-[585px]" 
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-black hover:text-gray-500'} transition-transform active:scale-125 duration-200`}>
              <Heart size={26} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button onClick={loadComments} className="hover:text-gray-500 active:scale-95 transition-transform"><MessageCircle size={26} /></button>
            <button className="hover:text-gray-500 active:scale-95 transition-transform"><Send size={26} /></button>
          </div>
          <button className="hover:text-gray-500 active:scale-95 transition-transform"><Bookmark size={26} /></button>
        </div>

        <div className="font-semibold text-sm mb-1">{likesCount} likes</div>

        {/* Caption */}
        {post.caption && (
          <div className="text-sm mb-2">
            <Link to={`/profile/${post.username}`} className="font-semibold mr-2">{post.username}</Link>
            <span>{post.caption}</span>
          </div>
        )}

        {/* Comments Section */}
        <button onClick={loadComments} className="text-gray-500 text-sm mb-2">
          {showComments ? 'Hide comments' : 'View all comments'}
        </button>

        {showComments && (
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
            {comments.map(c => (
              <div key={c.id} className="text-sm flex justify-between group">
                <div>
                  <Link to={`/profile/${c.username}`} className="font-semibold mr-2">{c.username}</Link>
                  <span>{c.comment_text}</span>
                </div>
                <button><Heart size={12} className="text-gray-400 group-hover:text-gray-600" /></button>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <form onSubmit={handleCommentSubmit} className="flex items-center border-t border-gray-100 pt-3 relative">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full text-sm outline-none py-1 bg-transparent pr-12"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {newComment && (
            <button type="submit" className="text-[#0095f6] text-sm font-semibold hover:text-[#1877f2] absolute right-0 top-3">Post</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostCard;
