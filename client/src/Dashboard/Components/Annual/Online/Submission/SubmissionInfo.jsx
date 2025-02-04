import React from "react";
import Sidebar from '../../../SideBar Section/Sidebar'
import Top from '../../../Profile/Components/Header'
import '../../../../../App.css'
import './submissionInfo.css'
import './uploader.css'
import { CheckCircle, ArrowRight, ChevronLeft } from "lucide-react";

import { useNavigate } from 'react-router-dom';



//import '../../onlinePE.scss'

const SubmissionInfo = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        navigate('/status');
    };

    const handleButtonClick2 = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        navigate(-1);
    };
    const headerTitle = "Annual Physical Examination";

    return (
        <div className="dashboard my-flex">
           <div className="dashboardContainer my-flex">
            <Sidebar/>
                <div className='mainContent'>
                    <div className="
                          transform transition-all duration-500 
                          animate-fadeIn">
                        <div className="titleUpload2 my-flex  ">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 animate-bounce" />

                                <h2> <div className="text2 mt-0">Documents Submitted! </div></h2>
                                <h2> <div className="text3">Your documents will be reviewed and verified by the HSU soon.  </div></h2>
                        </div>
                    <div className="button-sub my-flex">
                            <button className='btn'  onClick={handleButtonClick}>View Status</button>
                            <button className='btn'  onClick={handleButtonClick2}>Modify Submission</button>
                    </div>
                 </div>
                </div>
            </div>
        </div>
    )
}


const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 1s ease-out;
}

.animate-slideDown {
  animation: slideDown 0.8s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.8s ease-out;
}
`;

export default SubmissionInfo
