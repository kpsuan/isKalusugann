import React from 'react'
import {Button, Card} from 'flowbite-react';
import { GrSchedule } from "react-icons/gr";
import { IoDocumentsOutline } from "react-icons/io5";
import { TfiAnnouncement } from "react-icons/tfi";
import { LiaFileMedicalAltSolid } from "react-icons/lia";

import { Link } from 'react-router-dom'; 
const Stats = () => {
  return (
    <div className='featuresSection'>
      <div className="">
        <h1 className='text-2xl font-bold mb-2'>Statistics</h1>
      </div>

      <Card className="max-w-sm p-3 ml-1 my-3">

      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-2 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-medium text-gray-900 dark:text-white">Users</p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">$320</div>
            </div>
          </li>
          <li className="py-2 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-medium text-gray-900 dark:text-white">Documents</p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                $3467
              </div>
            </div>
          </li>
          <li className="py-2 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-medium text-gray-900 dark:text-white">Announcements</p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                $3467
              </div>
            </div>
          </li>


        </ul>
      </div>
    </Card>
      
    </div>
  )
}

export default Stats