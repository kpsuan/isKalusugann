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

const Documents = () => {
  const [activeTab, setActiveTab] = useState('upload'); // Track active tab

  useEffect(() => {
    // This effect will run whenever the active tab changes
    // Here you could trigger data fetching or other updates
  }, [activeTab]);

  return (
    <DocumentProvider>
      <div className="dashboard my-flex">
        <div className="dashboardContainer my-flex">
          <Sidebar />
          <div className="mainContent">
            <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
              <div className="bg-white rounded-lg border border-gray-200 p-10 w-3/4">
                <div className="text-2xl font-bold mb-4">Documents</div>
                <p className="font-light my-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </DocumentProvider>
  );
};

export default Documents 
