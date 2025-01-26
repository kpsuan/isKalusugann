import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../../../firebase';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Sidebar from '../../SideBar Section/Sidebar';

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
                    setFormData({ ...formData, image: downloadURL });
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
    setIsLoading(true);
    try {
        const res = await fetch('/api/post/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(!res.ok){
            setPublishError(data.message);
            return
        }
  
        if(res.ok){
            setPublishError(null);
            navigate(`/post/${data.slug}`);
        }
    }
    catch (error) {
        setPublishError('Something went wrong.');
    }
};



  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent m-0 p-0">
            <div className="flex-1 transition-all duration-500 ease-in-out">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-blue-700 to-cyan-500 p-10 animate-gradient-x">
                <div className="max-w-4xl mx-auto ">
                <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
                    Create Announcement
                </h1>
                <p className="text-white/80 text-lg font-light animate-slide-up mb-8">
                    Share important updates to everyone 
                </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 -mt-8">
                <div className="bg-white rounded-xl shadow-xl p-8 transition-transform duration-300 hover:shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title and Category Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                        </label>
                        <input
                        type="text"
                        placeholder="Enter title..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                        </label>
                        <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                        <option value="uncategorized">Select category</option>
                        <option value="general">General</option>
                        <option value="scheduling">Scheduling</option>
                        <option value="emergency">Emergency</option>
                        </select>
                    </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 transition-all duration-300 hover:border-blue-400">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300"
                        />
                        </div>
                        
                        <button
                        type="button"
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-300 transform hover:scale-105"
                        >
                        {imageUploadProgress ? (
                            <div className="w-12 h-12 transition-all duration-300">
                            <CircularProgressbar 
                                value={imageUploadProgress} 
                                text={`${imageUploadProgress || 0}%`}
                                styles={{
                                path: { stroke: '#fff' },
                                text: { fill: '#fff', fontSize: '24px' }
                                }}
                            />
                            </div>
                        ) : 'Upload Image'}
                        </button>
                    </div>
                    
                    {imageUploadError && (
                        <p className="mt-2 text-sm text-red-600 animate-fade-in">{imageUploadError}</p>
                    )}
                    
                    {formData.image && (
                        <div className="mt-4 animate-fade-in">
                        <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="max-h-64 rounded-lg mx-auto object-cover transition-transform duration-300 hover:scale-105"
                        />
                        </div>
                    )}
                    </div>

                    {/* Rich Text Editor */}
                    <div className="transition-all duration-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <div className="bg-white border border-gray-300 rounded-lg hover:border-blue-400 transition-all duration-300">
                        <ReactQuill
                        theme="snow"
                        placeholder="Write your announcement..."
                        className="h-72"
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        />
                    </div>
                    </div>

                    {/* Submit Button */}
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:bg-green-400"
                    >
                    {isLoading ? (
                        <span className="flex items-center justify-center  gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                        </span>
                    ) : 'Publish Announcement'}
                    </button>

                    {publishError && (
                    <div className="animate-fade-in">
                        <p className="text-sm text-red-600 text-center">{publishError}</p>
                    </div>
                    )}
                </form>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

// Add these custom animations to your CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes gradient-x {
    0%, 100% {
      background-size: 200% 200%;
      background-position: left center;
    }
    50% {
      background-size: 200% 200%;
      background-position: right center;
    }
  }
  
  .animate-gradient-x {
    animation: gradient-x 15s ease infinite;
  }
  
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  @keyframes slide-up {
    0% {
      transform: translateY(20px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.5s ease-out;
  }
`;
document.head.appendChild(style);