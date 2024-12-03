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
import { Select, Alert, Button, Modal, ModalBody, TextInput, FileInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const [file, setFile] = useState([null]);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();

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
                return
            }

            if (res.ok) {
                setPublishError(null);
                navigate(`/events/${data.slug}`);
            }
        }
        catch (error) {
            setPublishError('Something went wrong.');
        }
    };

    const handleDateChange = (e) => {
        setFormData({ ...formData, date: e.target.value });
    };

    const handleTimeChange = (e) => {
        setFormData({ ...formData, timeSlot: e.target.value });
    };

    return (
        <div className="dashboard my-flex">
            <div className="dashboardContainer my-flex">
                <Sidebar />
                <div className="mainContent">
                    <Top />
                    <div className="p-3 max-w-3xl mx-auto min-h-screen">
                        <h1 className="text-center text-3xl my-7 font-semibold">Create an Event</h1>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                                <TextInput
                                    type='text'
                                    placeholder='Title'
                                    required
                                    id='title'
                                    className='flex-1'
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                <TextInput
                                    type='text'
                                    placeholder='Location'
                                    required
                                    id='location'
                                    className='flex-1'
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />

                                <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="uncategorized">Select a category</option>
                                    <option value="general">General</option>
                                    <option value="scheduling">Scheduling</option>
                                    <option value="emergency">Emergency</option>
                                </Select>
                            </div>

                            {/* Date and Time Pickers */}
                            <div className="flex items-center space-x-4">
                                <TextInput
                                    type="date"
                                    id="date"
                                    value={formData.date || ''}
                                    onChange={handleDateChange}
                                    className="rounded-md border-gray-300"
                                    required
                                />
                                <TextInput
                                    type="time"
                                    id="time"
                                    value={formData.timeSlot || ''}
                                    min="09:00"
                                    max="18:00"
                                    onChange={handleTimeChange}
                                    className="rounded-md border-gray-300"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                                <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                                <Button
                                    type='button'
                                    size='sm'
                                    className="text-lg outline-black text-black px-14 py-4 rounded-md"
                                    onClick={handleUploadImage}
                                    disabled={imageUploadProgress}
                                >
                                    {imageUploadProgress ? (
                                        <div className="w-16 h-16">
                                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                                        </div>
                                    ) : ('Upload image')}
                                </Button>
                            </div>

                            {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
                            {formData.image && (
                                <img src={formData.image} alt="upload" className="w-full h-full object-fit" />
                            )}

                            <Button type="submit" className="text-3xl bg-green-500 text-white hover:bg-green-600 py-2 rounded-md">
                                Submit
                            </Button>
                            {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;
