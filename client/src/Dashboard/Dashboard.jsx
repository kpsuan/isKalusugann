import React from "react";
import { useInView } from "react-intersection-observer";
import Body from "./Components/Body Section/Body";
import Sidebar from "./Components/SideBar Section/Sidebar";

const Dashboard = () => {
    const { ref, inView } = useInView({
        threshold: 0.2, // Trigger animation when 20% of the element is visible
        triggerOnce: true, // Animate only once when it comes into view
    });

    return (
        <div className="dashboard flex bg-gray-50 p-4">
           <div
              ref={ref}
              className={`dashboardContainer flex transform transition-all duration-1000 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
            <Sidebar />
            <Body />
           </div>
        </div>
    );
};

export default Dashboard;
