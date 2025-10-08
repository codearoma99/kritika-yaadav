import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HistoryPage = () => {
  const API_BASE_URL = "http://localhost:5000";
  const [activeTab, setActiveTab] = useState('course-history');
  const [courseHistory, setCourseHistory] = useState([]);
  const [ebooksHistory, setEbooksHistory] = useState([]);
  const [packageHistory, setPackageHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user ID from localStorage
  const getUserID = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id || user.userId || user._id;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  };

  // Fetch user purchases from backend
// Fetch user purchases from backend
const fetchUserPurchases = async () => {
  const userId = getUserID();
  if (!userId) {
    setError('User not logged in');
    setLoading(false);
    return;
  }

  try {
    setLoading(true);

    // 1. Fetch course + ebook purchases
    const response = await fetch(`${API_BASE_URL}/api/payment/purchases/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch purchases: ${response.statusText}`);
    }

    const purchases = await response.json();

    const courses = purchases.filter(p => p.product_type === 'course');
    const ebooks = purchases.filter(p => p.product_type === 'ebook');

    setCourseHistory(courses);
    setEbooksHistory(ebooks);

    // 2. Fetch package purchases separately
    const pkgResponse = await fetch(`${API_BASE_URL}/api/payment/packages/purchases/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!pkgResponse.ok) {
      throw new Error(`Failed to fetch package purchases: ${pkgResponse.statusText}`);
    }

    const packagePurchases = await pkgResponse.json();
    setPackageHistory(packagePurchases);

    // 3. Build unified payment history (courses + ebooks + packages)
    const payments = [
      ...purchases.map(p => ({
        id: p.id,
        date: p.purchase_date || p.created_at,
        amount: `₹${p.product_amount}`,
        method: 'Online Payment',
        status: p.status || 'Completed',
        invoice: `#INV-${p.payment_id?.slice(0, 8) || p.id}`,
        invoiceLink: `/uploads/invoices/invoice_${p.payment_id || p.id}.pdf`,
        productType: p.product_type,
        productName: p.title || `Product ${p.course_id}`
      })),
      ...packagePurchases.map(pkg => ({
        id: pkg.id,
        date: pkg.purchase_date || pkg.created_at,
        amount: `₹${pkg.amount}`,
        method: 'Online Payment',
        status: 'Completed',
        invoice: `#INV-${pkg.transaction_id?.slice(0, 8) || pkg.id}`,
        invoiceLink: `/uploads/invoices/invoice_${pkg.transaction_id || pkg.id}.pdf`,
        productType: 'package',
        productName: `Package ${pkg.package_id}`
      }))
    ];

    setPaymentHistory(payments);
    setError(null);

  } catch (err) {
    console.error('Error fetching purchases:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  // Sync tab with URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['course-history', 'ebooks-history', 'package-history', 'payment-history'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location]);

  // Fetch data on component mount
  useEffect(() => {
    fetchUserPurchases();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to get thumbnail URL
  const getThumbnailUrl = (item) => {
    if (item.thumbnail) {
      // Check if thumbnail is a full URL or a relative path
      if (item.thumbnail.startsWith('http')) {
        return item.thumbnail;
      } else {
        return `${API_BASE_URL}/uploads/thumbnails/${item.thumbnail}`;
      }
    }
    // Default images based on product type
    if (item.product_type === 'package') {
      return '/assets/img/packages/default-package.jpg';
    }
    return '/assets/img/courses/default-course.jpg';
  };

  // Function to get product link based on type
  const getProductLink = (item) => {
    switch (item.product_type) {
      case 'course':
        return `/course-detail?id=${item.course_id}`;
      case 'ebook':
        return `/ebook-detail?id=${item.course_id}`;
      case 'package':
        return `/package-detail?id=${item.package_id}`;
      default:
        return '#';
    }
  };

  // Function to get product type label
  const getProductTypeLabel = (item) => {
    switch (item.product_type) {
      case 'course':
        return 'Course';
      case 'ebook':
        return 'E-book';
      case 'package':
        return 'Package';
      default:
        return 'Product';
    }
  };

  return (
    <>
      <Header />
      <div
        className="bg-center bg-no-repeat bg-cover py-20"
        style={{ backgroundImage: "url('assets/img/all-images/posters/br8.png')" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="text-center w-full">
              <h2 className="text-4xl md:text-5xl font-bold text-white">History</h2>
              <div className="my-6"></div>
              <a
                href="/"
                className="text-lg inline-flex items-center gap-2 text-white"
              >
                Home <i className="fa-solid fa-angle-right"></i> <span>History</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => handleTabChange('course-history')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'course-history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Purchased Courses
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {courseHistory.length}
                </span>
              </button>
              <button
                onClick={() => handleTabChange('ebooks-history')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ebooks-history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Purchased E-books
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {ebooksHistory.length}
                </span>
              </button>
              <button
                onClick={() => handleTabChange('package-history')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'package-history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Purchased Packages
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {packageHistory.length}
                </span>
              </button>
              <button
                onClick={() => handleTabChange('payment-history')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment-history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Payment History
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {paymentHistory.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Course History Tab */}
            {activeTab === 'course-history' && (
              <div id="course-history" className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading courses...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600">
                    <p>Error: {error}</p>
                    <button 
                      onClick={fetchUserPurchases}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : courseHistory.length > 0 ? (
                  <div className="space-y-6">
                    {courseHistory.map((course) => (
                      <div key={course.id} className="flex flex-col sm:flex-row border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="sm:w-1/4">
                          <img
                            src={getThumbnailUrl(course)}
                            alt={course.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/img/courses/default-course.jpg';
                            }}
                          />
                        </div>
                        <div className="sm:w-3/4 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{course.title || `Course ${course.course_id}`}</h3>
                              <p className="text-sm text-gray-500 mt-1">{course.short_description || 'No description available.'}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Purchased on: {new Date(course.purchase_date || course.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${course.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {course.status || 'Completed'}
                            </span>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">₹{course.product_amount}</span>
                            <Link to={getProductLink(course)}>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
                                Continue Learning
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No courses purchased yet</h3>
                    <p className="mt-1 text-gray-500">Explore our courses to get started with your learning journey.</p>
                    <div className="mt-6">
                      <a 
                        href="/courses" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Browse Courses
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* E-books History Tab */}
            {activeTab === 'ebooks-history' && (
              <div id="ebooks-history" className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My E-books</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading e-books...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600">
                    <p>Error: {error}</p>
                    <button 
                      onClick={fetchUserPurchases}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : ebooksHistory.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ebooksHistory.map((ebook) => (
                      <div key={ebook.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          <img
                            src={getThumbnailUrl(ebook)}
                            alt={ebook.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/img/courses/default-course.jpg';
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg book-title text-gray-800 mb-2">{ebook.title || `E-book ${ebook.course_id}`}</h3>
                          <p className="text-sm text-gray-600 mb-3">{ebook.description || 'No description available.'}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Purchased on: {new Date(ebook.purchase_date || ebook.created_at).toLocaleDateString()}
                          </p>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">₹{ebook.product_amount}</span>
                            {/* <Link to={getProductLink(ebook)}>
                              <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                                View Details
                              </button>
                            </Link> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No e-books purchased yet</h3>
                    <p className="mt-1 text-gray-500">Check out our e-books library for valuable resources.</p>
                    <div className="mt-6">
                      <a 
                        href="/ebooks" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Browse E-books
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Package History Tab */}
            {activeTab === 'package-history' && (
              <div id="package-history" className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Packages</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading packages...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600">
                    <p>Error: {error}</p>
                    <button 
                      onClick={fetchUserPurchases}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : packageHistory.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packageHistory.map((pkg) => (
  <div key={pkg.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.title || `Package ${pkg.package_id}`}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {pkg.description || pkg.info_single_line || 'Comprehensive learning package with multiple resources.'}
      </p>
      <div className="space-y-2 mb-3">
        <p className="text-sm text-gray-500">
          <strong>Purchased:</strong> {new Date(pkg.created_at || Date.now()).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Transaction ID:</strong> {pkg.transaction_id || 'N/A'}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-900">₹{pkg.amount || pkg.price}</span>
        {/* If you have status, else hide */}
      </div>
      <div className="mt-4">
        <Link to={`/package-details/${pkg.package_id}`}>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
            View Package Details
          </button>
        </Link>
      </div>
    </div>
  </div>
))}

                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No packages purchased yet</h3>
                    <p className="mt-1 text-gray-500">Discover our premium packages for comprehensive learning experiences.</p>
                    <div className="mt-6">
                      <a 
                        href="/packages" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Browse Packages
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'payment-history' && (
              <div id="payment-history" className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading payment history...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600">
                    <p>Error: {error}</p>
                    <button 
                      onClick={fetchUserPurchases}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : paymentHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Method
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invoice
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(payment.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                              {payment.productType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payment.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.method}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.invoice}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <a
                                href={`${API_BASE_URL}${payment.invoiceLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Invoice
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No payment history yet</h3>
                    <p className="mt-1 text-gray-500">Your payment records will appear here after purchases.</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default HistoryPage;