import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../../SideBar Section/Sidebar';
import { Card, FileInput, Label, Button, Modal } from 'flowbite-react';
import { IoCloudUpload, IoDocumentText } from "react-icons/io5";
import { MdClose, MdCheckCircle, MdErrorOutline } from "react-icons/md";
import { app } from '../../../../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../../../../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';


const FileUploadSection = ({ title, fileType, fileName, uploadPercent, handleFileChange, handleFileRemove, uploadError }) => (
  <div className="w-full space-y-4">
    <div className="flex items-center space-x-3">
      <IoCloudUpload className="text-2xl text-cyan-600" />
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <Label
      htmlFor={`dropzone-file-${fileType}`}
      className="group flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-300"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <IoDocumentText className="h-12 w-12 text-gray-400 group-hover:text-cyan-600 transition-colors" />
        <p className="mt-2 text-sm text-gray-600 group-hover:text-cyan-700">
          Drag and drop or <span className="font-semibold text-cyan-600">click to upload</span>
        </p>
        <p className="text-xs text-gray-500">PDF, PNG, JPG (Max 10MB)</p>
      </div>
      <FileInput
        id={`dropzone-file-${fileType}`}
        className="hidden"
        onChange={handleFileChange}
      />
    </Label>

    {fileName && (
      <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg border">
        <div className="flex items-center space-x-3">
          <IoDocumentText className="text-2xl text-cyan-600" />
          <span className="text-gray-700 truncate max-w-[200px]">{fileName}</span>
          {uploadPercent === 100 && <MdCheckCircle className="text-green-500" />}
        </div>
        <div className="flex items-center space-x-2">
          {uploadPercent > 0 && uploadPercent < 100 && (
            <div className="w-24 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-cyan-600 h-2.5 rounded-full" 
                style={{width: `${uploadPercent}%`}}
              ></div>
            </div>
          )}
          <MdClose 
            onClick={handleFileRemove} 
            className="text-red-500 hover:text-red-700 cursor-pointer text-xl" 
          />
        </div>
      </div>
    )}

    {uploadError && (
      <p className="text-red-500 text-sm">Error uploading file. Please try again.</p>
    )}
  </div>
);

const FileSubmission = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [fileName1, setFileName1] = useState("");
  const [fileName2, setFileName2] = useState("");
  const [fileName3, setFileName3] = useState("");
  const [uploadPercent1, setUploadPercent1] = useState(0);
  const [uploadPercent2, setUploadPercent2] = useState(0);
  const [uploadPercent3, setUploadPercent3] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false); // New state for reschedule modal

  const { currentUser } = useSelector((state) => state.user);
  const userHasChoice = currentUser?.annualPE;
  

  useEffect(() => {
      // Helper function to get the clean file name
      const extractFileName = (url) => {
          const decodedUrl = decodeURIComponent(url);
          // Extract the file name and remove numbers
          const fileName = decodedUrl.split('?')[0].split('/').pop();
          return fileName.replace(/\d+/g, ''); // Remove numbers
      };
  
      // Set file names if they exist in the currentUser object
      if (currentUser?.peForm) {
          setFileName1(extractFileName(currentUser.peForm));
          setFormData(prevData => ({ ...prevData, peForm: currentUser.peForm }));
      }
      if (currentUser?.labResults) {
          setFileName2(extractFileName(currentUser.labResults));
          setFormData(prevData => ({ ...prevData, labResults: currentUser.labResults }));
      }
      if (currentUser?.requestPE) {
          setFileName3(extractFileName(currentUser.requestPE));
          setFormData(prevData => ({ ...prevData, requestPE: currentUser.requestPE }));
      }
  }, [currentUser]);
  
  

  useEffect(() => {
      if (file1) handleFileUpload(file1, 'peForm');
  }, [file1]);

  useEffect(() => {
      if (file2) handleFileUpload(file2, 'labResults');
  }, [file2]);

  useEffect(() => {
      if (file3) handleFileUpload(file3, 'requestPE');
  }, [file3]);

  const handleFileUpload = async (file, fileType) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
      'state_changed',
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (fileType === 'peForm') setUploadPercent1(Math.round(progress));
          if (fileType === 'labResults') setUploadPercent2(Math.round(progress));
          if (fileType === 'requestPE') setUploadPercent3(Math.round(progress));
      },
      (error) => {
          setUploadError(true);
      },
      () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFormData(prevFormData => ({
                  ...prevFormData,
                  [fileType]: downloadURL
              }));
              console.log(`File URL: ${downloadURL}`); // Debug the URL here
          });
      }
  );
};

  const handleSubmitModal = async (choice) => {
      setShowSubmitModal(false);
      if (choice === 'YES') {
          await handleSubmit();
          } 
  };

  const handleSubmit = async (e) => {
    if (e) {
        e.preventDefault();
    }

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

        // Add try-catch for admin notification
        try {
            const adminNotifResponse = await axios.put('/api/user/sendAdminNotification', {
                userId: currentUser._id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
            });

            if (adminNotifResponse.status === 200) {
                console.log('Admin notification sent successfully.');
            } else {
                console.error('Failed to send admin notification.');
            }
        } catch (notifError) {
            console.error('Error sending admin notification:', notifError.message);
        }

        dispatch(updateUserSuccess(data));
        toast.success('File submitted successfully!');
        navigate('/submissionInfo');
    } catch (error) {
        dispatch(updateUserFailure(error));
        toast.error('Unable to submit file');
    }
};

  



const handleFileRemove = async (fileType) => {
      const storage = getStorage(app);
      let fileRef;
  
      if (fileType === 'peForm' && formData.peForm) {
          fileRef = ref(storage, formData.peForm);
      } else if (fileType === 'labResults' && formData.labResults) {
          fileRef = ref(storage, formData.labResults);
      } else if (fileType === 'requestPE' && formData.requestPE) {
          fileRef = ref(storage, formData.requestPE);
      }
  
      if (fileRef) {
          try {
              await deleteObject(fileRef);
              console.log('File deleted successfully');
              // Remove the file reference from your form data
              setFormData((prevData) => ({
                  ...prevData,
                  [fileType]: null,
              }));
          } catch (error) {
              console.error('Error deleting file:', error);
          }
      }
  
      // Reset the corresponding file state and upload progress
      if (fileType === 'peForm') {
          setFile1(null);
          setFileName1('');
          setUploadPercent1(0);
      }
      if (fileType === 'labResults') {
          setFile2(null);
          setFileName2('');
          setUploadPercent2(0);
      }
      if (fileType === 'requestPE') {
          setFile3(null);
          setFileName3('');
          setUploadPercent3(0);
      }
  };

  return (
    <div className="dashboard my-flex">
        <div className="dashboardContainer my-flex">
        <ToastContainer className="z-50" />
          
         <Sidebar />
         <div className="mainContent m-0 p-0">
          <div className="space-y-6 ">
            <Card className="bg-gradient-to-r p-10 from-cyan-600 to-blue-500 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Submit Medical Forms</h1>
                  <p className="text-cyan-100">Upload your medical documents for review</p>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-md">
                  PE Mode: <span className="font-bold">{currentUser?.annualPE}</span>
                </div>
              </div>
            </Card>

            {/* Two-column layout */}
            <div className="grid grid-cols-2 gap-6 m-4 items-start mb-5">
              {/* Form Submission Column */}
              <div className="space-y-6 mb-10 ml-4">
                <FileUploadSection 
                  title="Annual PE Form"
                  fileType="peForm"
                  fileName={fileName1}
                  uploadPercent={uploadPercent1}
                  handleFileChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile.size > 10 * 1024 * 1024) {
                      setUploadError(true);
                      setFile1(null);
                      return;
                    }
                    setFileName1(selectedFile.name);
                    setFile1(selectedFile);
                  }}
                  handleFileRemove={() => handleFileRemove('peForm')}
                  uploadError={uploadError}
                />
                <FileUploadSection 
                  title="Lab Results"
                  fileType="labResults"
                  fileName={fileName2}
                  uploadPercent={uploadPercent2}
                  handleFileChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile.size > 10 * 1024 * 1024) {
                      setUploadError(true);
                      setFile2(null);
                      return;
                    }
                    setFileName2(selectedFile.name);
                    setFile2(selectedFile);
                  }}
                  handleFileRemove={() => handleFileRemove('labResults')}
                  uploadError={uploadError}
                />
                <FileUploadSection 
                  title="Request for PE from COLSEC"
                  fileType="requestPE"
                  fileName={fileName3}
                  uploadPercent={uploadPercent3}
                  handleFileChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile.size > 10 * 1024 * 1024) {
                      setUploadError(true);
                      setFile3(null);
                      return;
                    }
                    setFileName3(selectedFile.name);
                    setFile3(selectedFile);
                  }}
                  handleFileRemove={() => handleFileRemove('requestPE')}
                  uploadError={uploadError}
                />
                <Button 
                  className="w-full text-lg p-4 bg-cyan-500 hover:bg-cyan-600 transition-colors"
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Documents
                </Button>
              </div>

              {/* Reminders Column */}
              <div className="ml-10 mt-4 bg-gray-50 p-10 rounded-lg border border-gray-200">
                
                <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                 Powered by: IsKalusugan
                </h3>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <MdErrorOutline className="mr-2 text-orange-500" /> Important Reminders
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    Maximum file size is 10MB per document
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    Accepted file types: PDF, PNG, JPG
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    Ensure all documents are clear and readable
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    Verify document authenticity before uploading
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    All three documents are required for submission
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Modal code remains the same */}
        <Modal
          show={showSubmitModal}
          size="md"
          popup
          className="fixed inset-0 bg-black p-20 bg-opacity-50 flex items-center justify-center z-50"
          onClose={() => setShowSubmitModal(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Are you sure you want to submit these documents?
              </h3>
              <div className="flex justify-center gap-4">
                <Button 
                  color="info" 
                  onClick={() => handleSubmitModal('YES')}
                >
                  Yes, I'm sure
                </Button>
                <Button 
                  color="gray" 
                  onClick={() => handleSubmitModal('NO')}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};
export default FileSubmission;