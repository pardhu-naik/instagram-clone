import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
    } catch (err) {
      setError(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 pb-20 md:pb-0">
      <div className="w-full max-w-[350px]">
        <div className="bg-white border border-gray-300 p-8 pt-10 pb-6 rounded-sm text-center">
          <h1 className="text-4xl font-bold font-sans mb-4 tracking-tight">Instagram</h1>
          <p className="text-[#737373] text-[17px] font-semibold mb-6 leading-5">
            Sign up to see photos and videos from your friends.
          </p>
          
          <button className="w-full bg-[#0095f6] hover:bg-[#1877f2] transition-colors text-white font-semibold flex items-center justify-center py-1.5 rounded-lg mb-4 text-sm">
            Log in with Facebook
          </button>
          
          <div className="flex items-center justify-center mb-4 space-x-2">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-[13px] font-semibold">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-gray-50 border border-gray-300 text-xs px-2 py-[9px] rounded-sm focus:outline-none focus:border-gray-400"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="bg-gray-50 border border-gray-300 text-xs px-2 py-[9px] rounded-sm focus:outline-none focus:border-gray-400"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-gray-50 border border-gray-300 text-xs px-2 py-[9px] rounded-sm focus:outline-none focus:border-gray-400"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="bio"
              placeholder="Bio (Optional)"
              className="bg-gray-50 border border-gray-300 text-xs px-2 py-[9px] rounded-sm focus:outline-none focus:border-gray-400"
              onChange={handleChange}
            />
            <p className="text-[11px] text-[#737373] mt-3 leading-[14px] text-center mb-3">
              People who use our service may have uploaded your contact information to Instagram.
            </p>
            <button
              type="submit"
              className="bg-[#0095f6] hover:bg-[#1877f2] transition-colors text-white font-semibold py-1.5 rounded-lg mt-3 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={!formData.email || !formData.username || formData.password.length < 6}
            >
              Sign up
            </button>
          </form>
        </div>
        
        <div className="bg-white border border-gray-300 p-5 rounded-sm mt-3 text-center text-sm">
          <p>Have an account? <Link to="/login" className="text-[#0095f6] font-semibold text-sm">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
