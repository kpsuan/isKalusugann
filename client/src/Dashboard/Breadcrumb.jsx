import React from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { useLocation, Link } from 'react-router-dom';

const AutoBreadcrumb = () => {
  const location = useLocation();
  
  // Split the pathname into parts
  const pathParts = location.pathname.split('/').filter(part => part);

  // Function to capitalize the first letter of each part
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' '); // Capitalize and replace hyphens with spaces
  };

  return (
    <Breadcrumb aria-label="Default breadcrumb example" className="text-white">
      <Breadcrumb.Item as={Link} to="/" icon={HiHome} className="text-white">
        Home
      </Breadcrumb.Item>

      {pathParts.map((part, index) => {
        const href = `/${pathParts.slice(0, index + 1).join('/')}`;
        return (
          <Breadcrumb.Item key={index} as={Link} to={href} className="text-white">
            {capitalizeFirstLetter(part)}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default AutoBreadcrumb;
