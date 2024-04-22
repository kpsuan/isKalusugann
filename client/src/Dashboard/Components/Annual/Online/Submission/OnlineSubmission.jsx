import React from "react";
import Sidebar from '../../../SideBar Section/Sidebar'
import Top from '../../../Profile/Components/Header'
import img from '../../../../../assets/img.jpg'
import '../../../../../App.css'
import './uploader.css'
import '../Submission/DocumentUploader/FileUpload.css'
import { MdOutlineUploadFile, MdClose } from "react-icons/md";
import {toast } from 'react-hot-toast';

import { useSelector } from 'react-redux';
import { useRef, useState, useEffect,  } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../../../../../redux/user/userSlice';

import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosLink } from "react-icons/io";

//import '../../onlinePE.scss'

const OnlineSubmission = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileRef1 = useRef(null);
    const fileRef2 = useRef(null);
    const fileRef3 = useRef(null);
    const [file, setFile] = useState(undefined);
    const [file2, setFile2] = useState(undefined);
    const [file3, setFile3] = useState(undefined);
    const [imagePercent1, setImagePercent1] = useState(0);
    const [imageError1, setImageError1] = useState(false);
    const [fileName1, setFileName1] = useState("");

    const [imagePercent2, setImagePercent2] = useState(0);
    const [imageError2, setImageError2] = useState(false);
    const [fileName2, setFileName2] = useState("");

    const [imagePercent3, setImagePercent3] = useState(0);
    const [imageError3, setImageError3] = useState(false);
    const [fileName3, setFileName3] = useState("");

    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    
    const { currentUser, loading, error } = useSelector((state) => state.user);
    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);
    
    useEffect(() => {
        if (file2) {
            labUpload(file2);
        }
    }, [file2]);
    
    useEffect(() => {
        if (file3) {
            requestPEUpload(file3);
        }
    }, [file3]);
    

    const handleFileUpload = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImagePercent1(Math.round(progress));
          },
          (error) => {
            setImageError1(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
              setFormData({ ...formData, peForm: downloadURL })
            );
          }
        );
      };
    
    const labUpload = async (file2) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file2.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file2);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImagePercent2(Math.round(progress));
          },
          (error) => {
            setImageError2(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
              setFormData({ ...formData, labResults: downloadURL })
            );
          }
        );
      };
    const requestPEUpload = async (file3) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file3.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file3);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImagePercent3(Math.round(progress));
          },
          (error) => {
            setImageError3(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
              setFormData({ ...formData, requestPE: downloadURL })
            );
          }
        );
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
          console.log("Submitting files..."); // Log before the navigate function call
          navigate('/submissionInfo');
          console.log("Navigation to submissionInfo triggered.");
        } catch (error) {
          dispatch(updateUserFailure(error));
        }
      };
 
    const headerTitle = "Annual Physical Examination";

    return (
        <div className="dashboard my-flex">
           <div className="dashboardContainer my-flex">
            <Sidebar/>
                <div className='mainContent'>
                    <Top title={headerTitle}/> 
                        <div className="titleUpload my-flex">
                            <h4><b>Preenlistment Period </b> <span class="lighter-font">(January 12-20, 2024)</span></h4>
                                <h2> <span class="text2">Submit Medical Documents</span></h2>
                        </div>
                        <div className="cardSection-online my-flex">
                            <div className="rightCard-online flex">
                                <div className="uploadDocs flex">
                                    <div className="text-area">
                                    <h4 className="flex items-center">
                                    <FaCloudUploadAlt className="mr-2" /> {/* Adjust margin as needed */}
                                    Upload  <span className="lightertext">  Annual Physical Examination Form*</span>
                                    </h4>
                                        
                                        <div className="file-card">
                                            <div className="file-info">
                                                <div style={{ flex: 1 }}></div>

                                                    <input
                                                        type='file'
                                                        ref={fileRef1}
                                                        hidden
                                                        accept='application/pdf'
                                                        
                                                        onChange={(e) => {
                                                            const selectedFile = e.target.files[0];
                                                            setFileName1(selectedFile.name);
                                                            setFile(selectedFile);
                                                        }}
                                                        />

                                                        <div className="flex flex-col items-center">
                                                            <img
                                                                //src={formData.peForm}
                                                                src = {img}
                                                                alt='profile'
                                                                className='h-11 w-full self-center cursor-pointer object-cover mt-2'
                                                                onClick={() => fileRef1.current.click()}
                                                            />
                                                        
                                                        </div>
                                                       
                                                    </div>
                                                    
                                                </div>
                                                <div className="flex flex-col items-center">
                                                  
                                                        <p>{fileName1 && `${fileName1} -`} </p>
                                                        
                                                        <p className='text-sm self-center'>
                                                        {imageError1 ? (
                                                            <span className='text-red-700'>
                                                            Error uploading file (file size must be less than 10 MB)
                                                            </span>
                                                        ) : imagePercent1 > 0 && imagePercent1 < 100 ? (
                                                            <span className='text-slate-700'>{` Uploading: ${imagePercent1} %`}</span>
                                                        ) : imagePercent1 === 100 ? (
                                                            <span className='text-green-700'><b>File uploaded successfully</b></span>
                                                        ) : (
                                                            ''
                                                        )}
                                                        </p>
                                                        </div>
                                            </div>                                    
                                    <div className="line-separator"></div>
                                </div>
                                <div className="uploadDocs flex">
                                    <div className="text-area">
                                    <h4 className="flex items-center">
                                    <FaCloudUploadAlt className="mr-2" /> {/* Adjust margin as needed */}
                                    Upload  <span className="lightertext">  Compressed Lab Results*</span>
                                    </h4>
                                        
                                        <div className="file-card">
                                            <div className="file-info">
                                                <div style={{ flex: 1 }}></div>

                                                    <input
                                                        type='file'
                                                        ref={fileRef2}
                                                        hidden
                                                        accept='application/pdf'
                                                        onChange={(e) => {
                                                            const selectedFile = e.target.files[0];
                                                            setFileName2(selectedFile.name);
                                                            setFile2(selectedFile);
                                                        }}
                                                        />

                                                        <div className="flex flex-col items-center">
                                                            <img
                                                                //src={formData.peForm}
                                                                src = {img}
                                                                alt='profile'
                                                                className='h-11 w-full self-center cursor-pointer object-cover mt-2'
                                                                onClick={() => fileRef2.current.click()}
                                                            />
                                                            
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                <div className="flex flex-col items-center">
                                                        <p> {fileName2 && `${fileName2} -`} </p>

                                                        <p className='text-sm self-center'>
                                                        {imageError2 ? (
                                                            <span className='text-red-700'>
                                                            Error uploading file (file size must be less than 10 MB)
                                                            </span>
                                                        ) : imagePercent2 > 0 && imagePercent2 < 100 ? (
                                                            <span className='text-slate-700'>{` Uploading: ${imagePercent2} %`}</span>
                                                        ) : imagePercent2 === 100 ? (
                                                            <span className='text-green-700'><b>File uploaded successfully</b></span>
                                                        ) : (
                                                            ''
                                                        )}
                                                        </p>
                                                        </div>
                                            </div>                                    
                                    <div className="line-separator"></div>
                                </div>
                                
                                <div className="uploadDocs flex">
                                    <div className="text-area">
                                    <h4 className="flex items-center">
                                    <FaCloudUploadAlt className="mr-2" /> {/* Adjust margin as needed */}
                                    Upload  <span className="lightertext">  Request for PE*</span>
                                    </h4>
                                        
                                        <div className="file-card">
                                            <div className="file-info">
                                                <div style={{ flex: 1 }}></div>

                                                    <input
                                                        type='file'
                                                        ref={fileRef3}
                                                        hidden
                                                        accept='application/pdf'
                                                        
                                                        onChange={(e) => {
                                                            const selectedFile = e.target.files[0];
                                                            setFileName3(selectedFile.name);
                                                            setFile3(selectedFile);
                                                        }}
                                                        />

                                                        <div className="flex flex-col items-center">
                                                            <img
                                                                //src={formData.peForm}
                                                                src = {img}
                                                                alt='profile'
                                                                className='h-11 w-full self-center cursor-pointer object-cover mt-2'
                                                                onClick={() => fileRef3.current.click()}
                                                            />
                                                            
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                <div className="flex flex-col items-center">
                                                        <p> {fileName3 && `${fileName3} -`} </p>

                                                        <p className='text-sm self-center'>
                                                        {imageError3 ? (
                                                            <span className='text-red-700'>
                                                            Error uploading file (file size must be less than 10 MB)
                                                            </span>
                                                        ) : imagePercent3 > 0 && imagePercent3 < 100 ? (
                                                            <span className='text-slate-700'>{` Uploading: ${imagePercent3} %`}</span>
                                                        ) : imagePercent3 === 100 ? (
                                                            <span className='text-green-700'><b>File uploaded successfully</b></span>
                                                        ) : (
                                                            ''
                                                        )}
                                                        </p>
                                                        </div>
                                            </div>                                    
                                    <div className="line-separator"></div>
                                </div>



                                <div className="button-ol flex">
                                    <button className='btn-ol'  onClick={handleSubmit}>  Submit  </button>
                                </div>
                                
                            </div>
                        
                        <div className="leftCard-online ">
                            <div className="main-online flex">
                                <div className="textDiv">
                                    <h1><IoIosStarOutline /> General FAQs</h1>

                                    <div className="link-flex">
                                        <ul>
                                            <li><span className="flex link">List of Requirements for Online PE </span></li>
                                            <li><span className="flex link">Online Physical Examination Guide </span></li>
                                        </ul>
                                    </div>
                                    
                                    <div className="line-separator"></div>

                                    <h1><IoIosLink /> Featured Links</h1>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnlineSubmission
