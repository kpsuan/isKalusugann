import React from "react";
import logo from "../../assets/hsulogo.png";
import { useState, useEffect } from 'react'; // Import useState and useEffect


const TopHeader = () => {
  return (
    <header>
      <nav className="bg-slate-70 border-gray-200 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-center items-center mx-auto max-w-screen-xl">
          <div
            className="hidden justify-center p-2 items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 text-lg lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-5 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white transition duration-300 ease-in-out transform hover:text-blue-500 "
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 transition duration-300 ease-in-out transform hover:text-blue-500 "
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/facilities"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 transition duration-300 ease-in-out transform hover:text-blue-500 "
                >
                  Facilities and Services
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 transition duration-300 ease-in-out transform hover:text-blue-500  "
                >
                  News
                </a>
              </li>
              
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default TopHeader;
