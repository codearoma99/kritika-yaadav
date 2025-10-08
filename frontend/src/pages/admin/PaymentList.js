import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faSearch,
  faCalendarAlt,
  faUser,
  faBook,
  faMoneyBillWave,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faReceipt,
  faChevronLeft,
  faChevronRight,
  faFilter,
  faEllipsisV,
  faDownload,
  faRupeeSign,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    byType: []
  });
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const paymentsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/payment/admin/payments');
        
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        
        const data = await response.json();
        setPayments(data);
        setFilteredPayments(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/payment/admin/payments/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch payment statistics');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchPayments();
    fetchStats();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    let results = payments.filter(payment =>
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'All') {
      results = results.filter(payment => payment.status === statusFilter);
    }

    if (typeFilter !== 'All') {
      results = results.filter(payment => payment.productType === typeFilter);
    }

    setFilteredPayments(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, typeFilter, payments]);

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = '';
    let icon = null;
    
    switch(status) {
      case 'Completed':
        badgeClass = 'bg-green-100 text-green-800';
        icon = faCheckCircle;
        break;
      case 'Pending':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        icon = faSpinner;
        break;
      case 'Failed':
        badgeClass = 'bg-red-100 text-red-800';
        icon = faTimesCircle;
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800';
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${badgeClass}`}>
        <FontAwesomeIcon icon={icon} className="mr-1" />
        {status}
      </span>
    );
  };

  // Export to CSV function
  const exportToCSV = () => {
    const headers = ['Payment ID', 'User', 'Email', 'Product', 'Amount', 'Date', 'Transaction ID', 'Status'];
    const csvData = filteredPayments.map(payment => [
      payment.id,
      payment.userName,
      payment.userEmail,
      payment.courseName,
      payment.amount,
      payment.paymentDate,
      payment.transactionId,
      payment.status
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />

        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-indigo-600" />
              Payment Transactions
            </h1>
            <button 
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Export CSV
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="rounded-full bg-indigo-100 p-3 mr-4">
                  <FontAwesomeIcon icon={faCreditCard} className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Payments</p>
                  <p className="text-2xl font-bold">{stats.totalPayments}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <FontAwesomeIcon icon={faRupeeSign} className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <FontAwesomeIcon icon={faUser} className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <FontAwesomeIcon icon={faChartLine} className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Order Value</p>
                  <p className="text-2xl font-bold">₹{stats.totalPayments ? (stats.totalRevenue / stats.totalPayments).toFixed(2) : '0.00'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by user, product, or transaction ID..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-400 mr-2" />
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faBook} className="text-gray-400 mr-2" />
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="course">Courses</option>
                    <option value="ebook">Ebooks</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table with Horizontal Scroll */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading payments...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 text-lg mb-2">Error Loading Payments</div>
                <p className="text-gray-600">{error}</p>
                <button 
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentPayments.length > 0 ? (
                            currentPayments.map((payment) => (
                              <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-indigo-600">{payment.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                      {payment.userName.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                                      <div className="text-sm text-gray-500">{payment.userEmail}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{payment.courseName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.productType === 'course' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                    {payment.productType === 'course' ? 'Course' : 'Ebook'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 mr-2" />
                                    <span className="text-sm font-medium">{payment.amount}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-500">{payment.paymentDate}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-mono text-gray-500">{payment.transactionId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <StatusBadge status={payment.status} />
                                </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                <a
                                  href={`http://localhost:5000/uploads/invoices/invoice_${payment.transactionId}.pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                  <FontAwesomeIcon icon={faReceipt} className="mr-1" />
                                  <span>{payment.invoice}</span>
                                </a>
                              </td>

                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                No payments found matching your criteria
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstPayment + 1}</span> to{' '}
                          <span className="font-medium">
                            {indexOfLastPayment > filteredPayments.length ? filteredPayments.length : indexOfLastPayment}
                          </span> of{' '}
                          <span className="font-medium">{filteredPayments.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                          >
                            <span className="sr-only">Previous</span>
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </button>
                          
                          {pageNumbers.map(number => (
                            <button
                              key={number}
                              onClick={() => paginate(number)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === number
                                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {number}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                          >
                            <span className="sr-only">Next</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <FooterAdmin />
      </div>
    </div>
  );
};

export default PaymentList;