import React from 'react';
import { Button } from 'flowbite-react'; // Import Flowbite's Button component
import { motion } from 'framer-motion'; // Import Framer Motion
import { useEffect, useState } from "react";

import CountUp from "react-countup";
import videoUrl from "../assets/med.mp4";

export default function Hero() {
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

  const textVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } },
  };

  const imageVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.3, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 object-cover w-full h-full"
          src={videoUrl}
          autoPlay
          loop
          muted
        />

        {/* Black overlay */}
        <div className="absolute inset-0 bg-black opacity-10"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <motion.h1
            className="max-w-2xl mb-4 text-4xl font-bold tracking-tight leading-none md:text-5xl xl:text-6xl text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            UPV Health Services Unit
          </motion.h1>
          <motion.p
            className="max-w-2xl mb-6 font-light text-white md:mb-8 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Explore cutting-edge solutions for your needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            <Button onClick={() => window.location.href = '/dashboard'} className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700">
              <p className="text-lg font-semibold">Access isKalusugan</p>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative bg-blue-700 dark:bg-gray-900 h-53 w-4/5 mx-auto -mt-32 z-20">

        <motion.div
          className="max-w-screen-xl px-4 py-28 mx-auto text-center lg:py-21 lg:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >

          <dl className="grid max-w-screen-lg gap-8 mx-auto text-white sm:grid-cols-3 dark:text-white">
            
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-5xl md:text-7xl font-extrabold">
                <CountUp start={0} end={totalScheduled} duration={3} separator="," />
              </dt>
              <dd className="font-light text-2xl md:text-3xl text-white dark:text-gray-400">
                Users Scheduled
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-5xl md:text-7xl font-extrabold">
                <CountUp start={0} end={totalOnline} duration={3.5} separator="," />
              </dt>
              <dd className="font-light text-2xl md:text-3xl text-white dark:text-gray-400">
                Documents Processed
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-5xl md:text-7xl font-extrabold">
                <CountUp start={0} end={totalUsers} duration={3} separator="," />
              </dt>
              <dd className="font-light text-2xl md:text-3xl text-white dark:text-gray-400">
                Users
              </dd>
            </div>
          </dl>

        </motion.div>
      </section>

      {/* New Section with Heading, Description, and Images */}
      <section className="bg-white dark:bg-gray-900">
        <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
          {/* Text Content */}
          <motion.div
            className="font-light text-gray-500 sm:text-lg dark:text-gray-400"
            initial="hidden"
            animate="visible"
            variants={textVariant}
          >
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Making university healthcare accessible
            </h2>
            <p className="mb-4">
              We are strategists, designers, and developers. Innovators and problem solvers. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need.
            </p>
            <p>
              We are strategists, designers, and developers. Innovators and problem solvers. Small enough to be simple and quick.
            </p>
          </motion.div>

          {/* Image Content */}
          <motion.div
            className="grid grid-cols-2 gap-4 mt-8"
            initial="hidden"
            animate="visible"
          >
            {[
              "https://www.upv.edu.ph/images/hsu-medical-mission1-2019.jpg",
              "https://www.upv.edu.ph/images/hsu-medical-mission3-2019.jpg",
              "https://www.upv.edu.ph/images/hsu-staff-vaccinated1.jpg",
              "https://i0.wp.com/www.imtnews.ph/wp-content/uploads/2019/10/1571617105194.jpg?fit=640%2C374&ssl=1",
            ].map((src, index) => (
              <motion.img
                key={index}
                custom={index}
                variants={imageVariant}
                className={`w-full rounded-lg ${
                  index > 1 ? "mt-4 lg:mt-10" : ""
                }`}
                src={src}
                alt={`office content ${index + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
