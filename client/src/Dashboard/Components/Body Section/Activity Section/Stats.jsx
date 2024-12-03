import React from 'react';
import { Card } from 'flowbite-react';
import { useEffect, useState } from "react";


const Stats = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalScheduled, setTotalScheduled] = useState(0);
  const [totalRescheduled, setTotalRescheduled] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = `/api/user/getstats`;

        const res = await fetch(url);
        const data = await res.json();
        console.log("API Response:", data); // Debugging response

        if (res.ok) {
          setTotalUsers(data.totalUsers || 0);
          setTotalEmployees(data.totalEmployees || 0);
          setTotalStudents(data.totalStudents || 0);
          setTotalRescheduled(data.totalReschedules || 0);
          setTotalScheduled(data.totalScheduled || 0);
          setTotalOnline(data.totalOnline || 0);
        } else {
          console.error("API error:", data.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching users:", error); 
      }
    };
  
    
    
      fetchUsers();
    
  }, []); 
  

  return (
    <div className="featuresSection">
      <div>
        <h1 className="text-2xl font-bold mb-6">Statistics</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <Card className="p-5 text-center bg-gradient-to-b from-cyan-300 to-blue-400 transition duration-300 ease-in-out transform hover:shadow-lg">
          <h5 className="text-6xl pt-4 font-bold tracking-tight text-cyan-100 dark:text-white">
            {totalUsers}
          </h5>
          <p className="font-normal text-lg text-white dark:text-gray-400">
            Total Users
          </p>
        </Card>

        <Card className="p-5 text-center bg-gradient-to-b from-cyan-300 to-blue-400 transition duration-300 ease-in-out transform hover:shadow-lg">
          <h5 className="text-6xl pt-4 font-bold tracking-tight text-cyan-100 dark:text-white">
            {totalStudents}
          </h5>
          <p className="font-normal text-lg text-white dark:text-gray-400">
            Total Students
          </p>
        </Card>

        <Card className="p-5 text-center bg-gradient-to-b from-cyan-300 to-blue-400 transition duration-300 ease-in-out transform hover:shadow-lg">
          <h5 className="text-6xl pt-4 font-bold tracking-tight text-cyan-100 dark:text-white">
            {totalEmployees}
          </h5>
          <p className="font-normal text-lg text-white dark:text-gray-400">
            HSU Employees
          </p>
        </Card>

        <Card 
        href='/manageInPerson'
        className="p-5 text-center bg-gradient-to-b from-cyan-300 to-blue-400 transition duration-300 ease-in-out transform hover:shadow-lg">
          <h5 className="text-6xl pt-4 font-bold tracking-tight text-cyan-100 dark:text-white">
            {totalScheduled}            
          </h5>
          <p className="font-normal text-lg text-white dark:text-gray-400">
            Students Scheduled for Annual PE
          </p>
        </Card>

        <Card 
        href='/reschedule'
        className="p-5 text-center bg-gradient-to-b from-cyan-300 to-blue-400 transition duration-300 ease-in-out transform hover:shadow-lg">
          <h5 className="text-6xl pt-4 font-bold tracking-tight text-cyan-100 dark:text-white">
            {totalRescheduled}
          </h5>
          <p className="font-normal text-lg text-white dark:text-gray-400">
           Reschedule Requests
          </p>
        </Card>
        <Card 
        href='/manage-online'
        className="p-5 text-center bg-gradient-to-b from-cyan-300 to-blue-400 transition duration-300 ease-in-out transform hover:shadow-lg">
          <h5 className="text-6xl pt-4 font-bold tracking-tight text-cyan-100 dark:text-white">
            {totalOnline}
          </h5>
          <p className="font-normal text-lg text-white dark:text-gray-400">
           Students who opted for Online PE 
          </p>
        </Card>

      </div>
    </div>
  );
};

export default Stats;
