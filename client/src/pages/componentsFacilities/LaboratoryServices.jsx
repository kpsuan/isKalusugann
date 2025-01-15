import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // For animations
import { useSelector } from "react-redux"; // To access the currentUser

const labTests = [
  { type: "Fecalysis", faculty: "20", students: "15", regular: "50", senior: "40" },
  { type: "Urinalysis", faculty: "30", students: "22.50", regular: "140", senior: "110" },
  { type: "CBC", faculty: "45", students: "70", regular: "140", senior: "110" },
  { type: "Platelet Count", faculty: "40", students: "70", regular: "140", senior: "110" },
  { type: "CT-BC", faculty: "30", students: "70", regular: "140", senior: "110" },
  { type: "Hematocrit", faculty: "25", students: "70", regular: "140", senior: "110" },
  { type: "Hemoglobin", faculty: "20", students: "70", regular: "140", senior: "110" },
  { type: "Blood Typing", faculty: "25", students: "70", regular: "140", senior: "110" },
  { type: "FBS", faculty: "50", students: "70", regular: "140", senior: "110" },
  { type: "Lipid Profile", faculty: "380", students: "70", regular: "140", senior: "110" },
];

const LaboratoryServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useSelector((state) => state.user); 
  // Filtered lab tests based on the search query
  const filteredTests = labTests.filter((test) =>
    test.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle price change (only for admins)
  const handlePriceChange = (index, type, newValue) => {
    // Logic to handle price change, this could be updating the state or making an API call
    console.log(`Updated ${type} price for ${filteredTests[index].type}: ${newValue}`);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-6 sm:p-10">
      <div className="mx-auto max-w-screen-xl">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <h2 className="bg-red-600 text-white text-center text-2xl font-bold p-6">
            Updated Laboratory Services as of October 2021
          </h2>
          <div className="p-6">
            <form className="mb-6">
              <label htmlFor="search" className="sr-only">Search</label>
              <input
                type="text"
                id="search"
                className="block w-full p-3 text-sm rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Search by test type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-lg text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Type of Lab Test</th>
                    <th className="px-6 py-4">Faculty/Staff</th>
                    <th className="px-6 py-4">Students</th>
                    <th className="px-6 py-4">Regular Rates</th>
                    <th className="px-6 py-4">Senior</th>
                    {currentUser.isAdmin && <th className="px-6 py-4 text-right">Actions</th>} {/* Show actions only for admin */}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredTests.length > 0 ? (
                      filteredTests.map((test, index) => (
                        <motion.tr
                          key={index}
                          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td className="px-6 py-4 text-gray-900 dark:text-white">{test.type}</td>
                          <td className="px-6 py-4">
                            {currentUser.isAdmin? (
                              <input
                                type="number"
                                className="w-full px-3 py-1 border border-gray-300 rounded-md"
                                value={test.faculty}
                                onChange={(e) => handlePriceChange(index, "faculty", e.target.value)}
                              />
                            ) : (
                              test.faculty
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {currentUser.isAdmin ? (
                              <input
                                type="number"
                                className="w-full px-3 py-1 border border-gray-300 rounded-md"
                                value={test.students}
                                onChange={(e) => handlePriceChange(index, "students", e.target.value)}
                              />
                            ) : (
                              test.students
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {currentUser.isAdmin? (
                              <input
                                type="number"
                                className="w-full px-3 py-1 border border-gray-300 rounded-md"
                                value={test.regular}
                                onChange={(e) => handlePriceChange(index, "regular", e.target.value)}
                              />
                            ) : (
                              test.regular
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {currentUser.isAdmin? (
                              <input
                                type="number"
                                className="w-full px-3 py-1 border border-gray-300 rounded-md"
                                value={test.senior}
                                onChange={(e) => handlePriceChange(index, "senior", e.target.value)}
                              />
                            ) : (
                              test.senior
                            )}
                          </td>
                          {currentUser.isAdmin && (
                            <td className="px-6 py-4 text-right">
                              <button
                                className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                                type="button"
                              >
                                View
                              </button>
                            </td>
                          )}
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        className="bg-white dark:bg-gray-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td
                          colSpan="6"
                          className="text-center px-6 py-4 text-gray-700 dark:text-gray-300"
                        >
                          No results found.
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaboratoryServices;
