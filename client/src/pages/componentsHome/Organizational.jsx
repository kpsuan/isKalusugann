import React from 'react';
import { Button } from 'flowbite-react'; // Import Flowbite's Button component

export default function Organizational() {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-4 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Organizational Heads
            </h2>
            <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
              Explore the whole collection of open-source web components and elements built with the utility classes from Tailwind.
            </p>
          </div>
          <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
            <div className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                <img
                  className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                  src="https://www.upv.edu.ph/images/hsu-chief-mccv.jpg"
                  alt="CECILIA C. VILLARUZ"
                />
              </a>
              <div className="p-5">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">DR. MA. CECILIA C. VILLARUZ</a>
                </h3>
                <span className="text-gray-500 dark:text-gray-400">Chief, Health Services Unit</span>
                <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                
                </p>
                <ul className="flex space-x-4 sm:mt-0">
                  <li>
                    <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    Email: hsu-mia@upv.edu.ph | Phone: (033) 315-8301
                    </a> 
                    
                  </li>
                </ul>
                <Button className="mt-4">Contact Bonnie</Button> {/* Added Flowbite Button */}
              </div>
            </div>
            <div className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                <img
                  className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                  alt="Jese Avatar"
                />
              </a>
              <div className="p-5">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">Jese Leos</a>
                </h3>
                <span className="text-gray-500 dark:text-gray-400">CTO</span>
                <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                  Jese drives the technical strategy of the flowbite platform and brand.
                </p>
                <ul className="flex space-x-4 sm:mt-0">
                  <li>
                    <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                      {/* Add social media icon or other link here */}
                    </a>
                  </li>
                </ul>
                <Button className="mt-4">Contact Jese</Button> {/* Added Flowbite Button */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
