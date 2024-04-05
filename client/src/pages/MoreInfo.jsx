import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
{/*
const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

  };
*/}
  
  const handleChange = (e) => {
    const { id, value, type } = e.target;
    if (type === 'radio') {
      // For radio buttons, set the value directly to the state
      setFormData({ ...formData, gender: value });
    } else {
      // For other input fields, update the state normally
      setFormData({ ...formData, [id]: value });
    }
  };

   // Change handlers for the dropdowns
   const handleDegreeLevelChange = (e) => {
    // Update formData with the selected degree level
    setFormData({ ...formData, degreeLevel: e.target.value });
  };

  const handleYearLevelChange = (e) => {
    // Update formData with the selected year level
    setFormData({ ...formData, yearLevel: e.target.value });
  };

  const handleCollegeChange = (e) => {
    // Update formData with the selected college
    setFormData({ ...formData, college: e.target.value });
  };

  const handleDegreeProgramChange = (e) => {
    // Update formData with the selected degree program
    setFormData({ ...formData, degreeProgram: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Complete your Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
{/*
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImge(e.target.files[0])}
        />
        {/* 
      firebase storage rules:  
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') 
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>
    */}
    <h2 className='text-1xl font-semibold my-2 text-gray-500'>Personal Info</h2>
        <input
          type='text'
          id='firstName'
          placeholder='FirstName'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          type='text'
          id='middleName'
          placeholder='Middle Name'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          type='text'
          id='lastName'
          placeholder='Last Name'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />

        <input
          type='date'
          id='dateOfBirth'
          placeholder='Birthday'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        
        <div className="mt-1">
        <label className="block text-sm font-medium text-gray-700 pb-2">
          Sex
        </label>
        <div className="flex items-center space-x-4 mb-4">
      
            <label className="inline-flex items-center">
                <input
                type='radio'
                id='male'
                value="male"
                className="form-radio h-5 w-5 text-indigo-600"
                onChange={handleChange}
                checked={formData.gender === 'male'} 
                />
                <span className="ml-2 text-gray-700">Male</span>
            </label>

            <label className="inline-flex items-center">
                <input
                type='radio'
                id='female'
                value="female"
                className="form-radio h-5 w-5 text-indigo-600"
                onChange={handleChange}
                checked={formData.gender === 'female'} 
                />
                <span className="ml-2 text-gray-700">Female</span>
            </label>

            <label className="inline-flex items-center">
                <input
                type='radio'
                id='other'
                value="other"
                className="form-radio h-5 w-5 text-indigo-600"
                onChange={handleChange}
                checked={formData.gender === 'other'} 
                />
                <span className="ml-2 text-gray-700">Other</span>
            </label>
            </div>
            </div>

        {/* Education */}
        <div className="mt-1">
          <h2 className='text-1xl font-semibold my-2 text-gray-500'>Education</h2>
        </div>
        
        <div className='space-y-6'>
          {/* Degree Level */}
          <div className="mt-1">
            <label className="block text-sm font-medium text-gray-700 pb-2">
              Degree Level
            </label>
            <select
              id="degreeLevel"
              onChange={handleChange}
              value={formData.degreeLevel}
              className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Degree Level</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
            </select>
          </div>

          {/* Year Level */}
          <div className="mt-1">
            <label className="block text-sm font-medium text-gray-700 pb-2">
              Year Level
            </label>
            <select
              id="yearLevel"
              onChange={handleChange}
              value={formData.yearLevel}
              className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Year Level</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          {/* College */}
          <div className="mt-1">
            <label className="block text-sm font-medium text-gray-700 pb-2">
              College
            </label>
            <select
              id="college"
              onChange={handleChange}
              value={formData.college}
              className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select College</option>
              <option value="CAS">CAS</option>
              <option value="CFOS">CFOS</option>
              <option value="CM">CM</option>
              <option value="SOTECH">SOTECH</option>
            </select>
          </div>

          {/* Degree Program */}
          {formData.college === 'CAS' && (
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                Degree Program
              </label>
              <select
                id="degreeProgram"
                onChange={handleChange}
                value={formData.degreeProgram}
                className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Degree Program</option>
                <option value="BS Biology">BS Biology</option>
                <option value="BS Public Health">BS Public Health</option>
                <option value="BA Communication and Media Studies">BA Communication and Media Studies</option>
                <option value="BA Literature">BA Literature</option>
                <option value="BA History"> BA History</option>
                <option value="BA Community Development">BA Community Development</option>
                <option value="BS Economics">BS Economics</option>
                <option value="BA Political Science">BA Political Science</option>
                <option value="BA Psychology">BA Psychology</option>
                <option value="BA Sociology">BA Sociology</option>
                <option value="BS Applied Mathematics">BS Applied Mathematics</option>
                <option value="BS Chemistry">BS Chemistry</option>
                <option value="BS Computer Science">BS Computer Science</option>
                <option value="BS Statistics">BS Statistics</option>
              </select>
            </div>
          )}

          {formData.college === 'CFOS' && (
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                Degree Program
              </label>
              <select
                id="degreeProgram"
                onChange={handleChange}
                value={formData.degreeProgram}
                className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Degree Program</option>
                <option value="BS Fisheries">BS Fisheries</option>
              </select>
            </div>
          )}

          {formData.college === 'CM' && (
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                Degree Program
              </label>
              <select
                id="degreeProgram"
                onChange={handleChange}
                value={formData.degreeProgram}
                className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Degree Program</option>
                <option value="BS Accountancy">BS Accountancy</option>
                <option value="BS Business Administration">BS Business Administration</option>
                <option value="BS Management">BS Management</option>
              </select>
            </div>
          )}
        </div>












        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-700 cursor-pointer'
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User is updated successfully!'}
      </p>
    </div>
  );
}
