import React from "react";
import Sidebar from '../../../SideBar Section/Sidebar'
import Top from '../../../Profile/Components/Header'
import '../../../../../App.css'
import './submissionInfo.css'
import './uploader.css'
import FileUpload from './DocumentUploader/FileUpload'
import { Link } from 'react-router-dom'; 

import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosLink } from "react-icons/io";
import { useNavigate } from 'react-router-dom';



//import '../../onlinePE.scss'

const SubmissionInfo = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        navigate('/result');
    };

    const handleButtonClick2 = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        navigate('/onlineSub');
    };
    const headerTitle = "Annual Physical Examination";

    return (
        <div className="dashboard my-flex">
           <div className="dashboardContainer my-flex">
            <Sidebar/>
                <div className='mainContent'>
                    <Top title={headerTitle}/> 
                        <div className="titleUpload2 my-flex">
                            <h4><b>Preenlistment Period </b> <span class="lighter-font">(January 12-20, 2024)</span></h4>
                                <h2> <div className="text2">You are now pre-enlisted. </div></h2>
                                <h2> <div className="text3">Your documents will be reviewed and verified by the HSU soon.  </div></h2>
                        </div>
                    <div className="button-sub my-flex">
                            <button className='btn'  onClick={handleButtonClick}>View Status</button>
                            <button className='btn'  onClick={handleButtonClick2}>Modify Submission</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubmissionInfo
