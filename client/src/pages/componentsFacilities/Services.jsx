import React from 'react'

const Services = () => {
  return (
    <section className="px-11 bg-green-700 py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-11 2xl:px-0">
            <div className="mb-4 text-white flex items-center justify-between gap-4 md:mb-8">
            <h2 className="text-3xl font-semibold text-white dark:text-white">Services offered: </h2>

            
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <a href="#" className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-12 transition-all transform hover:scale-105 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ease-in-out duration-300">
                    <svg className="me-2 h-6 w-6 shrink-0 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z"></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Annual PE Examinations</span>
                </a>
                <a href="#" className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-12 transition-all transform hover:scale-105 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ease-in-out duration-300">
                    <svg className="me-2 h-6 w-6 shrink-0 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z"></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Medical Consultations</span>
                </a>
                <a href="#" className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-12 transition-all transform hover:scale-105 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ease-in-out duration-300">
                    <svg className="me-2 h-6 w-6 shrink-0 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Dental Services</span>
                </a>
                <a href="#" className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-12 transition-all transform hover:scale-105 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ease-in-out duration-300">
                    <svg className="me-2 h-6 w-6 shrink-0 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Laboratory Examinations</span>
                </a>
            </div>


        </div>
    </section>
  )
}

export default Services;
