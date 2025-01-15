import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { HiUsers, HiAcademicCap, HiOfficeBuilding, HiCalendar, HiRefresh, HiGlobeAlt } from 'react-icons/hi';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, href, gradient }) => {
  return (
    <Card
      href={href}
      className="relative overflow-hidden transition-all duration-300 hover:scale-105 h-48"
    >
      <div className={`absolute inset-0 ${gradient} opacity-90`} />
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex justify-between items-start">
          <div className="bg-white/20 p-3 rounded-lg">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-5xl font-bold text-white">{value}</h3>
        </div>
        <div className="mt-auto">
          <p className="text-lg font-medium text-white/90 line-clamp-2">{title}</p>
        </div>
      </div>
    </Card>
  );
};

const Stats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalEmployees: 0,
    totalScheduled: 0,
    totalRescheduled: 0,
    totalOnline: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getstats');
        const data = await res.json();
        
        if (res.ok) {
          setStats({
            totalUsers: data.totalUsers || 0,
            totalStudents: data.totalStudents || 0,
            totalEmployees: data.totalEmployees || 0,
            totalScheduled: data.totalScheduled || 0,
            totalRescheduled: data.totalReschedules || 0,
            totalOnline: data.totalOnline || 0,
          });
        } else {
          console.error("API error:", data.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: HiUsers,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-400"
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: HiAcademicCap,
      gradient: "bg-gradient-to-br from-cyan-500 to-teal-400"
    },
    {
      title: "HSU Employees",
      value: stats.totalEmployees,
      icon: HiOfficeBuilding,
      gradient: "bg-gradient-to-br from-teal-500 to-emerald-400"
    },
    {
      title: "Students Scheduled for Annual PE",
      value: stats.totalScheduled,
      icon: HiCalendar,
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-400",
      href: '/manageInPerson'
    },
    {
      title: "Reschedule Requests",
      value: stats.totalRescheduled,
      icon: HiRefresh,
      gradient: "bg-gradient-to-br from-purple-500 to-pink-400",
      href: '/reschedule'
    },
    {
      title: "Students Opted for Online PE",
      value: stats.totalOnline,
      icon: HiGlobeAlt,
      gradient: "bg-gradient-to-br from-pink-500 to-rose-400",
      href: '/manage-online'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Statistics Dashboard
        </h1>
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Live Updates
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Stats;