import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Line, Bar } from 'react-chartjs-2';

// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faBook,
  faGraduationCap,
  faMoneyBillWave,
  faChartLine,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    purchasedCourses: 0,
    purchasedEbooks: 0,
    totalIncome: 0,
  });
  const [monthlyData, setMonthlyData] = useState({
    users: [],
    courses: [],
    ebooks: [],
    income: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonthRange, setSelectedMonthRange] = useState(6); // Default to 6 months
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonthRange]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/dashboard?months=${selectedMonthRange}`
      );
      const data = await response.json();

      if (response.ok) {
        setStats({
          totalUsers: data.stats.totalUsers || 0,
          purchasedCourses: data.stats.purchasedCourses || 0,
          purchasedEbooks: data.stats.purchasedEbooks || 0,
          totalIncome: data.stats.totalIncome || 0,
        });

        setMonthlyData({
          users: data.monthlyData.users || [],
          courses: data.monthlyData.courses || [],
          ebooks: data.monthlyData.ebooks || [],
          income: data.monthlyData.income || [],
        });
      } else {
        showToast('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  // Generate labels based on selected month range
  const generateLabels = () => {
    const currentDate = new Date();
    const labels = [];

    for (let i = selectedMonthRange - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      labels.push(monthNames[date.getMonth()] + ' ' + date.getFullYear());
    }

    return labels;
  };

  const labels = generateLabels();

  // Chart data configurations
  const userChartData = {
    labels,
    datasets: [
      {
        label: 'Total Users',
        data: monthlyData.users,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const coursesChartData = {
    labels,
    datasets: [
      {
        label: 'Purchased Courses',
        data: monthlyData.courses,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ebooksChartData = {
    labels,
    datasets: [
      {
        label: 'Purchased E-books',
        data: monthlyData.ebooks,
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      },
    ],
  };

  const incomeChartData = {
    labels,
    datasets: [
      {
        label: 'Total Income (₹)',
        data: monthlyData.income,
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />

        {/* Toast Notification */}
        {toastVisible && (
          <div className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300">
            {toastMessage}
          </div>
        )}

        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Admin Dashboard</h1>

            <div className="flex items-center space-x-4">
              <select
                value={selectedMonthRange}
                onChange={(e) => setSelectedMonthRange(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={3}>Last 3 Months</option>
                <option value={6}>Last 6 Months</option>
                <option value={12}>Last 12 Months</option>
              </select>

              <button
                onClick={fetchDashboardData}
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faRefresh} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  icon={faUsers}
                  title="Total Users"
                  value={stats.totalUsers.toLocaleString()}
                  color="indigo"
                />
                <StatCard
                  icon={faGraduationCap}
                  title="Purchased Courses"
                  value={stats.purchasedCourses.toLocaleString()}
                  color="green"
                />
                <StatCard
                  icon={faBook}
                  title="Purchased E-books"
                  value={stats.purchasedEbooks.toLocaleString()}
                  color="yellow"
                />
                <StatCard
                  icon={faMoneyBillWave}
                  title="Total Income"
                  value={`₹${stats.totalIncome.toLocaleString()}`}
                  color="purple"
                />
              </>
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Users Chart */}
            {isLoading ? (
              <ChartSectionSkeleton title="User Growth" />
            ) : (
              <ChartSection title="User Growth" icon={faChartLine}>
                <Line data={userChartData} options={chartOptions} />
              </ChartSection>
            )}

            {/* Courses Chart */}
            {isLoading ? (
              <ChartSectionSkeleton title="Courses Purchased" />
            ) : (
              <ChartSection title="Courses Purchased" icon={faChartLine}>
                <Bar data={coursesChartData} options={chartOptions} />
              </ChartSection>
            )}

            {/* E-books Chart */}
            {isLoading ? (
              <ChartSectionSkeleton title="E-books Purchased" />
            ) : (
              <ChartSection title="E-books Purchased" icon={faChartLine}>
                <Bar data={ebooksChartData} options={chartOptions} />
              </ChartSection>
            )}

            {/* Income Chart */}
            {isLoading ? (
              <ChartSectionSkeleton title="Income Overview" />
            ) : (
              <ChartSection title="Income Overview" icon={faChartLine}>
                <Bar data={incomeChartData} options={chartOptions} />
              </ChartSection>
            )}
          </div>
        </main>

        <FooterAdmin />
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center transition-transform hover:scale-105 duration-200">
      <div className={`p-4 rounded-full ${colorClasses[color]} mr-4`}>
                <FontAwesomeIcon icon={icon} size="lg" />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

// StatCard Skeleton Component
const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center animate-pulse">
    <div className="p-4 rounded-full bg-gray-200 mr-4">
      <div className="w-6 h-6"></div>
    </div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// ChartSection Component
const ChartSection = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      <FontAwesomeIcon icon={icon} className="text-indigo-600 mr-2" />
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="h-80">{children}</div>
  </div>
);

// ChartSection Skeleton Component
const ChartSectionSkeleton = ({ title }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
  </div>
);

export default AdminDashboard;