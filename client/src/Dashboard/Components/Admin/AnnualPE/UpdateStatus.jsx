import React, { useState, useEffect } from "react";
import Sidebar from "../../SideBar Section/Sidebar";
import { useSelector } from 'react-redux';
import { Select, Button, Badge, Modal, ModalBody, TextInput, FileInput } from 'flowbite-react';
import Alert from '@mui/material/Alert';

import "../../Annual/annual.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { app } from '../../../../firebase';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import axios from 'axios';

import {HiOutlineUpload} from 'react-icons/hi';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [scrollTop, setScrollTop] = useState(false);

  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const userData = await res.json();
        if (res.ok) {
          setUser(userData);
          setFormData({ status: userData.status, medcert: userData.medcert, comment: userData.comment });
        } else {
          console.error("Error fetching user data:", userData.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (scrollTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setScrollTop(false);
    }
  }, [scrollTop]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
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
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
      // Step 1: Update the user data
      const res = await fetch(`/api/user/update/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
  
      if (data.success === false) {
        console.error('Failed to update user:', data.error);
        toast.error("Failed to update status of user.");
        return;
      }
  
      // Step 2: Send email notification to the user
      const emailResponse = await axios.post('/api/email/emailUser', {
        email: user.email,
        subject: 'Your Annual PE Status Update',
        text: `Dear ${user.firstName},\n\nYour annual PE status is ${user.status}. Here is your comment: ${user.comment}\n\n Your generated medical certificate can be viewed in the system or alternatively here: ${user.medcert} \n\n\nBest regards,\nIsKalusugan`,
      });
  
      if (emailResponse.status === 200) {
        toast.success('User updated and email sent successfully!');
      } else {
        toast.error('Failed to send email.');
      }

      setUpdateSuccess(true);
      setScrollTop(true); // Trigger scroll to top
      setTimeout(() => {
        setUpdateSuccess(false); // Hide alert after 3 seconds
        navigate(-1);
      }, 3000); // Alert duration
  
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }


  const getStatusBadge = (status) => {
    const statusColors = {
      'NO ACTION': 'warning',
      'denied': 'failure',
      'approved': 'success'
    };
    return <Badge color={statusColors[status] || 'warning'} size="lg">{status}</Badge>;
  };


  return (
    <div className="dashboard my-flex">
      
      <div className="dashboardContainer my-flex">
         <ToastContainer className="z-50" />
        <Sidebar />
        <div className="mainContent">
        <div className="bg-white rounded-lg border border-gray-200 p-10 w-full" style={{ position: 'relative' }}>
          {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}

            {user ? (
              <div>
                <div className="rounded-lg border border-gray-200 p-10 w-full gap-3">
                  <h1 className="text-2xl font-light mb-4">Student Information</h1>
                  <div className="flex items-center gap-6 p-4 bg-white rounded-lg">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {`${user.firstName} ${user.middleName || ""} ${user.lastName}`}
                      </h2>
                      <p className="text-gray-600">Student Number: {user.username}</p>
                      {getStatusBadge(formData.status || "NO ACTION")}
                    </div>
                  </div>
                </div>
                <div className="px-2 py-10">
                <div className="mb-4 b">
                      <p className="text-lg text-teal-500">Annual Physical Examination Form</p>
                      <div className="flex items-center py-2">
                          {user.peForm ? (
                              <>
                                  <p className="w-1/2 text-sm mb-1 border border-green-500 px-2 py-2 inline-block">{user.lastName}_PE.pdf</p>
                                  <Link className="ml-2 px-3 py-1 bg-green-500 text-white" to={user.peForm} target="_blank" rel="noopener noreferrer">
                                      View
                                  </Link>
                              </>
                          ) : (
                            <div className="w-3/4 ">
                            <p className="w-1/2 text-sm mb-1 border border-red-500 px-2 py-2 inline-block text-red-500">Empty</p>
                            <Link className="ml-2 px-3 py-2 bg-green-500 text-white" to={''} target="_blank" rel="noopener noreferrer">
                                Add
                            </Link>
                        </div>
                          )}
                      </div>
                  </div>
                  
                  <div className="mb-4 b">
                      <p className="text-lg text-teal-500">Annual Physical Examination Form</p>
                      <div className="flex items-center py-2">
                          {user.labResults ? (
                              <>
                                  <p className="w-1/2 text-sm mb-1 border border-green-500 px-2 py-2 inline-block">{user.lastName}_labResults.pdf</p>
                                  <Link className="ml-2 px-3 py-1 bg-green-500 text-white" to={user.labResults} target="_blank" rel="noopener noreferrer">
                                      View
                                  </Link>
                              </>
                          ) : (
                            <div className="w-3/4 ">
                            <p className="w-1/2 text-sm mb-1 border border-red-500 px-2 py-2 inline-block text-red-500">Empty</p>
                            <Link className="ml-2 px-3 py-2 bg-green-500 text-white" to={''} target="_blank" rel="noopener noreferrer">
                                Add
                            </Link>
                        </div>
                          )}
                      </div>
                  </div>

                  <div className="mb-4 b">
                      <p className="text-lg text-teal-500">Annual Physical Examination Form</p>
                      <div className="flex items-center py-2">
                          {user.requestPE ? (
                              <>
                                  <p className="w-1/2 text-sm mb-1 border border-green-500 px-2 py-2 inline-block">{user.lastName}_requestPE.pdf</p>
                                  <Link className="ml-2 px-3 py-1 bg-green-500 text-white" to={user.requestPE} target="_blank" rel="noopener noreferrer">
                                      View
                                  </Link>
                              </>
                          ) : (
                              <div className="w-3/4 ">
                                  <p className="w-1/2 text-sm mb-1 border border-red-500 px-2 py-2 inline-block text-red-500">Empty</p>
                                  <Link className="ml-2 px-3 py-2 bg-green-500 text-white" to={''} target="_blank" rel="noopener noreferrer">
                                      Add
                                  </Link>
                              </div>
                          )}
                      </div>
                  </div>

                </div>

                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                  <p className="font-semibold text-lg text-teal-500">Approve or Deny the request</p>
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="flex flex-row gap-2">
                      <p className="text-center py-3">Select Status:</p>
                      <Select
                        id="status"
                        value={formData.status || "NO ACTION"}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="py-2 px-4 focus:outline-none focus:border-blue-500"
                      >
                        <option value="NO ACTION">NO ACTION</option>
                        <option value="denied">DENIED</option>
                        <option value="approved">APPROVED</option>
                      </Select>
                    </div>
                  </div>
                  <div className="mb-4 rounded-lg bg-green-500 border border-gray-200 p-4 w-1/3 hover:bg-green-600 text-white">
                    <Link
                      className="ml-2 px-3 py-1 text-black hover:underline text-white"
                      to={`/certificate/${user._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Generate Medical Certificate
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-start py-3">Attach Generated Medcert:</p>
                    <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 w-3/4">
                      <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                      <Button
                          color="gray"
                          onClick={handleUploadImage}
                          disabled={imageUploadProgress}
                        >
                          {imageUploadProgress ? (
                            <div className="w-6 h-6">
                              <CircularProgressbar
                                value={imageUploadProgress}
                                text={`${imageUploadProgress}%`}
                              />
                            </div>
                          ) : (
                            <HiOutlineUpload className="mr-2 h-5 w-5" />
                          )}
                          Upload
                        </Button>
                    </div>

                    {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
                    {formData.medcert && (
                      <img src={formData.medcert} alt="upload" className="w-full h-full object-fit" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-start py-3">Add Remarks:</p>
                    <ReactQuill
                      theme="snow"
                      id="comment"
                      value={formData.comment || ""}
                      placeholder="Write something..."
                      className="h-72 mb-12"
                      onChange={(value) => setFormData({ ...formData, comment: value })}
                    />
                  </div>

                  <Button type="submit" className="text-3xl bg-green-500 text-white hover:bg-green-600 py-2 rounded-md">
                    Update Status
                  </Button>
                  
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