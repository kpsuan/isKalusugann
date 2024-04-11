import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useSelector } from 'react-redux';
import { Select, Alert, Button, Modal, ModalBody, TextInput, FileInput } from 'flowbite-react';
import { Link } from 'react-router-dom';


const CreatePost = () => {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
            <Top />
            <div className="p-3 max-w-3xl mx-auto min-h-screen"> 
                <h1 className="text-center text-3xl my-7 font-semibold">Create Announcement</h1>
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row justify-between">
                        <TextInput type='text' placeholder='Title' required id ='title' 
                        className = 'flex-1' />

                        <Select> 
                            <option value="uncategorized">Select a category</option>
                            <option value="general">General</option>
                            <option value="general">Scheduling</option>
                            <option value="general">Emergency</option>
                        </Select>
                    </div>
                    <div className="flex gap-4 items-center justify-between border-4
                        border-teal-500 border-dotted p-3">
                            <FileInput type='file' accept='image/*'/>
                            <Button type ='button' size='sm' className="text-lg  bg-gradient-to-r from-green-500 to-blue-400 text-white px-14 py-4 rounded-md">
                                Upload file </Button>

                    </div>
                    <ReactQuill 
                        theme="snow"  
                        placeholder="Write something..." 
                        className="h-72 mb-12"
                        required/> 
                    
                    <Button type="submit" className="text-3xl bg-green-500 text-white hover:bg-green-600 py-2 rounded-md">
                    Submit </Button>
                </form>
                

            </div>
          </div>
        </div>
    </div>
    );
}

export default CreatePost