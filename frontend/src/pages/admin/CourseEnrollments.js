import React, { useState,useRef, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faSearch,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faEllipsisV,
  faPlus,
  faEdit,
  faTrash,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const UserCourseEnrollments = () => {
 
const [editingEnrollment, setEditingEnrollment] = useState(null); // null means "create mode"

  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    productType: 'course',
    productId: '',
    amount: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({});

  const enrollmentsPerPage = 10;

  // Fetch data from backend
  useEffect(() => {
    fetchEnrollments();
    fetchUsers();
    fetchCourses();
    fetchEbooks();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/enrollments/admin/enrollments');
      if (!response.ok) throw new Error('Failed to fetch enrollments');
      const data = await response.json();
      setEnrollments(data);
      setFilteredEnrollments(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/enrollments/admin/enrollments/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/enrollments/admin/enrollments/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchEbooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/enrollments/admin/enrollments/ebooks');
      if (!response.ok) throw new Error('Failed to fetch ebooks');
      const data = await response.json();
      setEbooks(data);
    } catch (error) {
      console.error('Error fetching ebooks:', error);
    }
  };

  // Initialize filtered enrollments
  useEffect(() => {
    setFilteredEnrollments(enrollments);
  }, [enrollments]);

  // Search functionality
  useEffect(() => {
    const results = enrollments.filter(enrollment =>
      enrollment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEnrollments(results);
    setCurrentPage(1);
  }, [searchTerm, enrollments]);

// Manage dropdown visibility
const [showMenuId, setShowMenuId] = useState(null);
const menuRef = useRef();

useEffect(() => {
  function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenuId(null); // Close dropdown if clicked outside
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

const [currentEnrollmentss, setCurrentEnrollments] = useState([]);

  // Pagination logic
  const indexOfLastEnrollment = currentPage * enrollmentsPerPage;
  const indexOfFirstEnrollment = indexOfLastEnrollment - enrollmentsPerPage;
  const currentEnrollments = filteredEnrollments.slice(indexOfFirstEnrollment, indexOfLastEnrollment);
  const totalPages = Math.ceil(filteredEnrollments.length / enrollmentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-set amount when product is selected
    if (name === 'productId' && value) {
      let selectedProduct = null;
      if (formData.productType === 'course') {
        selectedProduct = courses.find(course => course.id === parseInt(value));
      } else {
        selectedProduct = ebooks.find(ebook => ebook.id === parseInt(value));
      }
      
      if (selectedProduct) {
        setFormData(prev => ({
          ...prev,
          amount: selectedProduct.price
        }));
      }
    }

    // Reset product selection when type changes
    if (name === 'productType') {
      setFormData(prev => ({
        ...prev,
        productId: '',
        amount: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.userId) errors.userId = 'User is required';
    if (!formData.productId) errors.productId = 'Product is required';
    if (!formData.amount || formData.amount <= 0) errors.amount = 'Valid amount is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = {};
  if (!formData.userId) errors.userId = 'User is required';
  if (!formData.productId) errors.productId = 'Product is required';
  if (!formData.amount) errors.amount = 'Amount is required';

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setSubmitStatus({ loading: true });

  try {
    const url = editingEnrollment
      ? `http://localhost:5000/api/enrollments/admin/enrollments/${editingEnrollment.id}`
      : 'http://localhost:5000/api/enrollments/admin/enrollments';

    const method = editingEnrollment ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    setSubmitStatus({ success: true, message: editingEnrollment ? 'Enrollment updated.' : 'Enrollment created.' });

    // Refresh or update the enrollment list (your logic here)
    setTimeout(() => {
      setShowModal(false);
      setEditingEnrollment(null);
      window.location.reload(); // or re-fetch enrollments
    }, 1500);

  } catch (error) {
    console.error(error);
    setSubmitStatus({ success: false, message: error.message });
  }
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
              <FontAwesomeIcon icon={faUserGraduate} className="mr-2 text-indigo-600" />
              User Course Enrollments
            </h1>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Enroll User
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by user name, email or course title..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Enrollments Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading enrollments...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentEnrollments.length > 0 ? (
                        currentEnrollments.map((enrollment) => (
                          <tr key={enrollment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                  {enrollment.userName.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{enrollment.userName}</div>
                                  <div className="text-sm text-gray-500">{enrollment.userEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{enrollment.courseTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                enrollment.productType === 'course' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {enrollment.productType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">{enrollment.enrollmentDate}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium">{enrollment.amount}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500 font-mono">{enrollment.paymentId}</span>
                            </td>
                            <td className="relative px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-indigo-600 hover:text-indigo-900 p-2"
                                onClick={() =>
                                  setShowMenuId(prev => (prev === enrollment.id ? null : enrollment.id))
                                }
                              >
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </button>

                              {showMenuId === enrollment.id && (
                                <div
                                  ref={menuRef}
                                  className="absolute right-6 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10"
                                >
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      setEditingEnrollment(enrollment); // Save the record being edited
                                      setFormData({
                                        userId: enrollment.userId,
                                        productType: enrollment.productType,
                                        productId: enrollment.courseId,
                                        amount: parseFloat(enrollment.amount.replace(/[^\d.]/g, '')), // remove ₹
                                      });
                                      setFormErrors({});
                                      setSubmitStatus({});
                                      setShowModal(true); // Open modal
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                    Edit
                                  </button>

                                  
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    onClick={async () => {
                                      
                                      const confirmDelete = window.confirm(`Are you sure you want to delete enrollment for ${enrollment.userName}?`);
                                      if (!confirmDelete) return;

                                      try {
                                        const response = await fetch(`http://localhost:5000/api/enrollments/admin/enrollments/${enrollment.id}`, {
                                          method: 'DELETE',
                                        });

                                        if (!response.ok) {
                                          const errorData = await response.json();
                                          alert(`Failed to delete: ${errorData.message}`);
                                          return;
                                        }

                                        alert('Enrollment deleted successfully.');
                                        window.location.reload(); // Reloads the page after user clicks "OK"


                                        // Optionally remove the record from UI without refreshing
                                        setCurrentEnrollments(prev =>
                                          prev.filter(item => item.id !== enrollment.id)
                                        );

                                        // Close dropdown menu after delete
                                        setShowMenuId(null);
                                      } catch (err) {
                                        console.error('Delete error:', err);
                                        alert('An error occurred while deleting the enrollment.');
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                            No enrollments found matching your criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstEnrollment + 1}</span> to{' '}
                          <span className="font-medium">
                            {indexOfLastEnrollment > filteredEnrollments.length ? filteredEnrollments.length : indexOfLastEnrollment}
                          </span> of{' '}
                          <span className="font-medium">{filteredEnrollments.length}</span> results
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

        {/* Enrollment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-xl font-semibold text-gray-800">Enroll User</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {submitStatus.message && (
                <div className={`mt-4 p-3 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {formErrors.userId && <p className="mt-1 text-sm text-red-600">{formErrors.userId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Type</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="course">Course</option>
                    <option value="ebook">Ebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.productType === 'course' ? 'Course' : 'Ebook'}
                  </label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select {formData.productType === 'course' ? 'Course' : 'Ebook'}</option>
                    {(formData.productType === 'course' ? courses : ebooks).map(item => (
                      <option key={item.id} value={item.id}>
                        {item.title} (₹{item.price})
                      </option>
                    ))}
                  </select>
                  {formErrors.productId && <p className="mt-1 text-sm text-red-600">{formErrors.productId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formErrors.amount && <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>}
                </div>

                <div className="flex justify-end pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitStatus.loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitStatus.loading ? 'Enrolling...' : 'Enroll User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default UserCourseEnrollments;