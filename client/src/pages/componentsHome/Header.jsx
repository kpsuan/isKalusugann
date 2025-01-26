import React, { useState } from "react";
import logo from "../../assets/hsulogo.png";

const TopHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Facilities and Services", href: "/facilities" },
    { label: "News", href: "/news" }
  ];

  return (
    <header className="sticky top-0 bg-teal-400 shadow-md dark:bg-gray-900 ">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-center items-center">
          

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-gray-600 hover:text-blue-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-white hover:text-teal-600 transition-colors duration-300 ease-in-out font-medium dark:text-gray-100  "
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4">
            <ul className="bg-white shadow-lg rounded-lg">
              {menuItems.map((item, index) => (
                <li key={index} className="border-b last:border-b-0">
                  <a
                    href={item.href}
                    className="block px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopHeader;