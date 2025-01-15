import React from 'react';
import { Card } from 'flowbite-react';
import { PiUsersFourLight } from 'react-icons/pi';
import { FaCheck, FaCircleXmark } from 'react-icons/fa6';
import { LuPin } from 'react-icons/lu';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <Card className="flex-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

const StatsDashboard = ({ totalUsers, totalApproved, totalDenied, totalPending }) => {
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: PiUsersFourLight,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Approved',
      value: totalApproved,
      icon: FaCheck,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Denied',
      value: totalDenied,
      icon: FaCircleXmark,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Pending',
      value: totalPending,
      icon: LuPin,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsDashboard;