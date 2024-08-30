import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import { useSelector } from 'react-redux';
import { Card, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import DashPost from "./DashPost";
import DashAnnouncement from "../../AnnouncementUser/DashAnnouncement";
import { HiUserCircle } from "react-icons/hi";
import { Tabs } from "flowbite-react";

const Announcement = () => {
    const { currentUser } = useSelector((state) => state.user);
    const headerTitle = "Announcements";
    return (
        <div className="dashboard my-flex">
            <div className="dashboardContainer my-flex">
                <Sidebar />
                <div className="mainContent">
                <Card href="#" className="w-full h-150 p-10 bg-gradient-to-r from-cyan-600 to-green-500">
                                    <div className="text-4xl font-light tracking-tight text-white dark:text-white">Announcements</div>
                                    <p className="font-normal text-white dark:text-gray-400 pt-4">
                                        View all announcements here
                                    </p>
                                </Card>
                   
                    <Tabs aria-label="Default tabs" style="default" className="my-4">
                        <Tabs.Item title="Make an announcement" icon={HiUserCircle}>
                            {currentUser.isAdmin && (
                            <Link to="/create-post">
                                <div className="bg-white rounded-lg border border-gray-200 p-10 w-3/4">
                                    <div className="text-2xl font-light mb-4">Create an announcement</div>
                                    <p className="font-light my-4">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus.
                                    </p>
                                    <Button
                                        type="button"
                                        className="w-80 text-lg bg-gradient-to-r from-green-500 to-blue-400 text-white px-20 py-4 rounded-md"
                                    >
                                        Create a post
                                    </Button>
                                </div>
                            </Link>
                        )}
                        </Tabs.Item>
                        <Tabs.Item active title="Posted by you" icon={HiUserCircle}>
                            <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
                                
                                <div>
                                    <p className="text-gray-700 my-10">
                                        {currentUser.isAdmin ? <DashPost /> : <DashAnnouncement />}
                                    </p>
                                </div>
                            </div>
                        </Tabs.Item>
                        <Tabs.Item title="All Announcements" icon={HiUserCircle}>
                            <DashAnnouncement />
                        </Tabs.Item>
                        
                        
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default Announcement;
