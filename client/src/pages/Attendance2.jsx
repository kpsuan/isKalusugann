import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/logo1.png';

export default function Attendance2() {
  const [queueNumber, setQueueNumber] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
      navigate(-1); // Redirect to previous page after signing out
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setQueueNumber(currentUser.queueNumber);
    }

    const timer = setTimeout(() => {
      handleSignOut();
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentUser]);

  return (
    <div className='aa bg-gradient-to-r from-green-200 to-blue-600 body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0'>
      <div className='aa bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl'>
        <img src={logo} alt='logo' className='w-full h-auto pl-5' />
        <h1 className='text-2xl text-center font-light my-7'>
          Welcome <span className='font-bold'>{currentUser.firstName}</span>
        </h1>
        <p className='text-center text-lg'>Your attendance has been recorded</p>
        <p className='text-center text-lg'>Your queue number for today:</p>
        <p className='font-bold p-10 text-9xl text-center text-blue-600'>
          {queueNumber !== null ? queueNumber : "Generating..."}
        </p>
        <p className='text-center text-lg'>
          Time: {new Date(currentUser.lastLoggedIn).toLocaleString()}
        </p>

        <button
          className='bg-slate-700 text-white border-2 text-blue-500 p-3 mt-4 rounded-lg uppercase hover:text-blue-200 disabled:opacity-80 w-full'
          onClick={handleSignOut}
        >
          Log Another User
        </button>
      </div>
    </div>
  );
}
