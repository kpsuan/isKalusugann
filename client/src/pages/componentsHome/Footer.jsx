import React from "react";
import logo from "../../assets/logo1.png";

const Footer = () => {
  return (
    <footer className="p-4 bg-slate-50 sm:p-6 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="https://flowbite.com" className="flex flex-col items-center text-center">
              <img
                src={logo}
                className="mb-2 h-10"
                alt="ISKALUSUGAN Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                a UPV HSU Portal
              </span>
            </a>
          </div>
          
         
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 h-full">
          

            <div className="flex flex-col h-full">
              
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Quick Links
              </h2>
              <ul className="text-gray-600 dark:text-gray-400 flex-grow">
                <li className="mb-4">
                  <a href="https://crs.upv.edu.ph/" className="hover:underline">
                    Computerized Registration System
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://lms.upvisayas.net/login.php" className="hover:underline">
                    UPV Learning Management System
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://www.upv.edu.ph/" className="hover:underline">
                    UP Visayas Website
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://tlrc.upv.edu.ph/" className="hover:underline">
                    UPV TLRC Website
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://library.upv.edu.ph/" className="hover:underline">
                    UPV Online Library
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col h-full">
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Follow us
              </h2>
              <ul className="text-gray-600 dark:text-gray-400 flex-grow">
                <li className="mb-4">
                  <a
                    href="https://www.facebook.com/upv.hsu.miagao/"
                    className="hover:underline"
                  >
                    Facebook
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://maps.app.goo.gl/uTuXbhgJdTVMumWD6"
                    className="hover:underline"
                  >
                    UP Visayas, Miagao, 5023 Iloilo
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="hsumiagaomedical@upv.edu.ph"
                    className="hover:underline"
                  >
                    Email: hsumiagaomedical@upv.edu.ph
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/4eeurUVvTy"
                    className="hover:underline"
                  >
                    033-3158301 (Landline)
                  </a>
                </li>
              </ul>
            </div>
            {/* Google Map Embed Section */}
          <div className="mt-6 mb-6 md:mb-0 md:mt-0">

<div className="w-full mt-4">
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2772.6602477045894!2d122.22783244735504!3d10.64671784293533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33ae5c783e406039%3A0xc19cd3690ea64d5f!2sUPV%20Infirmary!5e0!3m2!1sen!2sph!4v1732002623520!5m2!1sen!2sph" 
  width="100%" 
  height="200"
  style={{ border: "0" }}
  allowfullscreen="" 
  loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade"
  title="UPV HSU Location">   
</iframe>
</div>
</div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <a href="https://flowbite.com" className="hover:underline">
              isKalusugan™
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
