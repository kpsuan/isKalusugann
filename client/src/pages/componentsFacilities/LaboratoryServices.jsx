import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const LaboratoryServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState(null);

  const [tests, setTests] = useState([
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
  ]);
  
  useEffect(() => {
    fetchLabServices();
  }, []);
  
  const fetchLabServices = async () => {
    try {
      const response = await fetch("/api/lab/getlabservices");
      const data = await response.json();
      
      // Only update tests if the database has data; otherwise, keep the default prices
      if (data.length > 0) {
        setTests(data);
      }
    } catch (error) {
      console.error("Error fetching lab services:", error);
    }
  };
  
  

  const handleEdit = (index) => {
    setEditingId(index);
    setEditedRow({ ...tests[index] });
  };

  const handleSave = async (index) => {
    try {
      await fetch("/api/lab/createlab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedRow),
      });
      
      const updatedTests = [...tests];
      updatedTests[index] = editedRow;
      setTests(updatedTests);
      setEditingId(null);
      setEditedRow(null);
    } catch (error) {
      console.error("Error saving lab service:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedRow(null);
  };

  const handleChange = (field, value) => {
    setEditedRow({
      ...editedRow,
      [field]: value,
    });
  };

  const filteredTests = tests.filter((test) =>
    test.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-gradient-to-b from-teal-400 to-black dark:bg-gray-900 p-6 sm:p-10">
      <div className="mx-auto max-w-screen-xl">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <h2 className="bg-teal-700 text-white text-center text-2xl font-bold p-6">
            Updated Laboratory Services
          </h2>
          <div className="p-6">
            <input
              type="text"
              placeholder="Search by test type"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 mb-6 text-sm border border-gray-300 rounded-md"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Faculty</th>
                    <th className="px-6 py-4">Students</th>
                    <th className="px-6 py-4">Regular</th>
                    <th className="px-6 py-4">Senior</th>
                    {currentUser?.isAdmin && <th className="px-6 py-4">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredTests.map((test, index) => (
                      <motion.tr key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <td className="px-6 py-4">
                          {editingId === index ? (
                            <input
                              type="text"
                              value={editedRow.type}
                              onChange={(e) => handleChange("type", e.target.value)}
                              className="w-full p-1 border"
                            />
                          ) : (
                            test.type
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === index ? (
                            <input
                              type="number"
                              value={editedRow.faculty}
                              onChange={(e) => handleChange("faculty", e.target.value)}
                              className="w-full p-1 border"
                            />
                          ) : (
                            test.faculty
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === index ? (
                            <input
                              type="number"
                              value={editedRow.students}
                              onChange={(e) => handleChange("students", e.target.value)}
                              className="w-full p-1 border"
                            />
                          ) : (
                            test.students
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === index ? (
                            <input
                              type="number"
                              value={editedRow.regular}
                              onChange={(e) => handleChange("regular", e.target.value)}
                              className="w-full p-1 border"
                            />
                          ) : (
                            test.regular
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === index ? (
                            <input
                              type="number"
                              value={editedRow.senior}
                              onChange={(e) => handleChange("senior", e.target.value)}
                              className="w-full p-1 border"
                            />
                          ) : (
                            test.senior
                          )}
                        </td>
                        {currentUser?.isAdmin && (
                          <td className="px-6 py-4">
                            {editingId === index ? (
                              <>
                                <button onClick={() => handleSave(index)} className="px-3 py-1 bg-green-600 text-white">
                                  Save
                                </button>
                                <button onClick={handleCancel} className="px-3 py-1 bg-gray-600 text-white">
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button onClick={() => handleEdit(index)} className="px-3 py-1 bg-blue-600 text-white">
                                Edit
                              </button>
                            )}
                          </td>
                        )}
                      </motion.tr>
                    ))}
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
