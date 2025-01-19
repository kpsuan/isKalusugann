import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';
import { useSelector } from 'react-redux';
import { Select, Alert, Button, Modal, ModalBody, TextInput, FileInput, Toast } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi";
import { useDocument } from './DocumentContext'; // Import useDocument from DocumentContext

const UploadDocs = () => {
    const { refreshDocs } = useDocument(); // Use the refreshDocs function from the context
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [showToast, setShowToast] = useState(false); // State to control the toast visibility
    const navigate = useNavigate();

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select a file to upload');
                return;
            }
            const storage = getStorage(app);
            const fileName = file.name;
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
                    setImageUploadError('File upload failed');
                    setImageUploadProgress(null);
                },

                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadError(null);
                        setImageUploadProgress(null);
                        setFormData({ ...formData, title: fileName, content: downloadURL });
                    });
                }
            );

        } catch (error) {
            setImageUploadError('File upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/docs/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
      
            if (res.ok) {
                setPublishError(null);
                setShowToast(true); // Show the toast on successful form submission
                refreshDocs(); // Refresh the document list after successful upload
            }
        } catch (error) {
            setPublishError('Something went wrong.');
        }
    };

    return (
        
        <div className="w-3/4 mb-10"> 
            {showToast && (
                <Toast>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">Upload successfully.</div>
                    <Toast.Toggle onClick={() => setShowToast(false)} />
                </Toast>
            )}

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             
              Upload a document
            </h2>

          </div>
          
        </div>
        
            <h1 className="text-left text-1xl my-7 font-semibold"></h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    Select category for this document: 
                    <Select 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}> 
                        <option value="uncategorized">Select a category</option>
                        <option value="general">General</option>
                        <option value="medical">Medical</option>
                        <option value="permits">Permits</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4
                    border-teal-500 border-dotted p-3">
                    <FileInput type='file' accept='/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button 
                        type='button' 
                        size='sm' 
                        className="text-lg bg-slate outline-black text-black px-8 py-2 rounded-md"
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div>
                        ) : <p className="bg-cyan-500 rounded-md text-white p-3">Upload File</p>}
                    </Button>
                </div>

                {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
                {formData.content && (
                    <p className="w-full text-sm mb-1 border border-green-500 px-2 py-2 inline-block">{formData.title}</p>
                )}

                <Button type="submit" className="text-3xl bg-cyan-500 text-white hover:bg-cyan-600 py-2 rounded-md">
                    Submit
                </Button>
                {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
            </form>
        </div>
    );
};

export default UploadDocs;
