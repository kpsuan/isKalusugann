// Import necessary modules and components
import React, { useState, useEffect } from "react";
import Sidebar from "../../SideBar Section/Sidebar";
import { useSelector } from 'react-redux';
import { Select, Alert, Button, Modal, ModalBody, TextInput, FileInput } from 'flowbite-react';
import "../../Annual/annual.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import {Link} from 'react-router-dom'
import {app} from '../../../../firebase';
import {CircularProgressbar} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from 'react-router-dom';


import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

const UserProfile = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [file, setFile] = useState([null]);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);


  // Get the user ID from URL parameters
    const { userId } = useParams();

    // Define state variables to store user information
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  // useEffect hook to fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const userData = await res.json();
        if (res.ok) {
          setUser(userData);
        } else {
          // Handle error if user not found or fetch fails
          console.error("Error fetching user data:", userData.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        // Set loading state to false after fetching user data
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Render loading state while fetching user data
  if (loading) {
    return <div>Loading...</div>;
  }

  
  const handleUploadImage = async () => {
    try {
        if(!file){
            setImageUploadError('Please select an image to upload');
            return;
        }
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageUploadError('Image upload failed');
                setImageUploadProgress(null);
            },

            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUploadError(null);
                    setImageUploadProgress(null);
                    setFormData({ ...formData, medcert: downloadURL });
                });
            }
        );

    } catch (error) {
        setImageUploadError('Image upload failed');
        setImageUploadProgress(null);
        console.log(error);
}
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/update/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        // Handle failure case here
        console.error('Failed to update user:', data.error);
        return;
      }
      // Handle success case here
      console.log('User updated successfully:', data);
      setUpdateSuccess(true);
      navigate('/manage-online');
    } catch (error) {
      // Handle error case here
      console.error('Error updating user:', error.message);
    }
  };
  
  // Render user profile if user data is available
  return (
    <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
            <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
      {user ? (
        <div>
          
          <div className=" rounded-lg border border-gray-200 p-10 w-full gap-3">
          <h1 className="text-2xl font-light mb-4">Student Information</h1>
          <div className=" flex items-center w-full gap-3">
            
            <img
                src={user.profilePicture}
                alt={user.username}
                className="profile-picture w-40 "
            />
                <div className = "flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold text-teal-500 mb-1">{`${user.firstName} ${user.middleName || ""} ${user.lastName}`}</h3>
                    <p className="text-2xl font-light text-teal-500 mb-1">Student Number: {user.username}</p>
                </div>
                </div>
                </div>
            <div className="px-2 py-10">
            <div className="mb-4 b">
                <p className="text-lg text-teal-500 ">Annual Physical Examination Form</p>
                <div className="flex items-center py-2">
                    <p className="w-1/2 text-sm mb-1 border border-green-500  px-2 py-2 inline-block">{user.lastName}_PE.pdf</p>
                    <Link className="ml-2 px-3 py-1 bg-green-500 text-white " to={user.peForm} target="_blank" rel="noopener noreferrer" >
                        View
                    </Link>
                </div>
            </div>
           
            <div className="mb-4 ">
                <p className="text-lg text-teal-500 ">Compiled Laboratory Results</p>
                <div className="flex items-center py-2">
                    <p className="w-1/2 text-sm mb-1 border border-green-500  px-2 py-2 inline-block">{user.lastName}_labResults.pdf</p>
                    <Link className="ml-2 px-3 py-1 bg-green-500 text-white " to={user.labResults} target="_blank" rel="noopener noreferrer" >
                        View
                    </Link>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-lg text-teal-500">Request for PE form</p>
                <div className="flex items-center py-2">
                    <p className="w-1/2 text-sm mb-1 border border-green-500  px-2 py-2 inline-block">{user.lastName}_requestforPE.pdf</p>
                    <Link className="ml-2 px-3 py-1 bg-green-500 text-white" to={user.requestPE} target="_blank" rel="noopener noreferrer" >
                        View
                    </Link>
                </div>
            </div>
        </div>

         <form className="flex flex-col gap-2" onSubmit={handleSubmit}>  
         <p className=" font-semibold text-lg text-teal-500 ">Approve or Deny the request</p>
         <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-row gap-2">
            <p className="text-center py-3">Select Status: </p> 
            <Select 
                type="select"
                id="status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                placeholder={formData.status}
                className="py-2 px-4 focus:outline-none focus:border-blue-500">
                    <option value="uncategorized">NO ACTION</option>
                    <option value="denied">DENIED</option>
                    <option value="approved">APPROVED</option>
            </Select> 
            </div>
        </div>
        <div className="mb-4 rounded-lg bg-green-500  border border-gray-200 p-4 w-1/3 hover:bg-green-600 text-white">
            <Link className="ml-2 px-3 py-1 text-black hover:underline  text-white " to={`/certificate/${user._id}`} target="_blank" rel="noopener noreferrer" >
                                Generate Medical Certificate
            </Link>
        </div>

        <div className="flex flex-col gap-2">
            <p className="text-start py-3">Attach Generated Medcert: </p> 
            <div className="flex gap-4 items-center justify-between border-4
                        border-teal-500 border-dotted p-3 w-3/4">
                            <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                            <Button 
                                type ='button' 
                                size='sm' 
                                className="text-lg  outline-black text-black px-14 py-4 rounded-md"
                                
                                onClick={handleUploadImage}
                                disabled={imageUploadProgress}
                                >
                                    {imageUploadProgress ? (
                                        <div className="w-16 h-16">
                                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} 
                                            />
                                        </div>
                                    ) : ('Upload image'
                                    )}
                                 </Button>
                    </div>

                    {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
                    {formData.medcert && (
                        <img src={formData.medcert} alt="upload" className="w-full h-full object-fit"/>
                    )}

        </div>

            Add Remarks :
            <ReactQuill 
                    theme="snow"  
                    id="comment"
                    
                    placeholder="Write something..." 
                    className="h-72 mb-12"
                    onChange={(value) => setFormData({ ...formData, comment: value})}/> 

            <Button type="submit" className="text-3xl bg-green-500 text-white hover:bg-green-600 py-2 rounded-md">
                Update Status 
            </Button>
            {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
            </form>
        </div>
      ) : (
        <div>User not found.</div>
      )}
    </div>
    </div>
    </div>
    </div>
  );
};

export default UserProfile;