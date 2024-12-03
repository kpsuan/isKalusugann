import React from "react";

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
  { type: "Creatinine", faculty: "75", students: "70", regular: "140", senior: "110" },
  { type: "Uric Acid", faculty: "85", students: "70", regular: "140", senior: "110" },
  { type: "SGPT", faculty: "156", students: "70", regular: "140", senior: "110" },
  { type: "BUN", faculty: "75", students: "70", regular: "140", senior: "110" },
  { type: "HDL", faculty: "85", students: "70", regular: "140", senior: "110" },
  { type: "Cholesterol", faculty: "90", students: "70", regular: "140", senior: "110" },
  { type: "Triglycerides", faculty: "125", students: "70", regular: "140", senior: "110" },
  { type: "Pregrancy Test", faculty: "220", students: "70", regular: "140", senior: "110" },

];

const LaboratoryServices = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <h2 className="bg-red-600 text-white justify-center dark:text-white text-2xl lg:text-2xl font-bold px-5 py-8">
            Updated Laboratory Services as of October 2021
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
                <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
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
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    required
                    />
                </div>
                </form>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm py-12 text-left text-gray-500 dark:text-gray-400">
              <thead className="text-lg py-3 px-6 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">Type of Lab Test</th>
                  <th scope="col" className="px-4 py-3">Faculty/Staff Dependents</th>
                  <th scope="col" className="px-4 py-3">Students</th>
                  <th scope="col" className="px-4 py-3">Regular Rates</th>
                  <th scope="col" className="px-4 py-3">Senior</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {labTests.map((test, index) => (
                  <tr key={index} className="text-lg border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-7 py-7 text-lg text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {test.type}
                    </th>
                    <td className="px-4 py-3">{test.faculty}</td>
                    <td className="px-4 py-3">{test.students}</td>
                    <td className="px-4 py-3">{test.regular}</td>
                    <td className="px-4 py-3">{test.senior}</td>
                    <td className="px-4 py-3 flex items-center justify-end">
                      <button
                        className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                        type="button"
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 10a2 2..." />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaboratoryServices;
