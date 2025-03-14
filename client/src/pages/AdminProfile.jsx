import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Card, Carousel  } from 'flowbite-react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '../Dashboard/Components/SideBar Section/Sidebar';
import Top from '../Dashboard/Components/Profile/Components/Header';
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
import '../App.css';

export default function AdminProfile() {
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
    } if (id === "graduating") {
      setFormData({ ...formData, isGraduating: value==="yes" });
    } else {
      // For other input fields, update the state normally
      setFormData({ ...formData, [id]: value });
    }
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
        toast.error('Something went wrong!');
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success('User is updated successfully!');

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
    <div className="dashboard flex">
        <div className="dashboardContainer flex">
          <Sidebar/>
          
          <div className="mainContent">
          <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="bg-gradient-to-r from-cyan-600 to-green-500 border-none">
                <div className="relative overflow-hidden p-8">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <h1 className="text-3xl font-bold text-white">
                        User Profile
                      </h1>
                    </div>
                    
                  </div>
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mt-16 -mr-16 blur-3xl" />
                </div>
              </Card>
            </motion.div>
            <div className='p-3  mx-auto mt-10'>
              
                <div className="flex flex-row space-x-5">
                  <Card className='w-2/3 h-full '>
                  <ToastContainer className={"z-50"} />

                    <div className="text-2xl font-light tracking-tight p-7 text-black dark:text-white">
                      <h1 className='text-2xl font-semibold  text-black '>General Information</h1>
                      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
                      <div className="flex flex-row gap-3">
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">First Name:</p>
                          <input
                            type="text"
                            id="firstName"
                            placeholder={currentUser.firstName ? currentUser.firstName : "First Name"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Middle Name:</p>
                          <input
                            type="text"
                            id="middleName"
                            placeholder={currentUser.middleName ? currentUser.middleName : "Middle Name"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Last Name:</p>
                          <input
                            type="text"
                            id="lastName"
                            placeholder={currentUser.lastName ? currentUser.lastName : "Last Name"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="flex flex-row gap-3">
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Birthday:</p>
                          <input
                            type="date"
                            id="dateOfBirth"
                            placeholder={currentUser.dateOfBirth ? currentUser.dateOfBirth : "Birthday"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Email:</p>
                          <input
                            type="email"
                            id="email"
                            placeholder={currentUser.email ? currentUser.email : "Email"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Username:</p>
                          <input
                            type="text"
                            id="username"
                            placeholder={currentUser.username ? currentUser.username : "Username"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      
                        <h1 className='text-2xl  mt-5 font-semibold'>License</h1>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">License Number:</p>
                          <input
                            type="text"
                            id="license"
                            placeholder={currentUser.licenseNumber ? currentUser.licenseNumber : "License Number"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <button className='mt-10 bg-gradient-to-r from-green-500 to-cyan-500 text-white text-lg font-semibold p-3 rounded-lg uppercase hover:from-green-600 hover:to-cyan-600 disabled:opacity-80'>
                          {loading ? 'Loading...' : 'Update'}
                        </button>
                      </form>
                      
                    </div>
                  </Card>
                  <Card className='w-1/3 h-full'> 
                    <div className="text-2xl font-light tracking-tight  dark:text-white"></div>
                    <input
                      type='file'
                      ref={fileRef}
                      hidden
                      accept='image/*'
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <div className="relative">
                      {/* Carousel */}
                      <div className="h-20 sm:h-20 xl:h-40 2xl:h-80">
                        <Carousel slide={false}>
                          <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
                          <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
                          <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
                          <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
                          <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
                        </Carousel>
                      </div>

                      {/* Profile Picture overlapping the carousel */}
                      <div 
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 h-24 w-24 cursor-pointer rounded-full border-4 border-white"
                        onClick={() => fileRef.current.click()}
                      >
                        <img
                          src={formData.profilePicture || currentUser.profilePicture}
                          alt="profile"
                          className="h-full w-full rounded-full object-cover"
                        />
                        
                        {/* Gray overlay on hover */}
                        <div className="absolute inset-0 bg-gray-600 opacity-0 hover:opacity-75 rounded-full flex items-center justify-center transition-opacity duration-300">
                          <span className="text-white text-sm p-2 text-center">Change Photo</span>
                        </div>
                      </div>
                    </div>



                    <p className='text-sm self-center pt-10'>
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
                    
                    <div className='flex flex-col justify-center p-1 text-center'>
                      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {`${currentUser.firstName} ${currentUser.middleName || ""} ${currentUser.lastName}`}
                      </h5>
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        License Number: {currentUser.licenseNumber}
                      </p>
                      <p className="font-normal text-sm text-gray-400 dark:text-gray-400">
                      {`${currentUser.username} |  ${currentUser.email} `}
                      </p>
                    </div>

                    <div className='flex flex-col justify-center p-3 text-center justify-center w-full'>
                      <span
                        onClick={handleDeleteAccount}
                        className='text-red-700 cursor-pointer bg-cyan-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                      >
                        Change Password
                      </span>
                      <span onClick={handleSignOut} 
                        className='mt-2 text-black hover:text-slate-900 cursor-pointer bg-transparent border border-green-600 font-bold py-2 px-4 rounded'>
                        Sign out
                      </span>
                    </div>

                  </Card>
                </div>
                
            </div> 
          </div>

        </div>
    </div>
    
  );
}
