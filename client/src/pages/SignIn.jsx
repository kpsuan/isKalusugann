import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import logo from '../assets/logo1.png';




export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/dashboard');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  return (
    <div className='aa bg-gradient-to-r from-green-200 to-blue-600 body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0'>
   
      <div className='aa bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl'>
      <img src={logo} alt='logo' className='w-full h-auto pl-5' />
      <h1 className='text-2xl text-center font-light my-7'>A UPV HSU Portal</h1>
      
      <form onSubmit={handleSubmit} className=' flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>

        <OAuth />
      </form>
      <div className='gap-2 mt-5'>
        <Link to='/sign-up'>
          <span className='text-blue-500 hover:underline pl-35'>Forgot password</span>
        </Link>
      </div>
      <div className='aa flex gap-2 mt-5 w-full pl-20'>
        <Link to='/sign-up'>
          <button className='bg-transparent border-2 text-blue-500 p-3 rounded-lg uppercase hover:text-blue-700 disabled:opacity-80 w-full px-5'>
           Create an Account
          </button>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>
        {error ? error.message || 'Something went wrong!' : ''}
      </p>
    </div>
    </div>
  );
}
