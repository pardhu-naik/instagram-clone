import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 pb-20 md:pb-0">
      <div className="w-full max-w-[350px]">
        <div className="bg-white border border-gray-300 p-8 pt-10 pb-6 rounded-sm text-center">
          <h1 className="text-4xl font-bold font-sans mb-8 tracking-tight">Instagram</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-50 border border-gray-300 text-xs px-2 py-[9px] rounded-sm focus:outline-none focus:border-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-50 border border-gray-300 text-xs px-2 py-[9px] rounded-sm focus:outline-none focus:border-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#0095f6] hover:bg-[#1877f2] transition-colors text-white font-semibold py-1.5 rounded-lg mt-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={!email || password.length < 6}
            >
              Log in
            </button>
          </form>
          <div className="flex items-center justify-center my-4 space-x-2">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-[13px] font-semibold">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <p className="text-[#385185] text-sm font-semibold cursor-pointer">Log in with Facebook</p>
          <p className="text-xs text-[#00376b] mt-4 inline-block cursor-pointer">Forgot password?</p>
        </div>
        
        <div className="bg-white border border-gray-300 p-5 rounded-sm mt-3 text-center text-sm">
          <p>Don't have an account? <Link to="/signup" className="text-[#0095f6] font-semibold text-sm">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
