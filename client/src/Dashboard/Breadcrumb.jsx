import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(part => part);

  const formatPathPart = (part) => {
    return part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center space-x-2 text-sm">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center hover:text-blue-500 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {pathParts.length > 0 && (
          <li>
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </li>
        )}

        {pathParts.map((part, index) => {
          const href = `/${pathParts.slice(0, index + 1).join('/')}`;
          const isLast = index === pathParts.length - 1;

          return (
            <li key={part} className="flex items-center">
              <Link
                to={href}
                className={`flex items-center ${
                  isLast
                    ? 'font-semibold text-gray-900'
                    : 'text-gray-500 hover:text-blue-500 transition-colors'
                }`}
                aria-current={isLast ? 'page' : undefined}
              >
                {formatPathPart(part)}
              </Link>
              {!isLast && (
                <ChevronRight className="h-4 w-4 text-gray-500 ml-2" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;