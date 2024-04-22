
import Sidebar from "../SideBar Section/Sidebar";
import Top from "../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../../../redux/user/userSlice';

import "./annual.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'

const MainPE = () => {
  const [mode, setMode] = useState(""); // State to track user's choice
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const fileRef = useRef(null);
 
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Check if the user has already submitted their option
    if (currentUser && (currentUser.peForm && currentUser.labResults && currentUser.requestPE) || currentUser.annualPE === 'InPerson') {
      navigate('/submissionInfo'); // Redirect to the status page if all options are already submitted
    }
  }, [currentUser]);

  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
    setFormData({ ...formData, annualPE: selectedMode });
    console.log("Selected mode:", selectedMode); // Log the selected mode to console
    // Here you can implement code to store the user's response, for example, sending it to a server or storing it in localStorage.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      if (mode === "Online") {
        navigate('/onlinePE');
      } else if (mode === "InPerson") {
        navigate('/inPersonPE');
      }
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  
  const headerTitle = "Annual Physical Examination";

  // Method to handle user's choice and store it

  
  
  
  
  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent">
          <Top title={headerTitle} />
          <div className="titlePE my-flex">
            <h4>
              <b>Preenlistment Period </b>{" "}
              <span className="lighter-font">(January 12-20, 2024)</span>
            </h4>
            <h2>
              {" "}
              <span className="text2">
                Choose preferred mode of Annual Physical Examination
              </span>
            </h2>

            <div className="choicePE">
              <div className="choice1">
                {/* Use onClick to trigger the method when user selects a mode */}
                <span
                  className="label-PE"
                  onClick={() => handleModeSelection("Online")}
                >
                  Online Physical Examination
                  <div className="small-desc">Done through online submission</div>
                </span>
              </div>

              <div className="choice2">
                {/* Use onClick to trigger the method when user selects a mode */}
                <span
                  className="label-PE"
                  onClick={() => handleModeSelection("InPerson")}
                >
                  Schedule In-Person Examination
                  <div className="small-desc">
                    Get your schedules via the system
                  </div>
                </span>
              </div>
            </div>
            <button 
             onClick={(e) => {
                  handleSubmit(e);
             }}
            
             
             className="btn w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200" type="submit">Save Preference</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPE;
