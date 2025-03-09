import React, { useState, useEffect } from "react";
import Sidebar from "../../SideBar Section/Sidebar";
import { useSelector } from 'react-redux';
import { Select, Button, Badge, Modal, ModalBody, TextInput, FileInput, Card } from 'flowbite-react';
import Alert from '@mui/material/Alert';

import {
	APPROVED_EMAIL_TEMPLATE,
  DENIED_EMAIL_TEMPLATE,
  MISSING_DOCUMENT_TEMPLATE
} from "../../../../../../api/utils/emailTemplate";


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
import { motion, AnimatePresence } from "framer-motion";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import axios from 'axios';

import {HiOutlineUpload} from 'react-icons/hi';
import ApprovalWarning from "./ApprovalWarning";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [approverDetails, setApproverDetails] = useState({
    dentistName: '',
    dentistLicense: '',
    doctorName: '',
    doctorLicense: ''
  });


  const [scrollTop, setScrollTop] = useState(false);

  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector((state) => state.user);
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const userData = await res.json();
        if (res.ok) {
          setUser(userData);
          setFormData({ 
            doctorStatus:userData.doctorStatus, 
            dentistStatus: userData.dentistStatus, 
            status: userData.status, 
            medcert: userData.medcert, 
            comment: userData.comment,
            approvedByDentist: userData.approvedByDentist || '',
            approvedByDentistLicense: userData.approvedByDentistLicense || '',
            approvedByDoctor: userData.approvedByDoctor || '',
            approvedByDoctorLicense: userData.approvedByDoctorLicense || ''
          });
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
  if (formData.dentistStatus === "approved" && formData.doctorStatus === "approved") {
    setFormData((prev) => ({ ...prev, status: "approved" }));
  }
  if (formData.dentistStatus === "approved" || formData.doctorStatus === "approved") {
    setFormData((prev) => ({ ...prev, status: "NO ACTION" }));
  }
  if (formData.dentistStatus === "NO ACTION" || formData.doctorStatus === "NO ACTION") {
    setFormData((prev) => ({ ...prev, status: "NO ACTION" }));
  }
  if (formData.dentistStatus === "denied" || formData.doctorStatus === "denied") {
    setFormData((prev) => ({ ...prev, status: "denied" }));
  }
}, [formData.dentistStatus, formData.doctorStatus]);


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

  const handleGenerateCertificate = (e) => {
    if (!(formData.doctorStatus === "approved" && formData.dentistStatus === "approved")) {
      e.preventDefault();
      toast.warning('Cannot generate certificate until both doctor and dentist approve');
      return;
    }
    
    
    // Get the most up-to-date approver information
    const currentApprovers = {
      dentist: {
        name: formData.approvedByDentist || (currentUser.role === 'Dentist' ? `${currentUser.firstName} ${currentUser.lastName}` : ''),
        license: formData.approvedByDentistLicense || (currentUser.role === 'Dentist' ? currentUser.licenseNumber : ''),
      },
      doctor: {
        name: formData.approvedByDoctor || (currentUser.role === 'Doctor' ? `${currentUser.firstName} ${currentUser.lastName}` : ''),
        license: formData.approvedByDoctorLicense || (currentUser.role === 'Doctor' ? currentUser.licenseNumber : ''),
      },
      studentDetails: {
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        username: user.username
      }
    };
    
    const stateData = {
      medicalRemark: formData.comment || '',
      approvers: currentApprovers,
      status: formData.status === 'approved' ? 'Approved' : (formData.status === 'denied' ? 'Denied' : formData.status)
    };
    
    const stateKey = `certificate_state_${user._id}_${Date.now()}`;
    sessionStorage.setItem(stateKey, JSON.stringify(stateData));
    
    const certificateUrl = `/certificate/${user._id}?stateKey=${stateKey}`;
    window.open(certificateUrl, '_blank');

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedFormData = {
      ...formData,
      approvedByDentist: currentUser.role === 'Dentist' ? `${currentUser.firstName} ${currentUser.lastName}` : formData.approvedByDentist,
      approvedByDentistLicense: currentUser.role === 'Dentist' ? currentUser.licenseNumber : formData.approvedByDentistLicense,
      approvedByDoctor: currentUser.role === 'Doctor' ? `${currentUser.firstName} ${currentUser.lastName}` : formData.approvedByDoctor,
      approvedByDoctorLicense: currentUser.role === 'Doctor' ? currentUser.licenseNumber : formData.approvedByDoctorLicense
    };
  
    try {
      const res = await fetch(`/api/user/update/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error('Failed to update user:', data.error);
        toast.error("Failed to update status of user.");
        return;
      }
  
      // Send email notification if the status is approved
      if (updatedFormData.status === 'approved') {
        const emailTemplate = APPROVED_EMAIL_TEMPLATE
          .replace('{firstName}', user.firstName)
          .replace('{medcert}', updatedFormData.medcert);
  
        try {
          const emailResponse = await axios.post('/api/email/emailUser', {
            email: user.email,
            subject: `Annual PE Status: APPROVED`,
            html: emailTemplate
          });
  
          if (emailResponse.status === 200) {
            toast.success('User updated and  email sent successfully!');
          } else {
            toast.error('User updated but failed to send approval email.');
          }
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          toast.error('User updated but failed to send approval email.');
        }
      }
      else if (updatedFormData.status === 'denied') {
        const emailTemplate = DENIED_EMAIL_TEMPLATE
          .replace('{firstName}', user.firstName)
          .replace('{comment}', updatedFormData.comment);
          
  
        try {
          const emailResponse = await axios.post('/api/email/emailUser', {
            email: user.email,
            subject: `Annual PE Status: DENIED`,
            html: emailTemplate
          });
  
          if (emailResponse.status === 200) {
            toast.success('User updated and email sent successfully!');
          } else {
            toast.error('User updated but failed to send approval email.');
          }
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          toast.error('User updated but failed to send approval email.');
        }
      } else {
        toast.success('User status updated successfully!');
      }
  
      setUpdateSuccess(true);
      setScrollTop(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        navigate(-1);
      }, 3000);
  
    } catch (error) {
      console.error('Error updating user:', error.message);
      toast.error('Failed to update user status.');
    }
  };


  const handleNotifyStudent = async (user) => {
    const documentNames = {
      peForm: 'Annual Physical Examination Form',
      labResults: 'Compressed Laboratory Forms',
      requestPE: 'Request for PE',
      medcertUser: 'Medical Certificate from Doctor'
    };
  
    const missingDocs = Object.keys(documentNames).filter(key => !user[key]);
  
    if (missingDocs.length === 0) {
      toast.info(`${user.firstName} has no missing documents.`);
      return;
    }
  
    const missingDocsList = missingDocs.map(doc => `- ${documentNames[doc]}`).join('<br>');
  
    const emailTemplate = MISSING_DOCUMENT_TEMPLATE
      .replace('{firstName}', user.firstName)
      .replace('{docType}', missingDocsList);
  
    try {
      const response = await axios.post('/api/email/emailUser', {
        email: user.email,
        subject: `Missing Documents Notification`,
        html: emailTemplate
      });
  
      if (response.status === 200) {
        toast.success(`Notification email sent to ${user.firstName}!`);
      } else {
        toast.error('Failed to send email notification.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email notification.');
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

  const enrollmentStatuses = [
    'Fit for enrollment no PE restrictions',
    'Fit for enrollment but restricted PE',
    'Fit for enrollment hold chart temporarily',
    'Not fit for enrollment'
  ];

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFormData(prev => ({
      ...prev,
      comment: status
    }));
  };

  const handleClearSelection = () => {
    setSelectedStatus('');
    setFormData(prev => ({
      ...prev,
      comment: ''
    }));
  };

  return (
    <div className="dashboard my-flex">
      
      <div className="dashboardContainer my-flex">
         <ToastContainer className="z-50" />
        <Sidebar />
        <div className="mainContent">
        <ApprovalWarning user={user} />

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
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Status:</span>
                        <Badge
                          color={
                            formData.status === 'approved' ? 'success' :
                            formData.status === 'denied' ? 'failure' :
                            'warning'
                          }
                          size="md"
                          className="font-semibold"
                        >
                          {formData.status || "NO ACTION"}
                        </Badge>
                      </div>
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
                            <button 
                              className="ml-2 px-3 py-2 bg-red-500 text-white" 
                              onClick={() => handleNotifyStudent(user, 'peForm')}
                            >
                              Notify Student
                            </button>

                        </div>
                          )}
                      </div>
                  </div>
                  
                  <div className="mb-4 b">
                      <p className="text-lg text-teal-500">Compressed Laboratory Forms</p>
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
                           <button 
                            className="ml-2 px-3 py-2 bg-red-500 text-white" 
                            onClick={() => handleNotifyStudent(user, 'peForm')}
                          >
                            Notify Student
                          </button>

                        </div>
                          )}
                      </div>
                  </div>

                  <div className="mb-4 b">
                      <p className="text-lg text-teal-500">Request for PE</p>
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
                                  <button 
                                    className="ml-2 px-3 py-2 bg-red-500 text-white" 
                                    onClick={() => handleNotifyStudent(user, 'peForm')}
                                  >
                                    Notify Student
                                  </button>

                              </div>
                          )}
                      </div>
                  </div>

                  <div className="mb-4 b">
                      <p className="text-lg text-teal-500">Medcert from their Doctor</p>
                      <div className="flex items-center py-2">
                          {user.medcertUser ? (
                              <>
                                  <p className="w-1/2 text-sm mb-1 border border-green-500 px-2 py-2 inline-block">{user.lastName}_medcertUser.pdf</p>
                                  <Link className="ml-2 px-3 py-1 bg-green-500 text-white" to={user.medcertUser} target="_blank" rel="noopener noreferrer">
                                      View
                                  </Link>
                              </>
                          ) : (
                            <div className="w-3/4 ">
                            <p className="w-1/2 text-sm mb-1 border border-red-500 px-2 py-2 inline-block text-red-500">Empty</p>
                            <button 
                              className="ml-2 px-3 py-2 bg-red-500 text-white" 
                              onClick={() => handleNotifyStudent(user, 'peForm')}
                            >
                              Notify Student
                            </button>

                        </div>
                          )}
                      </div>
                  </div>

                </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Review & Action</h2>
                  
                  <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  {/* Status Headers */}
                  <div className="grid grid-cols-2 gap-8">
                    {/* University Dentist Section */}
                    <div className="relative">
                      <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                        <span className="text-lg">University Dentist</span>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          formData.dentistStatus === 'approved' ? 'bg-green-100 text-green-700' :
                          formData.dentistStatus === 'denied' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {formData.dentistStatus || "NO ACTION"}
                        </span>
                      </label>
                      {currentUser.role === 'Dentist' ? (
                        <select
                          id="dentistStatus"
                          value={formData.dentistStatus || "NO ACTION"}
                          onChange={(e) => setFormData({ ...formData, dentistStatus: e.target.value })}
                          className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        >
                          <option value="NO ACTION" className="py-2">NO ACTION</option>
                          <option value="denied" className="py-2 text-red-600">DENIED</option>
                          <option value="approved" className="py-2 text-green-600">APPROVED</option>
                        </select>
                      ) : (
                        <div className={`p-3 rounded-lg ${
                          formData.dentistStatus === 'approved' ? 'bg-green-50 text-green-700' :
                          formData.dentistStatus === 'denied' ? 'bg-red-50 text-red-700' :
                          'bg-gray-50 text-gray-700'
                        } font-medium`}>
                          {formData.dentistStatus || "NO ACTION"}
                        </div>
                      )}
                    </div>

                    {/* University Doctor Section */}
                    <div className="relative">
                      <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                        <span className="text-lg">University Doctor</span>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          formData.doctorStatus === 'approved' ? 'bg-green-100 text-green-700' :
                          formData.doctorStatus === 'denied' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {formData.doctorStatus || "NO ACTION"}
                        </span>
                      </label>
                      {currentUser.role === 'Doctor' ? (
                        <select
                          id="doctorStatus"
                          value={formData.doctorStatus || "NO ACTION"}
                          onChange={(e) => setFormData({ ...formData, doctorStatus: e.target.value })}
                          className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        >
                          <option value="NO ACTION" className="py-2">NO ACTION</option>
                          <option value="denied" className="py-2 text-red-600">DENIED</option>
                          <option value="approved" className="py-2 text-green-600">APPROVED</option>
                        </select>
                      ) : (
                        <div className={`p-3 rounded-lg ${
                          formData.doctorStatus === 'approved' ? 'bg-green-50 text-green-700' :
                          formData.doctorStatus === 'denied' ? 'bg-red-50 text-red-700' :
                          'bg-gray-50 text-gray-700'
                        } font-medium`}>
                          {formData.doctorStatus || "NO ACTION"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approval Status Message */}
                  {formData.doctorStatus !== "denied" && formData.dentistStatus !== "denied" && 
                (formData.doctorStatus !== "approved" || formData.dentistStatus !== "approved") && (
                  <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-700 font-medium">
                        {formData.doctorStatus !== "approved" && formData.dentistStatus !== "approved"
                          ? "Final Status cannot be modified. Pending approval from both dentist and doctor."
                          : formData.doctorStatus !== "approved"
                            ? "Final Status cannot be modified. Pending approval from doctor."
                            : "Final Status cannot be modified. Pending approval from dentist."}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 mt-4">
                  {/* Status Update Section */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Final Status
                    </label>
                    <select
                      id="status"
                      value={formData.status || "NO ACTION"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={`w-full p-3 border rounded-lg transition-all duration-200 ${
                        !(formData.doctorStatus === "approved" && formData.dentistStatus === "approved")
                          ? 'bg-gray-100 cursor-not-allowed opacity-60'
                          : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                      disabled={!(formData.doctorStatus === "approved" && formData.dentistStatus === "approved")}
                    >
                      <option value="NO ACTION">NO ACTION</option>
                      <option value="denied">DENIED</option>
                      <option value="approved">APPROVED</option>
                    </select>
                  </div>

                  {/* Generate Certificate Button Section */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Medical Certificate
                    </label>
                    <Button
                      onClick={handleGenerateCertificate}
                      className={`inline-block w-full p-3 rounded-lg text-center transition-all duration-200 ${
                        formData.doctorStatus === "approved" && formData.dentistStatus === "approved"
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Generate Certificate</span>
                      </div>
                    </Button>
                  </div>
                </div>
                </div>

                  {/* Medcert Upload Section */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Generated Medical Certificate
                    </label>
                    <div className="flex gap-4 items-center p-4 border-2 border-dashed border-teal-500 rounded-lg bg-teal-50">
                      <div className="flex-1">
                        <FileInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="w-full"
                        />
                      </div>
                      <Button
                        color="teal"
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                        className="whitespace-nowrap"
                      >
                        {imageUploadProgress ? (
                          <div className="w-6 h-6">
                            <CircularProgressbar
                              value={imageUploadProgress}
                              text={`${imageUploadProgress}%`}
                            />
                          </div>
                        ) : (
                          <>
                            <HiOutlineUpload className="mr-2 h-5 w-5" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                    {imageUploadError && (
                      <Alert color="failure" className="mt-2">{imageUploadError}</Alert>
                    )}
                    {formData.medcert && (
                      <div className="mt-4 p-2 border rounded-lg">
                        <img
                          src={formData.medcert}
                          alt="uploaded certificate"
                          className="max-h-48 object-contain mx-auto"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Status
                    </label>
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                    >
                      Clear Selection
                    </button>
                    <div className="space-y-2">
                      {enrollmentStatuses.map((status) => (
                        <div key={status} className="flex items-center">
                          <input
                            type="radio"
                            id={status}
                            name="medicalStatus"
                            value={status}
                            checked={selectedStatus === status}
                            onChange={() => handleStatusChange(status)}
                            className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                          />
                          <label htmlFor={status} className="ml-2 block text-sm text-gray-700">
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks
                    </label>
                    <div className="border rounded-lg">
                      <ReactQuill
                        theme="snow"
                        value={formData.comment || ""}
                        onChange={(value) => setFormData({ ...formData, comment: value })}
                        className="h-48"
                        placeholder="Add your comments here..."
                      />
                    </div>
                  </div>

                  <Button type="submit" className="text-3xl bg-green-500 text-white hover:bg-green-600 py-2 rounded-md">
                    Update Status
                  </Button>
                </Card>
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