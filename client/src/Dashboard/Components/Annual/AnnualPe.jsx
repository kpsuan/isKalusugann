import Sidebar from "../SideBar Section/Sidebar";
import Top from "../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Card, Timeline, Accordion, Tabs, Alert, Button, Modal, ModalBody, TextInput, Table, TableCell } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../../../redux/user/userSlice';
import "./annual.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MainPE = () => {
  const [mode, setMode] = useState(""); // State to track user's choice
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Assuming previous choice is stored in currentUser
    if (currentUser && currentUser.annualPE) {
      setMode(currentUser.annualPE); // Set mode to the previous choice
    }
  }, [currentUser]);

  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
    setFormData({ ...formData, annualPE: selectedMode });
    console.log("Selected mode:", selectedMode); 
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
        navigate('/inPerson');
      }
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const headerTitle = "Annual Physical Examination";

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent">
          <Top title={headerTitle} />
          <div className="titlePE my-flex">
            <h4>
              <b>Annual PE Selection </b>{" "}
            </h4>
            <h2>
              {" "}
              <span className="text-2xl text-black">
                Choose your preferred mode of Annual PE
              </span>
            </h2>

            <div className="choicePE h-full">
              <div
                className={`choice1 cursor-pointer transition-transform duration-300 ease-in-out transform ${
                  mode === 'Online' ? 'bg-[#89f0fa] scale-105' : 'bg-white hover:scale-105'
                }`}
                onClick={() => handleModeSelection('Online')}
              >
                <span className="label-PE text-black">
                  Online Physical Examination
                  <div className="small-desc">Done through online submission</div>
                </span>
              </div>

              <div
                className={`choice2 cursor-pointer transition-transform duration-300 ease-in-out transform ${
                  mode === 'InPerson' ? 'bg-[#89f0fa] scale-105' : 'bg-white hover:scale-105'
                }`}
                onClick={() => handleModeSelection('InPerson')}
              >
                <span className="label-PE text-black">
                  Schedule In-Person Examination
                  <div className="small-desc">Get your schedules via the system</div>
                </span>
              </div>
            </div>
            
            <Button
              className={`w-1/2 my-10 transition duration-300 ease-in-out transform hover:scale-105 text-2xl bg-gradient-to-r from-green-500 to-green-400 text-white p-3 rounded-2xl ${
                mode ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={handleSubmit}
              disabled={!mode}
            >
              Save Preference
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPE;
