import React from 'react';
import { Link } from 'react-router-dom';
import { GrSchedule } from "react-icons/gr";
import { IoDocumentsOutline } from "react-icons/io5";
import { TfiAnnouncement } from "react-icons/tfi";
import { LiaFileMedicalAltSolid } from "react-icons/lia";
import { useSelector } from 'react-redux';


const Features = () => {
  const { currentUser } = useSelector((state) => state.user);

  const features = [
    {
      icon: GrSchedule,
      title: currentUser?.isAdmin ? 'PE Management' : 'Annual Physical Examination',
      description: currentUser?.isAdmin
        ? 'Manage Annual PE Examinations'
        : 'View Annual PE Status',
      link: currentUser?.isAdmin ? '/adminPE' : '/annualhome',
      gradient: 'from-teal-100 to-teal-200',
      iconBg: 'bg-teal-500',
      iconColor: 'text-white'
    },
    {
      icon: LiaFileMedicalAltSolid,
      title: currentUser?.isAdmin ? 'Manage Document Requests' : 'Request Documents',
      description: currentUser?.isAdmin
        ? 'Manage request for documents such as laboratory examinations'
        : 'Submit and track request',
      link: currentUser?.isAdmin ? '/manageRequests' : '/requestDocs',
      gradient: 'from-cyan-100 to-cyan-200',
      iconBg: 'bg-cyan-500',
      iconColor: 'text-white'
    },
    {
      icon: TfiAnnouncement,
      title: 'Announcements',
      description: currentUser?.isAdmin
        ? 'Create and Manage Announcements'
        : 'View Latest Announcements',
      link: '/announcement',
      gradient: 'from-green-100 to-green-200',
      iconBg: 'bg-green-500',
      iconColor: 'text-white'
    },
    {
      icon: IoDocumentsOutline,
      title: currentUser?.isAdmin ? 'Document Management' : 'Documents',
      description: currentUser?.isAdmin
        ? 'Upload and Manage Documents'
        : 'Download Available Forms',
      link: currentUser?.isAdmin ? '/documents' : '/docsuser',
      gradient: 'from-emerald-100 to-emerald-200',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Link 
            to={feature.link}
            key={index}
            className="block transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div 
              className={`
                bg-gradient-to-br ${feature.gradient} 
                rounded-2xl p-5 
                flex items-center space-x-5 
                shadow-md hover:shadow-lg
              `}
            >
              <div className={`
                ${feature.iconBg} ${feature.iconColor}
                p-3 rounded-xl 
                flex items-center justify-center
              `}>
                <feature.icon className="text-3xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Features;