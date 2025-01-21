import React from 'react';
import { Card } from 'flowbite-react';
import { GrSchedule } from "react-icons/gr";
import { IoDocumentsOutline } from "react-icons/io5";
import { TfiAnnouncement } from "react-icons/tfi";
import { LiaFileMedicalAltSolid } from "react-icons/lia";

const Features = ({ currentUser }) => {
  const features = [
    {
      icon: <GrSchedule className="text-4xl" />,
      title: currentUser?.isAdmin ? 'Annual PE Management' : 'PE Schedule',
      description: currentUser?.isAdmin
        ? 'Schedule and Reschedule Annual PE Examinations of Students'
        : 'View Your Annual PE Examination Schedule',
      link: currentUser?.isAdmin ? '/adminPE' : '/annualhome',
      color: 'bg-slate-200',
      iconColor: 'text-blue-600'
    },
    {
      icon: <LiaFileMedicalAltSolid className="text-4xl" />,
      title: currentUser?.isAdmin ? 'Medical Records' : 'Medical Forms',
      description: currentUser?.isAdmin
        ? 'View Submitted Medical Forms and Documents of Students'
        : 'Submit and View Your Medical Forms',
      link: currentUser?.isAdmin ? '/manageInPerson' : '/status',
      color: 'bg-slate-200',
      iconColor: 'text-emerald-600'
    },
    {
      icon: <TfiAnnouncement className="text-4xl" />,
      title: 'Announcements',
      description: currentUser?.isAdmin
        ? 'Create, Edit, View and Post Announcements Online'
        : 'View Announcements',
      link: '/announcement',
      color: 'bg-slate-200',
      iconColor: 'text-amber-600'
    },
    {
      icon: <IoDocumentsOutline className="text-4xl" />,
      title: currentUser?.isAdmin ? 'Document Management' : 'Documents',
      description: currentUser?.isAdmin
        ? 'Upload and View Downloadable Documents and Forms'
        : 'Download Available Documents and Forms',
      link: currentUser?.isAdmin ? '/documents' : '/docsuser',
      color: 'bg-slate-200',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card
            key={index}
            href={feature.link}
            className={`cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-lg border-none ${feature.color}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-white shadow-md ${feature.iconColor}`}>
                {React.cloneElement(feature.icon)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;