import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 md:pt-12 px-4 max-w-[600px] mx-auto w-full">
      <div className="bg-white border sm:border border-gray-200 sm:rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 p-3 text-center font-semibold">
          Create new post
        </div>
        
        <div className="p-4 md:p-8">
          {!preview ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 file-select-wrap">
              <ImagePlus size={48} className="text-gray-400 mb-4" />
              <p className="text-xl font-light mb-4 text-center">Drag photos and videos here</p>
              <label className="bg-[#0095f6] hover:bg-[#1877f2] transition-colors text-white font-semibold py-1.5 px-4 rounded-lg cursor-pointer text-sm">
                Select from computer
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center max-h-[400px]">
                <img src={preview} alt="Preview" className="max-h-[400px] object-cover" />
              </div>
              
              <div className="flex items-start space-x-3 mb-4">
                <img src={user.profile_picture || `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt="Profile" className="w-8 h-8 rounded-full" />
                <textarea
                  className="w-full h-24 text-sm outline-none resize-none pt-1 bg-transparent"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2 border-t border-gray-200 pt-3">
                <button 
                  type="button" 
                  onClick={() => { setImage(null); setPreview(''); setCaption(''); }}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                >
                  Clear
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#0095f6] hover:bg-[#1877f2] transition-colors text-white font-semibold py-2 px-6 rounded-lg text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sharing...' : 'Share'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
