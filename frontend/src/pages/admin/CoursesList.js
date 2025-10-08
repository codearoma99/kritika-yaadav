import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
  faBook,
  faSearch,
  faEdit,
  faTrash,
  faPlus,
  faToggleOn,
  faToggleOff,
  faChevronLeft,
  faChevronRight,
  faStar,
  faUsers,
  faMoneyBillWave,
  faCrown,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const coursesPerPage = 8;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        // Add default values for missing properties in API response
        const coursesWithDefaults = response.data.map(course => ({
          ...course,
          category: course.category || 'Uncategorized',
          instructor: course.instructor || 'Unknown Instructor',
          description: course.short_description || 'No description available',
          status: course.status || 'Draft',
          rating: course.rating || 0,
          students: course.students || 0,
          featured: course.featured || false,
          image: course.thumbnail
        }));
        setCourses(coursesWithDefaults);
        setFilteredCourses(coursesWithDefaults);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter functionality
  useEffect(() => {
    let results = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply category filter
    if (selectedCategory) {
      results = results.filter(course => 
        course.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply status filter
    if (selectedStatus) {
      results = results.filter(course => 
        course.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredCourses(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, courses, selectedCategory, selectedStatus]);

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Course actions
  const editCourse = (courseId) => {
    console.log('Edit course:', courseId);
    // Implement edit functionality - navigate to edit page
  };

  const deleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/courses/${courseId}`);
        setCourses(courses.filter(course => course.id !== courseId));
        alert('Course deleted successfully');
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Failed to delete course');
      }
    }
  };

  const toggleStatus = async (courseId) => {
    try {
      const course = courses.find(c => c.id === courseId);
      const newStatus = course.status === 'Published' ? 'Draft' : 'Published';
      
      await axios.patch(`http://localhost:5000/api/courses/${courseId}`, {
        status: newStatus
      });
      
      setCourses(courses.map(course =>
        course.id === courseId ? { ...course, status: newStatus } : course
      ));
    } catch (err) {
      console.error('Error updating course status:', err);
      alert('Failed to update course status');
    }
  };

  const toggleFeatured = async (courseId) => {
    try {
      const course = courses.find(c => c.id === courseId);
      const newFeaturedStatus = !course.featured;
      
      await axios.patch(`http://localhost:5000/api/courses/${courseId}`, {
        featured: newFeaturedStatus
      });
      
      setCourses(courses.map(course =>
        course.id === courseId ? { ...course, featured: newFeaturedStatus } : course
      ));
    } catch (err) {
      console.error('Error updating featured status:', err);
      alert('Failed to update featured status');
    }
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(courses.map(course => course.category))];

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
                <FontAwesomeIcon icon={faBook} className="mr-2 text-indigo-600" />
                Courses Management
              </h1>
              
              <Link 
                to="/admin/courses/create-course" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add New Course
              </Link>
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
                    placeholder="Search courses by title, category or instructor..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading courses...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {filteredCourses.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                        {currentCourses.map((course) => (
                          <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
                            {course.featured && (
                              <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                                <FontAwesomeIcon icon={faCrown} className="mr-1" />
                                Featured
                              </div>
                            )}
                            <div className="relative">
                              <img 
                                src={`http://localhost:5000/uploads/thumbnails/${course.thumbnail}`} 
                                alt={course.title} 
                                className="w-full h-40 object-cover"
                              
                              />
                              
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg mb-1 text-gray-800 truncate">{course.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                              
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-1" />
                                  <span className="text-sm">{course.timing}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{course.level}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center mb-2">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                                <span className="text-sm font-medium">{course.rating}</span>
                                <span className="mx-2 text-gray-300">|</span>
                                <FontAwesomeIcon icon={faUsers} className="text-gray-400 mr-1" />
                                <span className="text-sm">{course.students.toLocaleString()} students</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 mr-1" />
                                  <span className="font-bold">₹{course.price}</span>
                                </div>
                                <div className="flex space-x-2">
                                  <Link 
                                  to={`/admin/courses/edit-course/${course.id}`} 
                                  className="text-indigo-600 hover:text-indigo-900 p-1" 
                                  title="Edit"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Link>

                                  {/*<button
                                    onClick={() => toggleFeatured(course.id)}
                                    className={course.featured ? 'text-yellow-600 hover:text-yellow-900 p-1' : 'text-gray-600 hover:text-gray-900 p-1'}
                                    title={course.featured ? 'Remove featured' : 'Make featured'}
                                  >
                                    <FontAwesomeIcon icon={faCrown} />
                                  </button>
                                  <button
                                    onClick={() => toggleStatus(course.id)}
                                    className={course.status === 'Published' ? 'text-green-600 hover:text-green-900 p-1' : 'text-gray-600 hover:text-gray-900 p-1'}
                                    title={course.status === 'Published' ? 'Unpublish' : 'Publish'}
                                  >
                                    {course.status === 'Published' ? (
                                      <FontAwesomeIcon icon={faToggleOn} />
                                    ) : (
                                      <FontAwesomeIcon icon={faToggleOff} />
                                    )}
                                  </button> */}
                                  <button
                                    onClick={() => deleteCourse(course.id)}
                                    className="text-red-600 hover:text-red-900 p-1"
                                    title="Delete"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center py-4 border-t border-gray-200">
                          <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 mr-2"
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => paginate(page)}
                              className={`px-3 py-1 mx-1 rounded-md ${
                                currentPage === page 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 ml-2"
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-600">No courses found matching your criteria</p>
                      <Link 
                        to="/admin/courses/create-course" 
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center justify-center w-48 mx-auto"
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add New Course
                      </Link>
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

export default CoursesList;