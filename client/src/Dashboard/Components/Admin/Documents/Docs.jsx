import "../../Annual/annual.css";
import { CloudUpload, CheckCircle } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';
import { Select, Alert, Button, FileInput } from 'flowbite-react';
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from 'react-toastify';
import { light } from "@mui/material/styles/createPalette";


const UploadDocs = () => {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
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
                toast.error("Unable to upload document!")
                return;
            }
      
            if (res.ok) {
                toast.success("Document uploaded successfully!")
                setTimeout(() => {
                    window.location.reload();
                  }, 1000);       
            }
        } catch (error) {
            toast.error("Unable to upload document!")
        }
    };

    return (

        <div className="max-w-2xl  p-6 bg-white shadow-md rounded-lg">
        <ToastContainer className="z-50" />
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <CloudUpload className="text-blue-500" size={32} />
                    Upload Document
                </h2>
                <p className="text-gray-500 mt-2">
                    Select a category and upload your document
                </p>
            </div>
            <h1 className="text-left text-1xl my-7 font-semibold"></h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <Select 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full "> 
                        <option className="text-lg" value="uncategorized">Select a category</option>
                        <option className="text-lg" value="general">General</option>
                        <option className="text-lg" value="medical">Medical</option>
                        <option className="text-lg"value="permits">Permits</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-2
                    border-gray-300 rounded-md border-dotted p-3">
                    <FileInput type='file' accept='/*' onChange={(e) => setFile(e.target.files[0])} className="p-2 flex-grow" />
                    <Button 
                        type='button' 
                        size='sm' 
                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600"
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div>
                        ) : <div className="flex items-center gap-2 p-2">
                                <CloudUpload size={20} />
                                Upload File
                            </div>}
                    </Button>
                </div>

                {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
                {formData.content && (
                    <p className="w-full text-sm mb-1 border border-green-500 px-2 py-2 inline-block">{formData.title}</p>
                )}

                <Button type="submit" className="text-3xl bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-md">
                    Submit
                </Button>
                {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
            </form>
        </div>
    );
};

export default UploadDocs;
