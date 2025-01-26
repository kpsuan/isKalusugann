import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Moon, 
  Sun, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import {
  signOut,
} from '../redux/user/userSlice';
import logo from '../assets/hsulogo.png';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Profile dropdown handlers
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
      navigate('/'); 
    } catch (error) {
      console.log(error);
    }
  };
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' }
  ];

  const profileMenuItems = [
    { 
      label: 'Profile', 
      icon: <User className="mr-2 h-4 w-4" />, 
      action: () => navigate('/profile') 
    },
    { 
      label: 'Settings', 
      icon: <Settings className="mr-2 h-4 w-4" />, 
      action: () => navigate('/settings') 
    },
    { 
      label: 'Sign Out', 
      icon: <LogOut className="mr-2 h-4 w-4" />, 
      action: handleSignOut 
    }
  ];

  return (
    <header className='sticky top-0 z-50 bg-white dark:bg-teal-900  shadow-md'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <Link to='/' className='flex items-center'>
            <img 
              src={logo} 
              alt="HSU Logo" 
              className='h-10 w-auto mr-4 transition-transform hover:scale-105' 
            />
          </Link>

          {/* Time and Theme Toggle */}
          <div className='hidden md:flex items-center space-x-4'>
            <p className='text-gray-600 dark:text-gray-300 font-light'>
              {currentTime}
            </p>
            <button 
              onClick={toggleTheme} 
              className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className='md:hidden'>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className='text-gray-600 dark:text-gray-300 hover:text-blue-500'
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`
                  ${location.pathname === item.path 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}
                  transition-colors duration-300 ease-in-out
                `}
              >
                {item.label}
              </Link>
            ))}

            {/* Profile/Sign In */}
            {currentUser ? (
              <div className='relative'>
                <button 
                  onClick={toggleProfileDropdown}
                  className='flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full'
                >
                  <img 
                    src={currentUser.profilePicture} 
                    alt='profile' 
                    onError={(e) => {e.target.src = '/default-avatar.png'}}
                    className='h-8 w-8 rounded-full object-cover border-2 border-blue-500' 
                  />
                  <ChevronDown className='ml-1 h-4 w-4 text-gray-600 dark:text-gray-300' />
                </button>

                {isProfileDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700'>
                    {profileMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setIsProfileDropdownOpen(false);
                        }}
                        className='flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg'
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to='/profile' 
                className='text-blue-700 dark:text-blue-400 hover:text-blue-900 font-semibold'
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>

       {/* Mobile Menu Dropdown */}
       {isMenuOpen && (
          <div className='md:hidden mt-4'>
            <ul className='bg-white shadow-lg rounded-lg'>
              {menuItems.map((item) => (
                <li 
                  key={item.path} 
                  className='border-b last:border-b-0'
                >
                  <Link 
                    to={item.path} 
                    className='block px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors'
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className='border-b last:border-b-0'>
                <Link 
                  to='/profile' 
                  className='block px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors'
                  onClick={toggleMenu}
                >
                  {currentUser ? 'Profile' : 'Sign In'}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}