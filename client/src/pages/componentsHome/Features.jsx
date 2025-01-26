import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  Users, 
  ChevronRight, 
  Zap 
} from 'lucide-react';
import image from '../../assets/dashboard.png';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const containerRef = useRef(null);

  const features = [
    {
      id: 1,
      title: "Schedule PE",
      description: "Seamless planning and scheduling of annual Physical Education events.",
      icon: Calendar,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 2,
      title: "Attendance Tracking",
      description: "Advanced monitoring and reporting of PE participation.",
      icon: Users,
      gradient: 'from-teal-500 to-cyan-600'
    },
    {
      id: 3,
      title: "Document Management",
      description: "Easy document download and request system.",
      icon: FileText,
      gradient: 'from-green-400 to-teal-500'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-teal-900 to-black min-h-screen py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Hero Image Section */}
          <div className="relative group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-2xl shadow-2xl"
            >
              <img 
                src={image} 
                alt="Dashboard" 
                className="w-full h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </motion.div>
          </div>

          {/* Hero Content Section */}
          <div className='p-10'>
            <motion.h1 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-5xl font-bold mb-6 text-teal-200"
            >
              isKalusugan <br />
              <span className="text-3xl text-slate-400">UPV HSU Portal</span>
            </motion.h1>
            <motion.p
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-md text-white mb-8"
            >
              Streamline your Physical Education management with cutting-edge digital solutions.
            </motion.p>

          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setActiveFeature(feature.id)}
              onHoverEnd={() => setActiveFeature(null)}
              className={`
                relative p-6 rounded-2xl shadow-lg 
                ${activeFeature === feature.id 
                  ? `bg-gradient-to-br ${feature.gradient} text-white` 
                  : 'bg-white text-gray-800'}
                transition-all duration-300 transform
              `}
            >
              <div className={`
                w-16 h-16 rounded-full mb-4 flex items-center justify-center
                ${activeFeature === feature.id 
                  ? 'bg-white/20' 
                  : 'bg-gradient-to-br ' + feature.gradient + ' text-white'}
              `}>
                <feature.icon 
                  className={`w-8 h-8 ${
                    activeFeature === feature.id ? 'text-white' : 'text-white'
                  }`} 
                />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {feature.title}
              </h3>
              <p className={`
                ${activeFeature === feature.id 
                  ? 'text-white/80' 
                  : 'text-gray-600'}
                mb-4
              `}>
                {feature.description}
              </p>
              <motion.button
                whileHover={{ x: 10 }}
                className={`
                  flex items-center 
                  ${activeFeature === feature.id 
                    ? 'text-white' 
                    : 'text-blue-600 hover:text-blue-800'}
                `}
              >
                Learn More <ChevronRight className="ml-2" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Features;