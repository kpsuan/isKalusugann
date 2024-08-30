import React from "react";
import Sidebar from '../../SideBar Section/Sidebar'
import Top from '../../Profile/Components/Header'
import '../../../../App.css'
import './inPerson.scss'
import { Accordion, Button } from "flowbite-react";
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';


const inPerson2 = () => {
    const navigate = useNavigate();

    const headerTitle = "Annual Physical Examination";
    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        window.location.href = "/inPerson3";
    };

    const handleGoBackClick = () => {
        navigate(-1);
      };
      

    return (
        <div className="dashboard flex">
           <div className="dashboardContainer flex">
            <Sidebar/>
                <div className='mainContent'>
                    <Top title={headerTitle}/>
                            <div className="titleOnlinePE flex">
                                    <h4 className="text-center"><b>Preenlistment Period </b></h4>
                                    <h1 className="text-3xl text-black text-center"> InPerson Medical Examination System</h1>
                                    <p className="text-center text-gray-400"> Below shows the process of the InPerson Medical Examination System. Click the confirm button to be scheduled</p>
                                    <div className="w-3/4 mx-auto pt-5">
                                        <Accordion className="w-full mx-auto shadow-lg">
                                            <Accordion.Panel className="active">
                                                <Accordion.Title className="text-lg font-semibold">Pre-Enlistment Period</Accordion.Title>
                                                <Accordion.Content>
                                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                    Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons,
                                                    dropdowns, modals, navbars, and more.
                                                </p>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    Check out this guide to learn how to&nbsp;
                                                    <a
                                                    href="https://flowbite.com/docs/getting-started/introduction/"
                                                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                                                    >
                                                    get started&nbsp;
                                                    </a>
                                                    and start developing websites even faster with components on top of Tailwind CSS.
                                                </p>
                                                </Accordion.Content>
                                            </Accordion.Panel>
                                            <Accordion.Panel>
                                                <Accordion.Title className="text-lg font-semibold" >Scheduling Process</Accordion.Title>
                                                <Accordion.Content>
                                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                    Flowbite is first conceptualized and designed using the Figma software so everything you see in the library
                                                    has a design equivalent in our Figma file.
                                                </p>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    Check out the
                                                    <a href="https://flowbite.com/figma/" className="text-cyan-600 hover:underline dark:text-cyan-500">
                                                    Figma design system
                                                    </a>
                                                    based on the utility classes from Tailwind CSS and components from Flowbite.
                                                </p>
                                                </Accordion.Content>
                                            </Accordion.Panel>
                                            <Accordion.Panel>
                                                <Accordion.Title className="text-lg font-semibold">View Assigned Schedule </Accordion.Title>
                                                <Accordion.Content>
                                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                    The main difference is that the core components from Flowbite are open source under the MIT license, whereas
                                                    Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone
                                                    components, whereas Tailwind UI offers sections of pages.
                                                </p>
                                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                    However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there is no
                                                    technical reason stopping you from using the best of two worlds.
                                                </p>
                                                <p className="mb-2 text-gray-500 dark:text-gray-400">Learn more about these technologies:</p>
                                                <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                                                    <li>
                                                    <a href="https://flowbite.com/pro/" className="text-cyan-600 hover:underline dark:text-cyan-500">
                                                        Flowbite Pro
                                                    </a>
                                                    </li>
                                                    <li>
                                                    <a
                                                        href="https://tailwindui.com/"
                                                        rel="nofollow"
                                                        className="text-cyan-600 hover:underline dark:text-cyan-500"
                                                    >
                                                        Tailwind UI
                                                    </a>
                                                    </li>
                                                </ul>
                                                </Accordion.Content>
                                            </Accordion.Panel>
                                        </Accordion>
                                    </div>
                                <div className="flex justify-center gap-4 mt-6 w-3/4 mx-auto">
                                    <Button onClick={handleGoBackClick} className=" w-3/4 mx-auto transition duration-300 ease-in-out transform hover:scale-105 text-2xl bg-gradient-to-r from-red-500 to-red-400 text-white px-3 py-3 rounded-md">
                                    Go Back 
                                    </Button>
                                    <Button onClick={handleButtonClick} className=" w-3/4 mx-auto transition duration-300 ease-in-out transform hover:scale-105 text-2xl bg-gradient-to-r from-green-500 to-green-400 text-white px-3 py-3 rounded-md">
                                    Confirm 
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    );
}

export default inPerson2
