import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import api from '../../utils/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Revenue Chart
export const RevenueChart = ({ period = 'monthly' }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/analytics/revenue?period=${period}`);
        
        // Format data for chart
        const labels = response.data.map(item => item.label);
        const revenueData = response.data.map(item => item.revenue);
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Revenue',
              data: revenueData,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              tension: 0.3,
            },
          ],
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('Failed to load revenue data');
        setLoading(false);
      }
    };
    
    fetchRevenueData();
  }, [period]);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${period.charAt(0).toUpperCase() + period.slice(1)} Revenue`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md animate-pulse h-64">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line options={options} data={chartData} />
    </div>
  );
};

// Bookings Chart
export const BookingsChart = ({ period = 'monthly' }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/analytics/bookings?period=${period}`);
        
        // Format data for chart
        const labels = response.data.map(item => item.label);
        const bookingsData = response.data.map(item => item.count);
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Bookings',
              data: bookingsData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
            },
          ],
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings data:', err);
        setError('Failed to load bookings data');
        setLoading(false);
      }
    };
    
    fetchBookingsData();
  }, [period]);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${period.charAt(0).toUpperCase() + period.slice(1)} Bookings`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md animate-pulse h-64">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Bar options={options} data={chartData} />
    </div>
  );
};

// Popular Destinations Chart
export const PopularDestinationsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinationsData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/analytics/popular-destinations');
        
        // Format data for chart
        const labels = response.data.map(item => item.name);
        const bookingsData = response.data.map(item => item.bookings);
        
        // Generate colors
        const backgroundColors = labels.map((_, i) => {
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          return `rgba(${r}, ${g}, ${b}, 0.6)`;
        });
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Bookings',
              data: bookingsData,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
              borderWidth: 1,
            },
          ],
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destinations data:', err);
        setError('Failed to load destinations data');
        setLoading(false);
      }
    };
    
    fetchDestinationsData();
  }, []);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Popular Destinations',
      },
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md animate-pulse h-64">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Pie options={options} data={chartData} />
    </div>
  );
};

// User Statistics Chart
export const UserStatisticsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/analytics/users');
        
        // Format data for chart
        const data = [
          response.data.regularUsers,
          response.data.tourGuides,
          response.data.pendingTourGuides,
          response.data.admins
        ];
        
        setChartData({
          labels: ['Regular Users', 'Tour Guides', 'Pending Tour Guides', 'Admins'],
          datasets: [
            {
              label: 'User Count',
              data,
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user statistics');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'User Statistics',
      },
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md animate-pulse h-64">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Doughnut options={options} data={chartData} />
    </div>
  );
};

// Dashboard Stats Component
export const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/analytics/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard statistics');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <p className="text-sm text-gray-600">Total Users</p>
        <p className="text-2xl font-bold">{stats.totalUsers}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <p className="text-sm text-gray-600">Total Bookings</p>
        <p className="text-2xl font-bold">{stats.totalBookings}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <p className="text-sm text-gray-600">Total Revenue</p>
        <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <p className="text-sm text-gray-600">Pending Approvals</p>
        <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
      </div>
    </div>
  );
};

export default {
  RevenueChart,
  BookingsChart,
  PopularDestinationsChart,
  UserStatisticsChart,
  DashboardStats
};
