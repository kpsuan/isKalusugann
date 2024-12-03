import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import logo from '../assets/logo1.png';
import hsulogo from '../assets/hsulogo.png';


export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // useEffect hook to update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000); // Update every second

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  return (
    <div className='bg-white'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3 h-15'>
        
        <Link to='/'>
          <img className='mx-auto h-10 w-auto' src={hsulogo} alt="logo2" />
        </Link>
        <div>
          <p className='font-light'>Current Time: {currentTime}</p>
        </div>
        <ul className='flex gap-4 text-lg'>
          <Link to='/'>
            <li className='border-b-2  border-transparent hover:border-blue-500'>Home</li>
          </Link>
          
          <Link to='/dashboard'>
            <li className='border-b-2  border-transparent hover:border-blue-500'>Dashboard</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li className='border-b-2 font-semibold text-blue-700 border-transparent hover:border-blue-500'>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
