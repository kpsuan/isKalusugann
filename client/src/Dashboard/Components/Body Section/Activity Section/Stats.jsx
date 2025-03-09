import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card } from 'flowbite-react';
import { HiUsers, HiAcademicCap, HiOfficeBuilding, HiCalendar, HiRefresh, HiGlobeAlt } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, href, gradient }) => {
  return (
    <Card
      href={href}
      className="relative overflow-hidden transition-all duration-300 hover:scale-105 h-48"
    >
      <div className={`absolute inset-0 ${gradient} opacity-90`} />
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex justify-between items-start">
          <div className="bg-white/20 p-3 rounded-lg">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-5xl font-bold text-white">{value}</h3>
        </div>
        <div className="mt-auto">
          <p className="text-lg font-medium text-white/90 line-clamp-2">{title}</p>
        </div>
      </div>
    </Card>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

// Initial empty state with proper structure to avoid errors during initial render
const initialState = {
  totalUsers: 0,
  totalApproved: 0,
  totalDenied: 0,
  totalPending: 0,
  totalStudents: 0,
  totalEmployees: 0,
  totalScheduled: 0,
  totalRescheduled: 0,
  totalOnline: 0,
  totalCAS: 0,
  totalCFOS: 0,
  totalSOTECH: 0,
  totalCASScheduled: 0,
  totalCFOSScheduled: 0,
  totalSOTECHScheduled: 0,
  totalApprovedDocs: 0,
  totalDeniedDocs: 0,
  totalPendingDocs: 0,
  completionRate: 0,
  monthlyStats: [],
  userTypeDistribution: [],
  statusDistribution: [],
  statusDocsDistribution: [],
  collegeComparison: [],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Stats = () => {
  const [stats, setStats] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use AbortController for fetch cancellation
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const controller = new AbortController();
    const signal = controller.signal;
    
    try {
      // Fetch data in parallel instead of sequentially
      const [statsRes, monthlyRes] = await Promise.all([
        fetch('/api/user/getstats', { signal }),
        fetch('/api/user/getmonthlystats', { signal })
      ]);
      
      // Validate responses
      if (!statsRes.ok) throw new Error(`Stats fetch failed: ${statsRes.status}`);
      if (!monthlyRes.ok) throw new Error(`Monthly stats fetch failed: ${monthlyRes.status}`);
      
      // Parse JSON in parallel
      const [data, monthlyData] = await Promise.all([
        statsRes.json(),
        monthlyRes.json()
      ]);
      
      const filteredMonthlyData = monthlyData.filter(month => month.scheduled > 0);
      
      // Prepare data structures only once
      const userTypeDistribution = [
        { name: 'Scheduled', value: data.totalScheduled || 0 },
        { name: 'Online', value: data.totalOnline || 0 }
      ];

      const statusDistribution = [
        { name: 'Approved', value: data.totalApproved || 0 },
        { name: 'Pending', value: data.totalPending || 0 },
        { name: 'Denied', value: data.totalDenied || 0 }
      ];

      const statusDocsDistribution = [
        { name: 'Approved', value: data.totalApprovedDocs || 0 },
        { name: 'Pending', value: data.totalPendingDocs || 0 },
        { name: 'Denied', value: data.totalDeniedDocs || 0 }
      ];

      const collegeComparison = [
        {
          name: 'CAS',
          scheduled: data.totalCASScheduled || 0,
          online: data.totalCAS || 0,
        },
        {
          name: 'CFOS',
          scheduled: data.totalCFOSScheduled || 0,
          online: data.totalCFOS || 0,
        },
        {
          name: 'SOTECH',
          scheduled: data.totalSOTECHScheduled || 0,
          online: data.totalSOTECH || 0,
        }
      ];

      setStats({
        ...data,
        userTypeDistribution,
        statusDistribution,
        statusDocsDistribution,
        monthlyStats: filteredMonthlyData,
        collegeComparison,
      });
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
    
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    fetchData(signal);
  
    return () => {
      controller.abort();
    };
  }, [fetchData]);
  
  

  // Memoize stat cards to prevent unnecessary recalculations
  const statCards = useMemo(() => [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: HiUsers,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-400"
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: HiAcademicCap,
      gradient: "bg-gradient-to-br from-cyan-500 to-teal-400"
    },
    {
      title: "HSU Employees",
      value: stats.totalEmployees,
      icon: HiOfficeBuilding,
      gradient: "bg-gradient-to-br from-teal-500 to-emerald-400"
    },
    {
      title: "Students Scheduled",
      value: stats.totalScheduled,
      icon: HiCalendar,
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-400",
      href: '/manageInPerson'
    },
    {
      title: "Reschedule Requests",
      value: stats.totalRescheduled,
      icon: HiRefresh,
      gradient: "bg-gradient-to-br from-purple-500 to-pink-400",
      href: '/reschedule'
    },
    {
      title: "Online PE Students",
      value: stats.totalOnline,
      icon: HiGlobeAlt,
      gradient: "bg-gradient-to-br from-pink-500 to-rose-400",
      href: '/manage-online'
    }
  ], [stats]);

  // Show loading state
  if (loading && !stats.totalUsers) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-blue-200 mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-lg">
          <h2 className="text-red-600 text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={fetchData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Statistics Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={fetchData} 
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-700"
          >
            <HiRefresh className="w-5 h-5" />
            <span>Refresh</span>
          </button>
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Live Updates
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Monthly Scheduled Users" className="lg:col-span-2">
          <p className="text-sm text-gray-500 mb-4">
            Track how many students are scheduled per month.
          </p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyStats}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="scheduled" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Scheduled Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        
        <ChartCard title="College Comparison - Scheduled vs Online">
          <p className="text-sm text-gray-500 mb-4">
            Track how many students opted for Online Submission and In Person Annual PE Examinations.
          </p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.collegeComparison}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scheduled" fill="#22c55e" name="Scheduled Students" />
                <Bar dataKey="online" fill="#3b82f6" name="Online Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Annual PE Status Distribution">
          <p className="text-sm text-gray-500 mb-4">
            Track how many students have completed their Annual PE.
          </p>
          <div className="flex flex-col items-center">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#22c55e', '#eab308', '#ef4444'][index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      padding: '10px'
                    }} 
                  />
                  <Legend align="center" verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Total Count Per Label */}
            <div className="mt-2 w-full flex justify-center space-x-2 text-sm font-medium text-gray-700">
              {stats.statusDistribution.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: ['#22c55e', '#eab308', '#ef4444'][index] }}
                  ></span>
                  <span>{entry.name}:</span>
                  <span className="font-semibold ml-1">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="User Distribution">
          <p className="text-sm text-gray-500 mb-4">
            View user distribution
          </p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.userTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.userTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Document Requests Distribution">
          <p className="text-sm text-gray-500 mb-4">
            View document requests distribution
          </p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusDocsDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusDocsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Stats;