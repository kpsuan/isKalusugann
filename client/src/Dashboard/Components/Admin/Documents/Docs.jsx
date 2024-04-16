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

const DocsUploader = () => {
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
    </div>
    </div>
    </div>
    </div>
  );
};

export default DocsUploader;
