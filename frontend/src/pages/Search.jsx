import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="pt-8 md:pt-12 px-4 max-w-[600px] mx-auto w-full min-h-screen">
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="text-gray-400" size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm font-light outline-none border border-transparent focus:border-gray-300 focus:bg-white transition-colors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col space-y-4">
        {loading && <div className="text-center text-gray-500 py-4">Searching...</div>}
        
        {!loading && query && results.length === 0 && (
          <div className="text-center text-gray-500 py-4 font-semibold">No results found.</div>
        )}
        
        {!loading && results.map(u => (
          <Link key={u.id} to={`/profile/${u.username}`} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
            <img 
              src={u.profile_picture || `https://ui-avatars.com/api/?name=${u.username}&background=random`} 
              alt={u.username} 
              className="w-12 h-12 rounded-full object-cover" 
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{u.username}</span>
              <span className="text-gray-500 text-sm">{u.username}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
