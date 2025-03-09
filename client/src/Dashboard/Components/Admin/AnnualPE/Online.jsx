import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Tabs } from 'flowbite-react';
import {Link, useNavigate} from 'react-router-dom'
import { FileText, Users } from 'lucide-react';

import LoadingSkeleton from './LoadingSkeleton.jsx';

import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import Breadcrumb from "../../../Breadcrumb.jsx";
import UsersOnline from "./UsersOnline";
import { 
  HiOutlineDocumentText, 
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineViewGrid,
  HiUsers
} from 'react-icons/hi';

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, onClick }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onClick}>
    <div className="flex items-center">
      <div className={`p-4 ${bgClass} rounded-lg`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div className="ml-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  </Card>
);

const CollegeCard = ({ college, total, validated, checked, onClick }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onClick}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">{college}</h3>
      <HiOutlineAcademicCap className="w-6 h-6 text-blue-600" />
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Total Students</span>
        <span className="font-semibold">{total}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Validated</span>
        <span className="font-semibold text-green-600">{validated}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">To Check</span>
        <span className="font-semibold text-orange-500">{checked}</span>
      </div>
    </div>
  </Card>
);

const DegreeCard = ({ course, stats, onClick }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => onClick(course)}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{course}</h3>
      <HiOutlineAcademicCap className="w-5 h-5 text-blue-600" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Total Students</span>
        <span className="font-semibold">{stats?.total || 0}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Validated</span>
        <span className="font-semibold text-green-600">{stats?.validated || 0}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">To Check</span>
        <span className="font-semibold text-orange-500">{stats?.checked || 0}</span>
      </div>
    </div>
  </Card>
);

const Online = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [filter, setFilter] = useState("");
  const [totalCAS, setTotalCAS] = useState(0);
  const [totalCFOS, setTotalCFOS] = useState(0);
  const [totalSOTECH, setTotalSOTECH] = useState(0);
  const [totalCASValidated, setTotalCASValidated] = useState(0);
  const [totalCASChecked, setTotalCASChecked] = useState(0);
  const [totalCFOSValidated, setTotalCFOSValidated] = useState(0);
  const [totalCFOSChecked, setTotalCFOSChecked] = useState(0);
  const [totalSOTECHValidated, setTotalSOTECHValidated] = useState(0);
  const [totalSOTECHChecked, setTotalSOTECHChecked] = useState(0);
  const [degreeCourseCounts, setDegreeCourseCounts] = useState({});

  const [totalComplete, setTotalComplete] = useState(0);
  const [totalIncomplete, setTotalIncomplete] = useState(0);
  const [totalAllSubmissions, setTotalAllSubmissions] = useState(0);

  const [totalNoSubmissions, setTotalNoSubmissions] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalDenied, setTotalDenied] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const [totalApprovedDoctor, setTotalApprovedDoctor] = useState(0);
  const [totalApprovedDentist, setTotalApprovedDentis] = useState(0);
  const [totalPendingApproval, setTotalPendingApproval] = useState(0);



  const degreeCourses = [
    "COMMUNITY DEVELOPMENT",
    "History",
    "COMMUNICATION AND MEDIA STUDIES",
    "LITERATURE",
    "POLITICAL SCIENCE",
    "PSYCHOLOGY",
    "SOCIOLOGY",
    "APPLIED MATHEMATICS",
    "BIOLOGY",
    "CHEMISTRY",
    "COMPUTER SCIENCE",
    "ECONOMICS",
    "PUBLIC HEALTH",
    "STATISTICS",
    "FISHERIES",
    "CHEMICAL ENGINEERING",
    "FOOD TECHNOLOGY"
  ];

  const navigate = useNavigate(); 

  const capitalizeWords = (string) => 
    string.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const handleDegreeCourseClick = (course) => {
    window.open(`/users/course/${course}`, '_blank');
  };

  const handleCollegeClick = (college) => {
    window.open(`/users/college/${college}`, '_blank');
  };
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // Start loading
        let url = "/api/user/getusers";
        if (filter) {
          url += `?filter=${filter}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        console.log("API Response:", data); // Log the response
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers); // Ensure this matches backend response
          setTotalCAS(data.totalCAS);
          setTotalCFOS(data.totalCFOS);
          setTotalSOTECH(data.totalSOTECH);
          setTotalCASValidated(data.totalCASValidated);
          setTotalCASChecked(data.totalCASChecked);
          setTotalCFOSValidated(data.totalCFOSValidated);
          setTotalCFOSChecked(data.totalCFOSChecked);
          setTotalSOTECHValidated(data.totalSOTECHValidated);
          setTotalSOTECHChecked(data.totalSOTECHChecked);
          setDegreeCourseCounts(data.degreeCourseCounts);
          setTotalComplete(data.totalComplete); // Check existence
          setTotalIncomplete(data.totalIncomplete); // Check existence
          setTotalNoSubmissions(data.totalNoSubmissions); // Check existence
          setTotalApproved(data.totalApproved); // Check existence
          setTotalDenied(data.totalDenied); // Check existence
          setTotalPending(data.totalPending); // Check existence
          setTotalApprovedDoctor(data.totalApprovedDoctor);
          setTotalApprovedDentis(data.totalApprovedDentist);
          setTotalPendingApproval(data.totalPendingApproval);

        }
      } catch (error) {
        console.log(error.message);
      }
      finally {
        setLoading(false); // End loading
      }
    };
  
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, filter]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTotalAllSubmissions(totalComplete + totalIncomplete);
  }, [totalComplete, totalIncomplete]);

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent">
          {/* Header Card */}
          <Card className="w-full bg-gradient-to-br from-emerald-600 via-green-600 to-green-500 border-none shadow-lg">
            <div className="relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/20" />
                <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-white/20" />
              </div>

              <div className="relative p-8 space-y-6">
                {/* Header Content */}
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-6 w-6 text-emerald-100" />
                      <h1 className="text-3xl font-bold text-white">
                        Online Submissions of Physical Examinations
                      </h1>
                    </div>
                    <p className="text-emerald-50 text-lg max-w-2xl">
                      View and manage documents submitted for physical examination
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mt-4">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-emerald-100" />
                      <span className="text-emerald-50">Total Submissions</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{totalAllSubmissions}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-emerald-100" />
                      <span className="text-emerald-50">For Review</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{totalIncomplete}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-8">
            <Tabs>
              <Tabs.Item active title="Overview" icon={HiOutlineViewGrid}>
                {/* Status Section */}

                {loading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                <div className="mb-8">
                  <Card>
                    <h2 className="text-xl font-semibold mb-4">Annual PE Status</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      <StatCard
                        title="Approved"
                        value={totalApproved}
                        icon={HiOutlineCheckCircle}
                        colorClass="text-green-600"
                        bgClass="bg-green-100"
                      />
                      <StatCard
                        title="Pending"
                        value={totalPending}
                        icon={HiOutlineClock}
                        colorClass="text-yellow-600"
                        bgClass="bg-yellow-100"
                      />
                      <StatCard
                        title="Denied"
                        value={totalDenied}
                        icon={HiOutlineXCircle}
                        colorClass="text-red-600"
                        bgClass="bg-red-100"
                      />
                    </div>
                  </Card>
                </div>

                {/* Documents Status */}
                <div className="mb-8">
                  <Card>
                    <h2 className="text-xl font-semibold mb-4">Document Status</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      <StatCard
                        title="Complete Submissions"
                        value={totalComplete}
                        icon={HiOutlineDocumentText}
                        colorClass="text-green-600"
                        bgClass="bg-green-100"
                        onClick={() => window.open('/completeDocs', '_blank')}
                      />
                      <StatCard
                        title="Incomplete Submissions"
                        value={totalIncomplete}
                        icon={HiOutlineDocumentText}
                        colorClass="text-yellow-600"
                        bgClass="bg-yellow-100"
                        onClick={() => window.open('/incDocs', '_blank')}
                      />
                      <StatCard
                        title="No Submissions"
                        value={totalNoSubmissions}
                        icon={HiOutlineXCircle}
                        colorClass="text-red-600"
                        bgClass="bg-red-100"
                        onClick={() => window.open('/noDocs', '_blank')}
                      />
                    </div>
                  </Card>
                </div>

                  {/* Documents Status */}
                  <div className="mb-8">
                  <Card>
                    <h2 className="text-xl font-semibold mb-4">Approval Status</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      <StatCard
                        title="Approved by Doctor"
                        value={totalApprovedDoctor}
                        icon={HiOutlineDocumentText}
                        colorClass="text-green-600"
                        bgClass="bg-green-100"
                        onClick={() => window.open('/approved-doctor', '_blank')}
                      />
                      <StatCard
                        title="Approved by Dentist"
                        value={totalApprovedDentist}
                        icon={HiOutlineDocumentText}
                        colorClass="text-yellow-600"
                        bgClass="bg-yellow-100"
                        onClick={() => window.open('/approved-dentist', '_blank')}
                      />
                      <StatCard
                        title="For Overall Approval"
                        value={totalPendingApproval}
                        icon={HiOutlineXCircle}
                        colorClass="text-red-600"
                        bgClass="bg-red-100"
                        onClick={() => window.open('/approved-overall', '_blank')}
                      />
                    </div>
                  </Card>
                </div>

                {/* Colleges */}
                <Card>
                  <h2 className="text-xl font-semibold mb-4">Colleges</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <CollegeCard
                      college="CAS"
                      total={totalCAS}
                      validated={totalCASValidated}
                      checked={totalCASChecked}
                      onClick={() => handleCollegeClick('CAS')}
                    />
                    <CollegeCard
                      college="CFOS"
                      total={totalCFOS}
                      validated={totalCFOSValidated}
                      checked={totalCFOSChecked}
                      onClick={() => handleCollegeClick('CFOS')}
                    />
                    <CollegeCard
                      college="SOTECH"
                      total={totalSOTECH}
                      validated={totalSOTECHValidated}
                      checked={totalSOTECHChecked}
                      onClick={() => handleCollegeClick('SOTECH')}
                    />
                  </div>
                </Card>
                </>
              )}
              </Tabs.Item>

              <Tabs.Item title="View All" icon={HiUsers}>
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                ) : (
                  <UsersOnline users={users} />
                )}
              </Tabs.Item>

              <Tabs.Item title="Degree Programs" icon={HiOutlineAcademicCap}>
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <Card>
                  <h2 className="text-xl font-semibold mb-4">Degree Programs</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {degreeCourses.map((course) => (
                      <DegreeCard
                        key={course}
                        course={course}
                        stats={degreeCourseCounts[course]}
                        onClick={handleDegreeCourseClick}
                      />
                    ))}
                  </div>
                </Card>
              )}
              </Tabs.Item>
              
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Online;