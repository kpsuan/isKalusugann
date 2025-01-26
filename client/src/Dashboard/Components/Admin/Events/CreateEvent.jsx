import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import ReactQuill from 'react-quill';
import { motion } from 'framer-motion';

import 'react-quill/dist/quill.snow.css';

import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';

import { app } from '../../../../firebase';
import { useSelector } from 'react-redux';
import { Select, Alert, Button, Modal, ModalBody, TextInput, FileInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        category: 'uncategorized',
        date: '',
        timeSlot: '',
        description: '',
        image: ''
    });
    const [isDragging, setIsDragging] = useState(false);
    const [publishError, setPublishError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            setFile(droppedFile);
        }
    };

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
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/events/createEvent', {
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

            setPublishError(null);
            navigate(`/events`);
        } catch (error) {
            setPublishError('Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="dashboard my-flex">
            <div className="dashboardContainer my-flex">
                <Sidebar />
                <div className="mainContent m-0 p-0">
                    <div className="flex-1 transition-all duration-500 ease-in-out">
                        {/* Header Section with Gradient */}
                        <div className="bg-gradient-to-r from-red-700 to-rose-600 p-10 animate-gradient-x">
                            <div className="max-w-4xl mx-auto ">
                                <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
                                            Create an Event
                                </h1>
                                <p className="text-white/80 text-lg font-light animate-slide-up mb-8">
                                Share important updates to everyone 
                                </p>
                            </div>
                        </div> 
                        <div className="max-w-4xl mx-auto px-6 -mt-8 bg-white rounded-xl shadow-xl transition-transform duration-300 hover:shadow-2xl">
                        <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                               

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white  p-8"
                                >
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                            <motion.div 
                                                whileFocus={{ scale: 1.02 }}
                                                className="space-y-2"
                                            >
                                                <label className="text-sm font-medium text-gray-700">Event Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter event title"
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </motion.div>

                                            <motion.div 
                                                whileFocus={{ scale: 1.02 }}
                                                className="space-y-2"
                                            >
                                                <label className="text-sm font-medium text-gray-700">Location</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter location"
                                                    required
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                />
                                            </motion.div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Category</label>
                                                <select
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                >
                                                    <option value="uncategorized">Select a category</option>
                                                    <option value="general">General</option>
                                                    <option value="scheduling">Scheduling</option>
                                                    <option value="emergency">Emergency</option>
                                                </select>
                                            </motion.div>

                                            <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    required
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                />
                                            </motion.div>

                                            <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Time</label>
                                                <input
                                                    type="time"
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    required
                                                    value={formData.timeSlot}
                                                    min="09:00"
                                                    max="18:00"
                                                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                                                />
                                            </motion.div>
                                        </div>

                                        <motion.div 
                                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                                                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                            }`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-center">
                                                    {imageUploadProgress ? (
                                                        <div className="w-16 h-16">
                                                            <CircularProgressbar 
                                                                value={imageUploadProgress} 
                                                                text={`${imageUploadProgress}%`}
                                                                styles={{
                                                                    path: { stroke: '#3B82F6' },
                                                                    text: { fill: '#3B82F6' }
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-500">
                                                            <p>Drag and drop your image here or</p>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => setFile(e.target.files[0])}
                                                                className="hidden"
                                                                id="file-upload"
                                                            />
                                                            <label
                                                                htmlFor="file-upload"
                                                                className="mt-2 inline-block px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 transition-colors"
                                                            >
                                                                Browse Files
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                                {file && !imageUploadProgress && (
                                                    <motion.button
                                                        type="button"
                                                        onClick={handleUploadImage}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Upload Image
                                                    </motion.button>
                                                )}
                                            </div>
                                        </motion.div>

                                        {imageUploadError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 bg-red-50 text-red-500 rounded-lg"
                                            >
                                                {imageUploadError}
                                            </motion.div>
                                        )}

                                        {formData.image && (
                                            <motion.img
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                src={formData.image}
                                                alt="uploaded"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                        )}



                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                                                isSubmitting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isSubmitting ? 'Creating Event...' : 'Create Event'}
                                        </motion.button>

                                        {publishError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 bg-red-50 text-red-500 rounded-lg"
                                            >
                                                {publishError}
                                            </motion.div>
                                        )}
                                    </form>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;
