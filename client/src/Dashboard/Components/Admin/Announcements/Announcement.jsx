import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import { useSelector } from 'react-redux';
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import DashPost from "./DashPost";
import DashAnnouncement from "../../AnnouncementUser/DashAnnouncement";

const Announcement = () => {
    const { currentUser } = useSelector((state) => state.user);
    const headerTitle = "Announcements";
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
              
              {
                currentUser.isAdmin && (
                    
                    <Link to = "/create-post">
                        <div className="bg-white rounded-lg border border-gray-200 p-10 w-3/4">
                        <div className="text-2xl font-light mb-4">Create an announcement</div>
                        <p className="font-light my-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus.</p>
                            <Button 
                                type = "button"
                                className="w-80 text-lg  bg-gradient-to-r from-green-500 to-blue-400 text-white px-20 py-4 rounded-md"
                                >
                                    Create a post
                            </Button>
                        </div>
                    </Link>
                )
              }
            
            
            <div className="cardSection flex pt-6">
                <div> </div>
                <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
                
                    <div className="text-2xl font-semibold mb-4">Announcement</div>
                    <p className="font-light my-9">Lorem ipsum dolor sit amet, consectetur</p>
                    <div>
                        <p className="text-gray-700 my-10">
                        {currentUser.isAdmin ? <DashPost /> : <DashAnnouncement />}
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </div>
    );
}

export default Announcement