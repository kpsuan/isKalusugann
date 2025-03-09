import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure, clearError } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import logo from '../assets/logo1.png';
import Content from './Content';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setIsErrorVisible(true);
    } else {
      setIsErrorVisible(false);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSignInClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleAccept = async () => {
    setShowModal(false);
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

  const handleCancel = () => {
    setShowModal(false);
  };

  // Custom error component with animation
  const AnimatedError = ({ message }) => {
    return (
      <div className={`bg-red-100  border-red-500 text-red-700 p-4 rounded-md shadow-md mt-5
        ${isErrorVisible ? 'animate-bounce-in opacity-100' : 'opacity-0 transform translate-y-2'}
        transition-all duration-300 ease-in-out`}>
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="font-medium">{message || 'Something went wrong!'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className='aa bg-gradient-to-r from-green-200 to-blue-600 body-bg justify-center body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0 flex' >
      {/* Content section */}
      <div className="w-1/2 pl-32 mt-12">
        <Content />
      </div>

      {/* Sign In form section */}
      <div className='aa bg-white max-w-lg mx-auto p-8 md:p-12 mb-40 rounded-lg shadow-2xl flex-1'>
        <h1 className='text-4xl font-bold mt-3 mb-7'>Sign In</h1>
        <form className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            id='email'
            className={`bg-slate-100 p-3 rounded-lg ${error && error.field === 'email' ? 'border-2 border-red-500' : ''}`}
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            id='password'
            className={`bg-slate-100 p-3 rounded-lg ${error && error.field === 'password' ? 'border-2 border-red-500' : ''}`}
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80 transition-all duration-200'
            onClick={handleSignInClick}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : 'Sign In'}
          </button>

          <OAuth />
        </form>

        <div className='gap-2 mt-5 flex-col'>
          <Link to='/sign-up'>
            <span className='text-blue-500 hover:underline pl-35'>Forgot password</span>
          </Link>
        </div>

        <div className='flex gap-2 mt-5 w-full flex-col'>
          <Link to='/sign-up'>
            <button className='bg-transparent border-2 text-blue-500 p-3 rounded-lg uppercase hover:text-blue-700 disabled:opacity-80 w-full px-5 transition-colors duration-200'>
              Create an Account
            </button>
          </Link>
        </div>

        {/* Animated error message */}
        {error && <AnimatedError message={error.message} />}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <h2 className="text-2xl font-bold mb-4">Acceptable Use Policy</h2>
            <div className="mb-6">
              <p className="mb-4">By clicking "ACCEPT", you agree to the UP Acceptable Use Policy and UP Data Privacy Notice. Read the policies through these links:</p>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">
                  <a href="https://upd.edu.ph/aup/" 
                    target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"> • APPROVED ACCEPTABLE USE POLICY FOR INFORMATION TECHNOLOGY (IT) RESOURCES OF THE UP SYSTEM</a>
                </li>
                <li className="mb-2">
                  <a href="https://privacy.up.edu.ph/privacy-notices/Privacy%20Notice%20for%20UP%20Personnel.pdf" 
                     target="_blank" rel="noopener noreferrer"
                     className="text-blue-600 hover:underline"> • PRIVACY NOTICE FOR UNIVERSITY OF THE PHILIPPINES PERSONNEL</a>
                </li>
                <li className="mb-2">
                  <a href="https://privacy.up.edu.ph/privacy-notices/ups-privacy-notice-for-students.html"
                    target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"> • UNIVERSITY OF THE PHILIPPINES (UP) PRIVACY NOTICE FOR STUDENTS (REVISED AS OF THE 1st SEMESTER/TRIMESTER 2019-2020)</a>
                </li>
              </ul>
            </div>
            <div className="flex justify-end gap-4">
              <button 
                onClick={handleAccept}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                ACCEPT
              </button>
              <button 
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                DECLINE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}