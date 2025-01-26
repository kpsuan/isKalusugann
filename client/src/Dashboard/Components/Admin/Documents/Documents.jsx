import { useState, useEffect } from 'react';
import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import Sidebar from "../../SideBar Section/Sidebar";
import Docs from "./Docs";
import GetDocs from "./GetDocs";
import DocsListView from "./DocsListView";
import "../../Annual/annual.css";
import { DocumentProvider } from './DocumentContext';
import { motion } from 'framer-motion';

import { Card } from 'flowbite-react';

import { FileText } from 'lucide-react';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('upload'); // Track active tab

  useEffect(() => {
   
  }, [activeTab]);

  return (
    <DocumentProvider>
      <div className="dashboard my-flex">
        <div className="dashboardContainer my-flex">
          <Sidebar />
          <div className="mainContent m-0 p-0">
          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 space-y-6"
            >

            <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 border-none">
                <div className="relative overflow-hidden p-8">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-8 h-8 text-white" />
                      <h1 className="text-3xl font-bold text-white">
                        Documents
                      </h1>
                    </div>
                    <p className="text-white/80 max-w-xl">
                     Manage and access all documents needed. 
                    </p>
                  </div>
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mt-16 -mr-16 blur-2xl" />
                </div>
              </Card>

              <Tabs aria-label="Default tabs" style="default" className="my-4 ">
                <Tabs.Item 
                  active={activeTab === 'upload'} 
                  title="Upload Documents" 
                  icon={HiUserCircle}
                  onClick={() => setActiveTab('upload')}
                >
                  <Docs />
                </Tabs.Item>
                <Tabs.Item 
                  active={activeTab === 'all'} 
                  title="All Documents" 
                  icon={MdDashboard}
                  onClick={() => setActiveTab('all')}
                >
                  <DocsListView />
                </Tabs.Item>
                <Tabs.Item 
                  active={activeTab === 'your'} 
                  title="Your Documents" 
                  icon={HiAdjustments}
                  onClick={() => setActiveTab('your')}
                >
                  <GetDocs />
                </Tabs.Item>
              </Tabs>
          </motion.div>
          </div>
        </div>
      </div>
    </DocumentProvider>
  );
};

export default Documents 
