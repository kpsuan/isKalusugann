import React from 'react';
import './features.css';
import { Button, Card } from 'flowbite-react';
import { GrSchedule } from "react-icons/gr";
import { IoDocumentsOutline } from "react-icons/io5";
import { TfiAnnouncement } from "react-icons/tfi";
import { LiaFileMedicalAltSolid } from "react-icons/lia";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Features = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='featuresSection'>
      <div className="">
        <h1 className='text-2xl font-bold mb-4'>Features</h1>
      </div>

      <div className="flex flex-1 w-full my-4">
        <Card
          href={currentUser.isAdmin ? '/adminPE' : '/annualhome'}
          className="flex-1 mr-2 p-5 cursor-pointer bg-gray-50 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg"
          horizontal
        >
          <div className="flex">
            <div className="flex items-center w-full">
              <h5 className="text-2xl font-light tracking-tight text-cyan-500 dark:text-white">
                <GrSchedule />
              </h5>
              <div className="flex flex-col pl-4">
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  {currentUser.isAdmin
                    ? 'Schedule and Reschedule Annual PE Examinations of Students'
                    : 'View Your Annual PE Examination Schedule'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card
          href={currentUser.isAdmin ? '/manageInPerson' : '/status'}
          className="flex-1 mr-2 p-5 cursor-pointer bg-gray-50 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg"
          horizontal
        >
          <div className="flex">
            <div className="flex items-center w-full">
              <h5 className="text-2xl font-light tracking-tight text-cyan-500 dark:text-white">
                <LiaFileMedicalAltSolid />
              </h5>
              <div className="flex flex-col pl-4">
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  {currentUser.isAdmin
                    ? 'View Submitted Medical Forms and Documents of Students'
                    : 'Submit and View Your Medical Forms'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-1 w-full my-2">
        <Card
          href={currentUser.isAdmin ? '/announcement' : '/announcement'}
          className="flex-1 cursor-pointer mr-2 p-5 bg-gray-50 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg"
          horizontal
        >
          <div className="flex">
            <div className="flex items-center w-full">
              <h5 className="text-2xl font-light tracking-tight text-cyan-500 dark:text-white">
                <TfiAnnouncement />
              </h5>
              <div className="flex flex-col pl-4">
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  {currentUser.isAdmin
                    ? 'Create, Edit, View and Post Announcements Online'
                    : 'View Announcements'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card
          href={currentUser.isAdmin ? '/documents' : '/docsuser'}
          className="flex-1 cursor-pointer mr-2 p-5 bg-gray-50 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg"
          horizontal
        >
          <div className="flex">
            <div className="flex items-center w-full">
              <h5 className="text-2xl font-light tracking-tight text-cyan-500 dark:text-white">
                <IoDocumentsOutline />
              </h5>
              <div className="flex flex-col pl-4">
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  {currentUser.isAdmin
                    ? 'Upload and View Downloadable Documents and Forms'
                    : 'Download Available Documents and Forms'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Features;
