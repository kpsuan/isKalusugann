import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, FileInput, Label, Button, Modal } from 'flowbite-react';
import { IoCloudUpload } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { app } from '../../../../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../../../../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { BsFillFileEarmarkArrowDownFill } from "react-icons/bs";

const FileUpload = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [uploadPercent, setUploadPercent] = useState(0);
    const [uploadError, setUploadError] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fileRef = useRef(null);

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadPercent(Math.round(progress));
            },
            (error) => {
                setUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // Here you might want to update the state or perform some action with the downloadURL
                    console.log('File available at', downloadURL);
                    dispatch(updateUserStart());
                    fetch(`/api/user/update/${currentUser._id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ fileURL: downloadURL }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                dispatch(updateUserSuccess(data));
                                navigate('/submissionInfo');
                            } else {
                                dispatch(updateUserFailure(data));
                            }
                        })
                        .catch(error => {
                            dispatch(updateUserFailure(error));
                        });
                });
            }
        );
    };

    return (
        <div className="dashboard my-flex">
            <div className="dashboardContainer my-flex">
                <Sidebar />
                <div className="mainContent">
                <Banner >
            <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="mx-auto flex items-center">
                    <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                        <MdAnnouncement className="mr-4 h-4 w-4" />
                        <span className="[&_p]:inline">
                            {bannerText()}
                        </span>
                    </p>
                </div>
                <Banner.CollapseButton color="gray" className="border-0 bg-transparent text-gray-500 dark:text-gray-400">
                    <HiX className="h-4 w-4" />
                </Banner.CollapseButton>
            </div>
            </Banner>
            <div className="relative flex space-x-1">
                <Card href="#" className="w-full h-150 p-10 bg-gradient-to-r from-cyan-600 to-blue-400">
                    <h5 className="text-4xl font-light tracking-tight text-white dark:text-white">
                        Submit Medical Documents
                    </h5>
                    
                    {isPreEnlistEnabled && (
                        <div className="flex space-x-2">
                            <p className="font-normal text-white dark:text-gray-400">
                                You are <span className="font-semibold">{userHasChoice ? 'pre-enlisted' : 'not pre-enlisted'}</span>
                            </p>
                        </div>
                    )}
                    <div className="relative flex space-x-2">
                        <p className="my-auto text-lg bg-gradient-to-r from-cyan-500 to-cyan-500 text-white px-3 py-3 rounded-md">
                            PE Mode: <span className="font-semibold">{userHasChoice} </span>
                        </p>
                        
                    </div>
                </Card>
            </div>
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
                                htmlFor="dropzone-file"
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
                                    id="dropzone-file"
                                    className="hidden"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files[0];
                                        setFileName(selectedFile.name);
                                        setFile(selectedFile);
                                    }}
                                />
                            </Label>
                            <div className="flex">
                                <div className="flex flex-col w-full mt-5">
                                    <Card href="#" className="flex-1 p-5 bg-gray-50 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg" horizontal>
                                        <div className="flex">
                                            <div className="flex items-center w-full">
                                                <h5 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                                                    <BsFillFileEarmarkArrowDownFill className="text-cyan-500" />
                                                </h5>
                                                <div className="flex flex-col">
                                                    <p className="font-semibold pl-10 text-gray-500 dark:text-gray-400">
                                                        {fileName}
                                                    </p>
                                                    <p className="font-normal text-sm pl-10 text-gray-400 dark:text-gray-400">
                                                        {uploadError ? (
                                                            <span className='text-red-700'>
                                                                Error uploading file (file size must be less than 10 MB)
                                                            </span>
                                                        ) : uploadPercent > 0 && uploadPercent < 100 ? (
                                                            <span className='text-slate-700'>{` Uploading: ${uploadPercent} %`}</span>
                                                        ) : uploadPercent === 100 ? (
                                                            <span className='text-green-700'><b>File uploaded successfully</b></span>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button className='text-gray-400 hover:text-gray-500'>
                                                <MdClose className='text-2xl mt-2' />
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for error */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Pre-enlistment Error</Modal.Header>
                <Modal.Body>
                    <p className="text-gray-700">
                        Cannot pre-enlist, pre-enlistment period has elapsed.
                    </p>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FileUpload;
