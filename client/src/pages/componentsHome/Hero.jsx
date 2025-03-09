import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineUser, HiOutlineDocument, HiOutlineCalendar, HiPlay, HiPause } from 'react-icons/hi';
import CountUp from "react-countup";
import videoUrl from "../assets/med.mp4";

const StatCard = ({ icon: Icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.6, 
      delay, 
      type: "spring", 
      stiffness: 200, 
      damping: 10 
    }}
    className="relative p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-2xl hover:scale-105 transition-transform"
  >
    <motion.div 
      className="absolute -top-5 -left-5 p-4 bg-gradient-to-br from-blue-600/50 to-cyan-600/50 backdrop-blur-md rounded-xl shadow-lg"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="w-10 h-10 text-white" />
    </motion.div>
    <div className="mt-4 text-center">
      <dt className="mb-2 text-5xl md:text-6xl font-bold text-white">
        <CountUp 
          start={0} 
          end={value} 
          duration={2.5} 
          separator="," 
          enableScrollSpy
        />
      </dt>
      <dd className="text-xl text-white/90 font-medium tracking-wide">
        {label}
      </dd>
    </div>
  </motion.div>
);

export default function Hero() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScheduled: 0,
    totalDocumentRequests: 0
  });
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/user/getstats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const toggleVideoPlayback = () => {
    const video = document.getElementById('heroVideo');
    if (video) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-900 to-black">
      <section className="relative w-full h-screen overflow-hidden">
        <motion.video
          id="heroVideo"
          className="absolute inset-0 object-cover w-full h-full"
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        <motion.button
          onClick={toggleVideoPlayback}
          className="absolute top-6 right-6 z-30 p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isVideoPlaying ? (
              <HiPause key="pause" className="w-6 h-6 text-white" />
            ) : (
              <HiPlay key="play" className="w-6 h-6 text-white" />
            )}
          </AnimatePresence>
        </motion.button>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              type: "spring", 
              stiffness: 100 
            }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block mb-6"
          >
            <span className="text-xl font-medium text-white tracking-wider animate-pulse">
              Welcome to UPV HSU
            </span>
          </motion.div>
          
          <motion.h1
            className="max-w-4xl mb-6 text-5xl md:text-7xl font-bold text-white text-center leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              type: "spring", 
              stiffness: 120 
            }}
          >
            UPV <span className="text-cyan-300">Health Services</span> Unit
          </motion.h1>

          <motion.p
            className="max-w-2xl mb-8 text-xl md:text-2xl text-white/90 text-center font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
          Making healthcare accessible for All UPV Constituents
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className="px-8 py-3 bg-cyan-500 text-white rounded-full text-lg font-semibold hover:bg-cyan-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/dashboard'}
            >
              Access isKalusugan
            </motion.button>
            <motion.button
              className="px-8 py-3 border-2 border-white/50 text-white rounded-full text-lg font-semibold hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/about'}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="relative -mt-32 z-20 container mx-auto px-2">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            icon={HiOutlineCalendar}
            value={stats.totalScheduled}
            label="Annual PE Scheduled"
            delay={0}
          />
          <StatCard 
            icon={HiOutlineDocument}
            value={stats.totalDocumentRequests}
            label="Documents Processed"
            delay={0.2}
          />
          <StatCard 
            icon={HiOutlineUser}
            value={stats.totalUsers}
            label="Active Users"
            delay={0.4}
          />
        </div>
      </section>
    </main>
  );
}