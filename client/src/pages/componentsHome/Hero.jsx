import React, { useEffect, useState } from 'react';
import { Button, Card, Badge } from 'flowbite-react';
import { motion } from 'framer-motion';
import CountUp from "react-countup";
import { HiOutlineUser, HiOutlineDocument, HiOutlineCalendar } from 'react-icons/hi';
import videoUrl from "../assets/med.mp4";

const StatCard = ({ icon: Icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="relative p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl"
  >
    <div className="absolute -top-4 -left-4 p-3 bg-white/20 backdrop-blur-md rounded-lg">
      <Icon className="w-8 h-8 text-white" />
    </div>
    <div className="mt-2">
      <dt className="mb-2 text-5xl md:text-6xl font-bold text-white">
        <CountUp start={0} end={value} duration={2.5} separator="," />
      </dt>
      <dd className="text-xl text-white/90 font-medium">
        {label}
      </dd>
    </div>
  </motion.div>
);

export default function Hero() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalEmployees: 0,
    totalScheduled: 0,
    totalRescheduled: 0,
    totalOnline: 0
  });

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

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        <video
          className="absolute inset-0 object-cover w-full h-full"
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <Badge 
            color="info" 
            size="xl"
            className="mb-6 animate-bounce"
          >
            Welcome to UPV HSU
          </Badge>
          
          <motion.h1
            className="max-w-4xl mb-6 text-5xl md:text-7xl font-bold text-white text-center leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            UPV Health Services Unit
          </motion.h1>

          <motion.p
            className="max-w-2xl mb-8 text-xl md:text-2xl text-white/90 text-center font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Providing comprehensive healthcare services to empower and protect our university community
          </motion.p>

          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="xl"
              gradientDuoTone="cyanToBlue"
              className="px-8"
              onClick={() => window.location.href = '/dashboard'}
            >
              Access isKalusugan
            </Button>
            <Button
              size="xl"
              color="gray"
              className="px-8"
              onClick={() => window.location.href = '/about'}
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative -mt-32 z-20 container mx-auto px-2">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            icon={HiOutlineCalendar}
            value={stats.totalScheduled}
            label="Appointments Scheduled"
            delay={0}
          />
          <StatCard 
            icon={HiOutlineDocument}
            value={stats.totalOnline}
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

      {/* About Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge color="purple" size="lg">About Us</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Making University Healthcare
                <span className="text-blue-600"> Accessible</span>
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Our dedicated team of healthcare professionals works tirelessly to ensure
                  that every member of the UPV community has access to quality medical care
                  and support services.
                </p>
                <p>
                  Through innovative solutions and a patient-centered approach, we're
                  transforming the way healthcare is delivered on campus.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                "https://www.upv.edu.ph/images/hsu-medical-mission1-2019.jpg",
                "https://www.upv.edu.ph/images/hsu-medical-mission3-2019.jpg",
                "https://www.upv.edu.ph/images/hsu-staff-vaccinated1.jpg",
                "https://i0.wp.com/www.imtnews.ph/wp-content/uploads/2019/10/1571617105194.jpg",
              ].map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative overflow-hidden rounded-xl shadow-lg ${
                    index > 1 ? 'mt-4 lg:mt-8' : ''
                  }`}
                >
                  <img
                    src={src}
                    alt={`UPV Health Services ${index + 1}`}
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}