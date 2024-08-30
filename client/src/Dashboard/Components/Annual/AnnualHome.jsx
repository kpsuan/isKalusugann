import Sidebar from "../SideBar Section/Sidebar";
import Top from "../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Card, Timeline, Accordion, Tabs, Alert, Button, Modal, ModalBody, TextInput, Table, TableCell } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { HiArrowNarrowRight } from "react-icons/hi";
import Divider from '@mui/material/Divider';
import { Banner } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import Activity from "../Body Section/Activity Section/Activity"


import { MdDashboard } from "react-icons/md"
import { useDispatch } from 'react-redux';

import "./annual.css";

import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom'

const AnnualHome = () => {
    const navigate = useNavigate();
    const [isPreEnlistEnabled, setIsPreEnlistEnabled] = useState(true);
    const [showModal, setShowModal] = useState(false);
  
    // Define the pre-enlistment period
    const preEnlistStart = new Date('2024-08-01T00:00:00+08:00');
    const preEnlistEnd = new Date('2024-09-11T23:59:59+08:00');
    const formattedStartDate = preEnlistStart.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
      const formattedEndDate = preEnlistEnd.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
  
    useEffect(() => {
      const now = new Date();
  
      console.log('Current date and time:', now.toISOString()); // For debugging
      console.log('Pre-enlist start:', preEnlistStart.toISOString()); // For debugging
      console.log('Pre-enlist end:', preEnlistEnd.toISOString()); // For debugging
  
      if (now < preEnlistStart || now > preEnlistEnd) {
        setIsPreEnlistEnabled(false);
      }
    }, [preEnlistStart, preEnlistEnd]);
  
    const handlePreEnlistClick = () => {
      const now = new Date();
  
      console.log('Handle Pre-enlist Click - Current date and time:', now.toISOString()); // For debugging
  
      if (now < preEnlistStart || now > preEnlistEnd) {
        setShowModal(true); // Show modal if not within pre-enlistment period
      } else {
        navigate('/annualPE'); // Navigate if within pre-enlistment period
      }
    };


  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent"> 
            <Banner>
                <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                    <div className="mx-auto flex items-center">
                    <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                        <MdAnnouncement className="mr-4 h-4 w-4" />
                        <span className="[&_p]:inline">
                            Pre-enlistment period starts on <span className="font-medium text-blue-500">{formattedStartDate} and ends on {formattedEndDate}</span>&nbsp;
                        </span>
                    </p>
                    </div>
                    <Banner.CollapseButton color="gray" className="border-0 bg-transparent text-gray-500 dark:text-gray-400">
                    <HiX className="h-4 w-4" />
                    </Banner.CollapseButton>
                </div>
            </Banner>
            <div className="relative flex space-x-1">
                <Card href="#" className="w-full h-150 p-10 bg-gradient-to-r from-slate-600 to-slate-900">
                    <h5 className="text-3xl font-light tracking-tight text-white dark:text-white">
                        Annual Physical Examinations
                    </h5>
                    <p className="font-normal text-white dark:text-gray-400">
                    The UPV Health Service Unit conducts Physical Examinations of students every year in order to ensure if they are fit for enrollment.
                    </p>
                    <div className="relative flex  space-x-2">
                    <Button
                        className="my-2 transition duration-300 ease-in-out transform hover:scale-105 text-lg bg-gradient-to-r from-green-500 to-green-400 text-white px-3 py-3 rounded-md"
                        onClick={() => navigate('/status')} // Wrap navigate call in an anonymous function
                        >
                        View Status
                    </Button>
                        <Button
                        className={`my-2 text-lg text-white px-3 py-3 rounded-md  transition duration-300 ease-in-out transform hover:scale-105 ${
                            isPreEnlistEnabled ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        onClick={handlePreEnlistClick}
                        disabled={!isPreEnlistEnabled}
                        >
                        Pre-enlist
                        </Button>
                    </div>
                </Card>   
                
            </div>
            <div className="bg-white pr-3 w-full">
            

            <h1 className="text-3xl pt-10">General Reminders</h1>
                <div className="flex flex-col justify-center">
                <Accordion className="mt-4 mb-4">
                    <Accordion.Panel>
                        <Accordion.Title className="text-lg font-medium">What is Flowbite?</Accordion.Title>
                        <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                            Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons,
                            dropdowns, modals, navbars, and more.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                            Check out this guide to learn how to&nbsp;
                            <a
                            href="https://flowbite.com/docs/getting-started/introduction/"
                            className="text-cyan-600 hover:underline dark:text-cyan-500"
                            >
                            get started&nbsp;
                            </a>
                            and start developing websites even faster with components on top of Tailwind CSS.
                        </p>
                        </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                        <Accordion.Title className="text-lg font-medium">Is there a Figma file available?</Accordion.Title>
                        <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                            Flowbite is first conceptualized and designed using the Figma software so everything you see in the library
                            has a design equivalent in our Figma file.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                            Check out the
                            <a href="https://flowbite.com/figma/" className="text-cyan-600 hover:underline dark:text-cyan-500">
                            Figma design system
                            </a>
                            based on the utility classes from Tailwind CSS and components from Flowbite.
                        </p>
                        </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                        <Accordion.Title className="text-lg font-medium">What are the differences between Flowbite and Tailwind UI?</Accordion.Title>
                        <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                            The main difference is that the core components from Flowbite are open source under the MIT license, whereas
                            Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone
                            components, whereas Tailwind UI offers sections of pages.
                        </p>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                            However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there is no
                            technical reason stopping you from using the best of two worlds.
                        </p>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">Learn more about these technologies:</p>
                        <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                            <li>
                            <a href="https://flowbite.com/pro/" className="text-cyan-600 hover:underline dark:text-cyan-500">
                                Flowbite Pro
                            </a>
                            </li>
                            <li>
                            <a
                                href="https://tailwindui.com/"
                                rel="nofollow"
                                className="text-cyan-600 hover:underline dark:text-cyan-500"
                            >
                                Tailwind UI
                            </a>
                            </li>
                        </ul>
                        </Accordion.Content>
                    </Accordion.Panel>
                </Accordion>
                </div>
                <h1 className="text-3xl pt-10 pb-8">Announcements</h1>
                <Activity/>
            </div>
          </div>
      </div>
      {/* Modal for error */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Pre-enlistment Error</Modal.Header>
        <Modal.Body>
          <p className="text-gray-700">
            Cannot pre-enlist, pre-enlistment period has elapsed.
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AnnualHome;
