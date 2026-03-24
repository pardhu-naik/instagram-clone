import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Search = lazy(() => import('./pages/Search'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
          <Navigation />
          <main className="flex-1 w-full max-w-4xl mx-auto pb-16 md:pb-0 overflow-y-auto">
            <Suspense fallback={<div className="flex h-[80vh] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
