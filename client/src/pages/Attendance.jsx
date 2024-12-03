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

export default function Attendance() {
  const [formData, setFormData] = useState({}); // Initialize form data
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle form input changes and update form data state
  const updateFormData = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default behavior
    try {
      dispatch(signInStart()); // Dispatch login start action

      // Send form data to backend via POST request
      const res = await fetch('/api/auth/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      // Parse the response
      const data = await res.json();

      // Handle failure case
      if (!res.ok) {
        dispatch(signInFailure(data));
        return;
      }

      // Extract lastLoggedIn from response and save it
      const lastLoggedIn = data.lastLoggedIn;
      dispatch(signInSuccess({ ...data, lastLoggedIn }));

      // Navigate to another page after successful login
      navigate('/attendance2');
    } catch (error) {
      dispatch(signInFailure(error)); // Dispatch login failure action
    }
  };

  return (
    <div className='aa bg-gradient-to-r from-green-200 to-blue-600 body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0'>
      <div className='aa bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl'>
        <img src={logo} alt='logo' className='w-full h-auto pl-5' />
        <h1 className='text-2xl text-center font-light my-7'>A UPV HSU Portal</h1>
        
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            id='email'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={updateFormData} // Update form data on input change
          />
          <input
            type='password'
            placeholder='Password'
            id='password'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={updateFormData} // Update form data on input change
          />
          <button
            disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
        
        <p className='text-red-700 mt-5'>
          {error ? error.message || 'Something went wrong!' : ''}
        </p>
      </div>
    </div>
  );
}
