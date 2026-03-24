import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="pt-8 md:pt-12 px-2 max-w-[600px] mx-auto w-full">
      {/* Stories Placeholder */}
      <div className="flex space-x-4 overflow-x-auto mb-8 pb-4 scrollbar-hide">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-1 min-w-[70px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px] cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="story" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs text-gray-800 truncate w-16 text-center">user_{i}</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          <p>No posts yet. Follow some people or create your own post!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default Home;
