import React, { useState, useEffect } from 'react';
import { 
  FaQuestionCircle, 
  FaSearch, 
  FaBookOpen, 
  FaVideo, 
  FaEnvelope, 
  FaRobot,
  FaChevronRight 
} from 'react-icons/fa';

const HelpCenter = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('topics');

  const helpSections = [
    {
      icon: FaBookOpen,
      title: 'Documentation',
      description: 'Comprehensive guides for platform navigation',
      color: 'bg-cyan-100 text-cyan-700',
      link: '/guides'
    },
    {
      icon: FaVideo,
      title: 'Tutorials',
      description: 'Interactive video walkthroughs',
      color: 'bg-green-100 text-green-700',
      link: '/tutorials'
    },
    {
      icon: FaEnvelope,
      title: 'Support',
      description: 'Direct assistance from our team',
      color: 'bg-indigo-100 text-indigo-700',
      link: '/contact'
    }
  ];

  const frequentQuestions = [
    {
      question: 'How do I reset my password?',
      answer: 'Navigate to login page, click "Forgot Password", and follow instructions.',
      category: 'Account'
    },
    {
      question: 'Updating profile information',
      answer: 'Go to Profile Settings, make changes, and save.',
      category: 'Account'
    },
    {
      question: 'Troubleshooting login issues',
      answer: 'Check internet connection, clear browser cache, or contact support.',
      category: 'Technical'
    }
  ];

  const tabs = [
    { 
      id: 'topics', 
      icon: <FaBookOpen />, 
      title: 'Help Topics' 
    },
    { 
      id: 'faq', 
      icon: <FaQuestionCircle />, 
      title: 'Frequent Questions' 
    },
    
  ];

  const filteredQuestions = frequentQuestions.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100 p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Help Center
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome, {currentUser?.firstName || 'User'}. How can we assist you today?
              </p>
            </div>
            <FaQuestionCircle className="text-5xl text-cyan-600" />
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <input 
              type="text"
              placeholder="Search help topics, questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-10 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-white rounded-xl shadow-md overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center p-4 
                ${activeTab === tab.id 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'}
                transition-colors duration-300
              `}
            >
              {tab.icon}
              <span className="ml-2 font-semibold">{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'topics' && (
          <div className="grid md:grid-cols-3 gap-6">
            {helpSections.map((section, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className={`p-5 ${section.color} flex items-center`}>
                  <section.icon className="text-4xl mr-4" />
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  <a 
                    href={section.link} 
                    className="text-cyan-600 hover:text-cyan-800 flex items-center"
                  >
                    Explore <FaChevronRight className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Frequently Asked Questions
            </h2>
            {filteredQuestions.map((faq, index) => (
              <div 
                key={index} 
                className="border-b py-4 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                  Category: {faq.category}
                </span>
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <p className="text-center text-gray-500">
                No results found
              </p>
            )}
          </div>
        )}

        {activeTab === 'ai-assist' && (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <FaRobot className="mx-auto text-6xl text-cyan-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              AI Help Assistant
            </h2>
            <p className="text-gray-600 mb-6">
              Get instant answers and guidance from our AI assistant.
            </p>
            <button className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition">
              Start Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;