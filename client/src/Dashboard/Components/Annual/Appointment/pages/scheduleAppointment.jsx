
import Sidebar from "../../../SideBar Section/Sidebar";
import Top from "../../../Profile/Components/Header";
import  { Card, Alert, Label, Select  } from 'flowbite-react';
import ProgressBar from "./ProgressBar";
import Datepicker from "./Datepicker";
import "./schedApp.css";
import { useState, useEffect } from 'react';

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'
const scheduleAppointment = () => {
  const [date, setDate] = useState('');
  const handleDateChange = (selectedDate) => {
    const dateString = selectedDate.startOf('day').format('YYYY-MM-DD');
    setDate(dateString);
  };
  
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
            <Card href="#" className="w-full h-150 p-10 bg-gradient-to-r from-sky-600 to-green-300">
                        <div className="flex justify-between">
                            <div className="flex-1">
                                <h5 className="text-4xl font-light tracking-tight text-white dark:text-white">
                                    Book a Dental Appointment
                                </h5>
                                <p className="font-normal text-white dark:text-gray-400 pt-4">
                                    Schedule dental appointments with ease
                                </p>
                            </div>
                        </div>
              </Card>
              <ProgressBar/>
              <Alert color="warning" rounded className="text-md mt-4 w-2/3 bg-yellow-100 text-yellow-500  focus:ring-yellow-400 dark:bg-yellow-200 dark:text-yellow-600 dark:hover:bg-yellow-300">
                Please be advised that your chosen time slot is reserved for  <span className="font-semibold ">30 minutes..</span> 
              </Alert>

              <div className="flex flex-wrap">
                
                <div className="flex-1 w-3/4 mt-5">
                  <div className="w-3/4">
                      <div className="mb-2 block">
                        <Label htmlFor="service2" className="text-lg" value="Select service: " />
                      </div>
                      <Select id="service" required style={{ fontSize: '1.25rem' }} className="w-1/2">
                        <option>Dental Consultation/Check-up</option>
                        <option>Cleaning</option>
                        <option>Dental Fillings (Pasta ng ngipin)</option>
                        <option>Tooth Extraction</option>
                      </Select>


                  </div>
      
                  <div className="w-full my-10 ">
                  <div className="block">
                        <Label className="text-lg" value="Pick date and time: " />
                      </div>
                    <p className="text-sm mb-5 text-green-500 mt-2">Earliest available appointment: <span className="font-semibold">20 August 2024</span></p>
                    <Datepicker 
                      onDateChange={handleDateChange} 
                      selectedDate={date} // Pass selected date to Calendar
                    /> 
                  </div>
                </div>
              </div>

              <div className="btn-flex">
                </div>
            </div>
          </div>
        </div>
      );
}

export default scheduleAppointment