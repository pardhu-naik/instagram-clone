import { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Settings, Grid, Bookmark, User } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${username}`);
        setProfileData(res.data);
      } catch (err) {
        console.error(err);
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (!currentUser) return <Navigate to="/login" />;
  if (loading) return <div className="flex justify-center mt-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;
  if (error) return <div className="text-center mt-12 text-2xl font-semibold text-gray-700">{error}</div>;

  const { user, posts } = profileData;
  const isOwner = currentUser.id === user.id;
  const profilePic = user.profile_picture || `https://ui-avatars.com/api/?name=${user.username}&background=random`;

  return (
    <div className="pt-8 md:pt-12 px-4 max-w-[935px] mx-auto w-full">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center mb-12 md:px-12">
        <div className="md:flex-1 flex justify-center md:justify-start xl:justify-center w-full md:w-auto mb-6 md:mb-0">
          <img src={profilePic} alt={user.username} className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover border border-gray-200 p-1" />
        </div>
        
        <div className="md:flex-[2] flex flex-col w-full">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-5 mb-4">
            <h2 className="text-xl font-normal leading-tight">{user.username}</h2>
            {isOwner ? (
              <div className="flex space-x-2">
                <button className="bg-gray-100 hover:bg-gray-200 transition-colors font-semibold px-4 py-1.5 rounded-lg text-sm">Edit profile</button>
                <button className="bg-gray-100 hover:bg-gray-200 transition-colors font-semibold px-4 py-1.5 rounded-lg text-sm">View archive</button>
                <button className="p-1.5 ml-1"><Settings size={20} /></button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button className="bg-[#0095f6] hover:bg-[#1877f2] transition-colors text-white font-semibold px-6 py-1.5 rounded-lg text-sm">Follow</button>
                <button className="bg-gray-100 hover:bg-gray-200 transition-colors font-semibold px-4 py-1.5 rounded-lg text-sm text-black">Message</button>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex space-x-10 mb-4">
            <span className="text-base"><span className="font-semibold">{posts.length}</span> posts</span>
            <span className="text-base cursor-pointer"><span className="font-semibold">342</span> followers</span>
            <span className="text-base cursor-pointer"><span className="font-semibold">218</span> following</span>
          </div>
          
          <div className="text-sm">
            <span className="font-semibold block">{user.username}</span>
            <p className="whitespace-pre-wrap mt-1 text-[15px]">{user.bio || 'Instagram User'}</p>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="flex md:hidden justify-around border-t border-gray-200 py-3 text-sm text-center">
        <div className="flex flex-col">
          <span className="font-semibold">{posts.length}</span>
          <span className="text-gray-500">posts</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">342</span>
          <span className="text-gray-500">followers</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">218</span>
          <span className="text-gray-500">following</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 flex justify-center md:space-x-12">
        <button className="flex items-center space-x-2 border-t border-black -mt-[1px] pt-4 pb-4 md:px-0 px-8">
          <Grid size={12} className="hidden md:block" />
          <span className="text-xs font-semibold tracking-widest text-black">POSTS</span>
        </button>
        {isOwner && (
          <>
            <button className="flex items-center space-x-2 pt-4 pb-4 md:px-0 px-8 text-gray-500 hover:text-black transition">
              <Bookmark size={12} className="hidden md:block" />
              <span className="text-xs font-semibold tracking-widest">SAVED</span>
            </button>
            <button className="flex items-center space-x-2 pt-4 pb-4 md:px-0 px-8 text-gray-500 hover:text-black transition">
              <User size={12} className="hidden md:block" />
              <span className="text-xs font-semibold tracking-widest">TAGGED</span>
            </button>
          </>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-8 pb-20">
        {posts.map(post => (
          <div key={post.id} className="aspect-square relative group bg-gray-100 cursor-pointer">
            <img 
              src={post.image_url.startsWith('http') ? post.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${post.image_url}`} 
              alt={post.caption} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center space-x-6 opacity-0 group-hover:opacity-100 text-white font-semibold">
              <div className="flex items-center space-x-2">
                <span className="drop-shadow-md">♥</span>
                <span>{post.likes_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl font-light">📷</span>
          </div>
          <h1 className="text-3xl font-light mb-4">Share Photos</h1>
          <p className="text-sm font-semibold max-w-sm">When you share photos, they will appear on your profile.</p>
          {isOwner && (
            <a href="/create" className="text-[#0095f6] hover:text-blue-900 font-semibold mt-4 text-sm">Share your first photo</a>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
