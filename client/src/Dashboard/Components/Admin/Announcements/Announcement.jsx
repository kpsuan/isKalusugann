import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import { useSelector } from 'react-redux';
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Announcement = () => {
    const { currentUser } = useSelector((state) => state.user);
    const headerTitle = "Announcements";
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
              <Top title={headerTitle} />
              {
                currentUser.isAdmin && (
                    <Link to = "/create-post">
                        <Button 
                            type = "button"
                            className="w-60 text-lg  bg-gradient-to-r from-green-500 to-blue-400 text-white px-14 py-4 rounded-md"
                            >
                                Create a post
                        </Button>
                    </Link>
                )
              }

            <div className="cardSection flex pt-6">
                <div> </div>
                <div className="bg-white rounded-lg border border-gray-200 p-10 w-3/4">

                    <div className="text-1xl font-light mb-4">Announcement</div>
                    <div>
                        <p className="text-gray-700">
                            This is the announcement section.
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