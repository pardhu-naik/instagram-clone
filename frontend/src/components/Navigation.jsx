import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Search, PlusCircle, User, LogOut, Camera } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={26} className={location.pathname === '/' ? 'text-black' : 'text-gray-600'} /> },
    { name: 'Search', path: '/search', icon: <Search size={26} className={location.pathname === '/search' ? 'text-black' : 'text-gray-600'} /> },
    { name: 'Create', path: '/create', icon: <PlusCircle size={26} className={location.pathname === '/create' ? 'text-black' : 'text-gray-600'} /> },
    { name: 'Profile', path: `/profile/${user.username}`, icon: <User size={26} className={location.pathname.startsWith('/profile') ? 'text-black' : 'text-gray-600'} /> },
  ];

  return (
    <>
      <div className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 bg-white fixed left-0 top-0 p-4">
        <Link to="/" className="mb-8 p-3 flex items-center space-x-2">
          <Camera size={28} />
          <span className="font-bold text-xl font-sans tracking-tight">Instagram</span>
        </Link>
        <div className="flex flex-col space-y-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg transition group">
              <div className="group-hover:scale-105 transition-transform">{item.icon}</div>
              <span className={`text-lg ${location.pathname === item.path ? 'font-bold' : ''}`}>{item.name}</span>
            </Link>
          ))}
        </div>
        <button onClick={logout} className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg transition text-red-500 mt-auto">
          <LogOut size={26} />
          <span className="text-lg">Logout</span>
        </button>
      </div>

      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-40">
        <span className="font-bold text-xl font-sans tracking-tight flex items-center gap-1"><Camera size={24}/> Instagram</span>
        <button onClick={logout} className="text-red-500"><LogOut size={24} /></button>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center p-3 z-50 h-[60px]">
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} className="p-2 transition-transform active:scale-95">
            {item.icon}
          </Link>
        ))}
      </div>
      
      <div className="hidden md:block w-64 flex-shrink-0"></div>
    </>
  );
};

export default Navigation;
