import React, { useState } from "react";

const labTests = [
  { type: "CBC", faculty: "35.00" },
  { type: "URINALYSIS", faculty: "25.00" },
  { type: "FECALYSIS", faculty: "15.00" },
  { type: "CHEST PA", faculty: "105.00" },
];

const StudentPackage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = labTests.filter((test) =>
    test.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-green-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
          <h2 className="bg-blue-600 text-white dark:text-white text-2xl font-bold px-5 py-8">
            STUDENT PACKAGE RATE (PHP 180.00)
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search lab tests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm py-12 text-left text-gray-500 dark:text-gray-400">
              <thead className="text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Type of Lab Test
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rates
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test, index) => (
                  <tr
                    key={index}
                    className="text-lg border-b dark:border-gray-700 transition duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {test.type}
                    </th>
                    <td className="px-6 py-4">{test.faculty}</td>
                  </tr>
                ))}
                {filteredTests.length === 0 && (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No lab tests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentPackage;
