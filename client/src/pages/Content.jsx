import React from 'react';

import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import logo from '../assets/logo1.png';
// Define the items for rendering
const items = [
  {
    icon: <SettingsSuggestRoundedIcon className="text-white" />,
    title: 'Schedule and Reschedule Annual PE',
    description:
      'Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.',
  },
  {
    icon: <ConstructionRoundedIcon className="text-white" />,
    title: 'Upload documents for Annual PE online',
    description:
      'Experience unmatched durability that goes above and beyond with lasting investment.',
  },
  {
    icon: <ThumbUpAltRoundedIcon className="text-white" />,
    title: 'Get timely updates and announcements',
    description:
      'Integrate our product into your routine with an intuitive and easy-to-use interface.',
  },

];

export default function Content() {
  return (
    <div className="flex flex-col items-center gap-4 max-w-sm mx-auto  ">
      {/* SitemarkIcon Section */}
      <div className="hidden md:flex">
        <img src={logo} alt='logo' className='w-full h-auto pl-5' />
      </div>

      <div className='text-2xl font-semibold text-white mb-4'>A UPV HSU Portal</div>
      {/* Map through the items to display each one */}
      {items.map((item, index) => (
        <div 
        key={index} 
        className="flex gap-2 "
      >
        {item.icon}
        <div>
          <h3 className="font-medium font-semibold text-gray-800">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
        </div>
      </div>
      
      ))}
    </div>
  );
}
