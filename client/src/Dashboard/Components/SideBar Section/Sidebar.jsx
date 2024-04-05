import React from 'react'
import './sidebar.css'
import { Link } from 'react-router-dom'; 

import logo from '../../../assets/logo1.png'
import { IoMdSpeedometer } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { CiMedicalCase } from "react-icons/ci";
import { IoDocumentsOutline } from "react-icons/io5";
import { BsQuestionCircle } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";



const Sidebar = () => {
  return (
    <div className='sideBar grid'>
        <div className="logoDiv flex">
            <h1><img src={logo} alt='Image Name'/></h1>
        </div>

        <div className="menuDiv">
            <h3 className='divTitle'>
                QUICK MENU
            </h3>
            <ul className="menuLists grid">
                <li className="listItem">
                    <a href='/dashboard' className = 'menuLink flex'> 
                    <IoMdSpeedometer className='icon'/>
                    <span className="smallText">
                        Home
                    </span>
                    </a>
                </li>

                <li className="listItem">
                    <a href='/appointment' className = 'menuLink flex'> 
                    <IoCalendarOutline  className='icon'/>
                    <span className="smallText">
                        Appointments
                    </span>
                    </a>
                </li>

                <li className="listItem">
                    <a href='#' className = 'menuLink flex'> 
                    <IoDocumentsOutline  className='icon'/>
                    <span className="smallText">
                        Documents
                    </span>
                    </a>
                </li>

                <li className="listItem">
                    <a href='/annualPE' className = 'menuLink flex'> 
                    <CiMedicalCase   className='icon'/>
                    <span className="smallText">
                        Annual Physical Examinations
                    </span>
                    </a>
                </li>
                <li className="listItem">
                    <a href='/myProfile' className = 'menuLink flex'> 
                    <CgProfile   className='icon'/>
                    <span className="smallText">
                        My Profile
                    </span>
                    </a>
                </li>
            </ul>
        </div>

        <div className="settingsDiv">
            <h3 className='divTitle'>
                SETTINGS
            </h3>
            <ul className="menuLists grid">
                <li className="listItem">
                    <a href='#' className = 'menuLink flex'> 
                    <IoMdSpeedometer className='icon'/>
                    <span className="smallText">
                       Account
                    </span>
                    </a>
                </li>

                <li className="listItem">
                    <a href='#' className = 'menuLink flex'> 
                    <IoMdSpeedometer className='icon'/>
                    <span className="smallText">
                        Privacy
                    </span>
                    </a>
                </li>
                
            </ul>
        </div>

        <div className="sideBarCard">
            <BsQuestionCircle className='icon'/>
            <div className="cardContent">
                <div className="circle1"></div>

                <h3>Help Center</h3>
                <p>Having trouble accessing the UPV-HSU Portal, please contact us for more questions</p>
                <button className='btn'>Go to help center</button>
            </div>
        </div>
    </div>
  )
}

export default Sidebar