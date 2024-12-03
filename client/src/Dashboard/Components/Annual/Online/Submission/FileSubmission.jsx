import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../../SideBar Section/Sidebar';
import axios from 'axios'; // Make sure to install axios if you haven't already

import { Card, FileInput, Label, Button, Modal } from 'flowbite-react';
import { IoCloudUpload } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { app } from '../../../../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../../../../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { BsFillFileEarmarkArrowDownFill } from "react-icons/bs";

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
        // Only prevent default if an event is passed
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
            dispatch(updateUserSuccess(data));
            navigate('/submissionInfo');
        } catch (error) {
            dispatch(updateUserFailure(error));
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
                <Sidebar />
                <div className="mainContent">
                    <div className="relative flex space-x-1">
                        <Card href="#" className="w-full h-150 p-10 bg-gradient-to-r from-cyan-600 to-blue-400">
                            <h5 className="text-4xl font-light tracking-tight text-white dark:text-white">
                                Submit Medical Documents
                            </h5>
                            <div className="relative flex space-x-2">
                                <p className="my-auto text-lg bg-gradient-to-r from-cyan-500 to-cyan-500 text-white px-3 py-3 rounded-md">
                                    PE Mode: <span className="font-semibold">{userHasChoice} </span>
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Section 1 */}
                    <div className="w-1/2">
                        <h1 className="text-lg mt-2 mb-4 font-medium text-slate-800 flex items-center space-x-2 mt-5">
                            <IoCloudUpload className="text-xl text-cyan-500" />
                            <div className="flex items-center space-x-2">
                                <span>Upload</span>
                                <p className="text-cyan-500 m-0 font-medium">Annual Physical Examination Form</p>
                            </div>
                        </h1>
                        <div className="flex w-full items-center justify-center">
                            <div className="mb-3 w-full">
                                <Label
                                    htmlFor="dropzone-file-1"
                                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                        <svg
                                            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <FileInput
                                        id="dropzone-file-1"
                                        className="hidden"
                                        onChange={(e) => {
                                            const selectedFile = e.target.files[0];
                                            if (selectedFile.size > 10 * 1024 * 1024) { // 10 MB
                                                setUploadError(true);
                                                setFile1(null);
                                                return;
                                            }
                                            setFileName1(selectedFile.name);
                                            setFile1(selectedFile);
                                        }}
                                    />
                                </Label>
                                <div className="flex mt-5">
                                <Card 
                                    href='#' // Security for new tab
                                    className={`flex-1 p-5 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg ${uploadPercent1 === 100 ? 'border-green-500 border-2' : 'border-gray-300 border-2'}`}
                                >
                                    {fileName1 ? (
                                        <div className="flex items-center mt-2">
                                            <BsFillFileEarmarkArrowDownFill className="text-lg text-gray-500" />
                                            <span className="ml-2">{fileName1}</span>
                                            <MdClose
                                                className="ml-2 hover:scale-110 text-2xl cursor-pointer text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents click from also triggering the link
                                                    handleFileRemove('peForm');
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No File Uploaded</p>
                                    )}
                                    {fileName1 && !uploadError && (
                                        <>
                                            <progress value={uploadPercent1} max="100" className="w-full mt-2 h-2 bg-gray-200" />
                                        </>
                                    )}
                                    {uploadError && fileName1 && (
                                        <p className="text-red-500">Error uploading file.</p>
                                    )}
                                </Card>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="w-1/2">
                        <h1 className="text-lg mt-2 mb-4 font-medium text-slate-800 flex items-center space-x-2 mt-5">
                            <IoCloudUpload className="text-xl text-cyan-500" />
                            <div className="flex items-center space-x-2">
                                <span>Upload</span>
                                <p className="text-cyan-500 m-0 font-medium">Compressed Lab Results</p>
                            </div>
                        </h1>
                        <div className="flex w-full items-center justify-center">
                            <div className="mb-3 w-full">
                                <Label
                                    htmlFor="dropzone-file-2"
                                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                        <svg
                                            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <FileInput
                                        id="dropzone-file-2"
                                        className="hidden"
                                        onChange={(e) => {
                                            const selectedFile = e.target.files[0];
                                            if (selectedFile.size > 10 * 1024 * 1024) { // 10 MB
                                                setUploadError(true);
                                                setFile2(null);
                                                return;
                                            }
                                            setFileName2(selectedFile.name);
                                            setFile2(selectedFile);
                                        }}
                                    />
                                </Label>
                                <div className="flex mt-5">
                                    <Card href="#" className={`flex-1 p-5 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg ${uploadPercent2 === 100 ? 'border-green-500 border-2' : 'border-gray-300 border-2'}`}>
                                        {fileName2 ? (
                                            <div className="flex items-center mt-2">
                                                <BsFillFileEarmarkArrowDownFill className="text-lg text-gray-500" />
                                                <span className="ml-2">{fileName2}</span>
                                                <MdClose
                                                    className="ml-2 hover:scale-110 text-2xl cursor-pointer text-red-500"
                                                    onClick={() => handleFileRemove('labResults')}
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No File Uploaded</p>
                                        )}
                                        {fileName2 && !uploadError && (
                                            <>
                                                
                                                <progress value={uploadPercent2} max="100" className="w-full mt-2 h-2 bg-gray-200" />
                                            </>
                                        )}
                                        {uploadError && fileName2 && (
                                            <p className="text-red-500">Error uploading file.</p>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="w-1/2">
                        <h1 className="text-lg mt-2 mb-4 font-medium text-slate-800 flex items-center space-x-2 mt-5">
                            <IoCloudUpload className="text-xl text-cyan-500" />
                            <div className="flex items-center space-x-2">
                                <span>Upload</span>
                                <p className="text-cyan-500 m-0 font-medium">Request for PE</p> <br/>
                                <p className="m-0 font-medium">obtained from COLSEC</p>
                            </div>
                        </h1>
                        <div className="flex w-full items-center justify-center">
                            <div className="mb-3 w-full">
                                <Label
                                    htmlFor="dropzone-file-3"
                                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                        <svg
                                            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <FileInput
                                        id="dropzone-file-3"
                                        className="hidden"
                                        onChange={(e) => {
                                            const selectedFile = e.target.files[0];
                                            if (selectedFile.size > 10 * 1024 * 1024) { // 10 MB
                                                setUploadError(true);
                                                setFile3(null);
                                                return;
                                            }
                                            setFileName3(selectedFile.name);
                                            setFile3(selectedFile);
                                        }}
                                    />
                                </Label>
                                <div className="flex mt-5">
                                    <Card href="#" className={`flex-1 p-5 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg ${uploadPercent3 === 100 ? 'border-green-500 border-2' : 'border-gray-300 border-2'}`}>
                                        {fileName3 ? (
                                            <div className="flex items-center mt-2">
                                                <BsFillFileEarmarkArrowDownFill className="text-lg text-gray-500" />
                                                <span className="ml-2">{fileName3}</span>
                                                <MdClose
                                                    className="ml-2 hover:scale-110 text-2xl cursor-pointer text-red-500"
                                                    onClick={() => handleFileRemove('requestPE')}
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No File Uploaded</p>
                                        )}
                                        {fileName3 && !uploadError && (
                                            <>
                                                
                                                <progress value={uploadPercent3} max="100" className="w-full mt-2 h-2 bg-gray-200" />
                                            </>
                                        )}
                                        {uploadError && fileName3 && (
                                            <p className="text-red-500">Error uploading file.</p>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex mt-3">
                        <button
                            className="w-1/2 p-5 mb-10 bg-cyan-500 text-white  rounded-lg hover:bg-cyan-600 transition duration-300"
                            onClick={() => setShowSubmitModal(true) }
                        >
                            Submit Documents
                        </button>
                    </div>

                    <Modal
                        show={showSubmitModal}
                        size="md"
                        popup
                        onClose={() => setShowSubmitModal(false)}
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Do you want to submit?
                                </h3>
                                <div className="flex justify-center gap-4 m-5 p-1
                                ">
                                    <Button className="bg-green-500 hover:bg-green-600"
                                        color="failure"
                                        onClick={() => handleSubmitModal('YES')}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        color="gray"
                                        onClick={() => handleSubmitModal('NO')}
                                    >
                                        No
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default FileSubmission;
