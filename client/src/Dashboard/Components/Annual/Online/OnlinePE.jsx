import React from "react";
import Sidebar from '../../SideBar Section/Sidebar'
import Top from '../../Profile/Components/Header'
import '../../../../App.css'
import { Accordion, Button } from "flowbite-react";
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';


const OnlinePE = () => {
    const navigate = useNavigate();

    const headerTitle = "Annual Physical Examination";
    const handleButtonClick = () => {
        // Add your desired functionality here
        // For example, you can navigate to a different page
        window.location.href = "/online2";
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
                            <div className="mb-8 text-center">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">
                                Preenlistment Period
                            </span>
                            <h1 className="text-3xl font-bold mt-4 mb-2">Online Medical Examination System</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Below shows the process of the Online Medical Examination System. 
                                Click the confirm button to get started.
                            </p>
                        </div>

                                    <div className="w-3/4 mx-auto pt-5">
                                        <Accordion className="w-full mx-auto shadow-lg">
                                            <Accordion.Panel className="active">
                                                <Accordion.Title className="text-lg font-semibold">Pre-Enlistment Period</Accordion.Title>
                                                <Accordion.Content>
                                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                During the pre-enlistment period, users can pick their mode of medical examination. Users may start submitting their medical forms after the pre-enlistment period.
                                                </p>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    Check out the &nbsp;
                                                    <a
                                                    href="https://flowbite.com/docs/getting-started/introduction/"
                                                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                                                    >
                                                    requirements&nbsp;
                                                    </a>
                                                </p>
                                                </Accordion.Content>
                                            </Accordion.Panel>
                                            <Accordion.Panel>
                                                <Accordion.Title className="text-lg font-semibold">Submission of Forms</Accordion.Title>
                                                <Accordion.Content>
                                                <p className="text-gray-600 pl-11">
                                                    Users are required to submit the necessary forms after the pre-enlistment 
                                                    period for HSU validation. The medical certificate must come from the 
                                                    <strong> List of Regulated Health Facilities and Services and RHUs in the Philippines</strong>.
                                                </p>
                                                <div className="pl-11 mt-2 flex flex-col space-y-2">
                                                    <a href="https://nhfr.doh.gov.ph/VActivefacilitiesList" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        View approved health facilities
                                                    </a>
                                                    <a href="#" className="text-blue-600 hover:underline inline-flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        Download required forms
                                                    </a>
                                                </div>
                                                </Accordion.Content>
                                            </Accordion.Panel>
                                            <Accordion.Panel>
                                                <Accordion.Title className="text-lg font-semibold" >HSU Reviews and Validates Documents After Pre-Enlistment Period</Accordion.Title>
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
                                                <Accordion.Title className="text-lg font-semibold">Receive Updates from the HSU and View Attached MedCert if approved </Accordion.Title>
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

export default OnlinePE
