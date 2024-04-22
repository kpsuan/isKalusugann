import React, { useState, useEffect } from "react";
import Sidebar from '../../../SideBar Section/Sidebar'
import Top from '../../../Profile/Components/Header'
import '../../../../../App.css'
import { Link } from 'react-router-dom'; 
import './results.css'
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosLink } from "react-icons/io";
import {Alert, Button, Modal, ModalBody, TextInput, Table, TableCell} from 'flowbite-react'

import { useSelector } from 'react-redux';

import { FaRegFilePdf } from "react-icons/fa";

import { BsFiletypePng } from "react-icons/bs";


//import '../../onlinePE.scss'

const OnlineSubmission = () => {
    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
       

    };
    const headerTitle = "Annual Physical Examination";
   
    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className="dashboard flex">
           <div className="dashboardContainer flex">
            <Sidebar/>
                <div className='mainContent'>
                    <Top title={headerTitle}/> 
                        <div className="titleUpload flex">
                                <h1 className="text-center text-2xl font-semibold text-gray-900">Online Medical Examination System </h1>
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                            <div class="border rounded-lg shadow-md">
                            <div class=" p-4">
                                <p class=" text-2xl text-green-600  ">Status:</p>
                                <p class ='text-gray-700  font-semibold my-1' >{currentUser.status}</p>
                            </div>

                                <div class="p-4">
                                    <p class="text-2xl text-green-600 mb-2">Remarks: </p>
                                    <span>{currentUser.comment.replace(/<p>/g, '').replace(/<\/p>/g, '')|| "No remarks"}</span>
                                </div>
                            </div>
                        </div>

                        
                        <div class="my-4 w-3/4">
                            <p class=" p-5 mx-2 text-2xl text-green-600  ">Attached Medical Certificate:</p>
                                <div class="p-9 rounded-lg shadow-md my-4 w-1/2 text-center">
                                    {currentUser.medcert ? (
                                        <Link target="_blank" rel="noopener noreferrer" className="w-full h-full object-fit mb-2" to={currentUser.medcert}>
                                            <p className="text-3xl flex justify-center items-center">
                                                <BsFiletypePng style={{ fontSize: '10rem' }}/>
                                            </p>
                                        </Link>
                                    ) : (
                                        <p className="text-1xl flex font-light justify-center items-center">
                                            [Nothing to display]
                                        </p>
                                    )}
                                    {currentUser.medcert && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2">{currentUser.lastName}_medcert.png</h3>
                                            <Link target="_blank" rel="noopener noreferrer" to={currentUser.medcert} className="block w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm text-center">
                                                View
                                            </Link>
                                        </div>
                                    )}
                                </div>

                        </div>




                    </div>
                    
                </div>
            </div>
    )
}

export default OnlineSubmission
