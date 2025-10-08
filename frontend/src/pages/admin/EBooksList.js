import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import {
  faBookOpen,
  faSearch,
  faEdit,
  faTrash,
  faPlus,
  faDownload,
  faShoppingCart,
  faChevronLeft,
  faChevronRight,
  faStar,
  faFire,
  faBolt,
  faRocket
} from '@fortawesome/free-solid-svg-icons';

const EbooksList = () => {
  const [ebooks, setEbooks] = useState([]);
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ebooksPerPage = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch ebooks from API on mount
  useEffect(() => {
    const fetchEbooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace this URL with your real API endpoint
        const response = await fetch('http://localhost:5000/api/ebooks');
        if (!response.ok) {
          throw new Error('Failed to fetch ebooks');
        }
        const data = await response.json();

        setEbooks(data);
        setFilteredEbooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  useEffect(() => {
    const results = ebooks.filter(ebook => {
      const title = ebook.title || '';
      const category = ebook.category || '';
      const description = ebook.description || '';

      const search = searchTerm.toLowerCase();

      return (
        title.toLowerCase().includes(search) ||
        category.toLowerCase().includes(search) ||
        description.toLowerCase().includes(search)
      );
    });

    setFilteredEbooks(results);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, ebooks]);


  // Pagination logic
  const indexOfLastEbook = currentPage * ebooksPerPage;
  const indexOfFirstEbook = indexOfLastEbook - ebooksPerPage;
  const currentEbooks = filteredEbooks.slice(indexOfFirstEbook, indexOfLastEbook);
  const totalPages = Math.ceil(filteredEbooks.length / ebooksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ebook actions
  const editEbook = (ebookId) => {
    console.log('Edit ebook:', ebookId);
    // Implement edit functionality
  };

  // Delete ebook
  const deleteEbook = async (ebookId) => {
  if (!window.confirm('Are you sure you want to delete this ebook?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/ebooks/${ebookId}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (res.ok) {
        alert('Ebook deleted successfully');
        setEbooks(prev => prev.filter(ebook => ebook.id !== ebookId));
      } else {
        alert(`Delete failed: ${result.message}`);
      }
    } catch (err) {
      console.error('Error deleting ebook:', err);
      alert('Server error during deletion');
    }
  };


  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Popular': return faFire;
      case 'Bestseller': return faStar;
      case 'New': return faRocket;
      default: return faBolt;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
          <main className="flex-grow p-6 bg-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faBookOpen} className="mr-2 text-indigo-600" />
                E-books Management
              </h1>
              <a href="/admin/ebooks/create-ebook">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add New E-book
              </button>
              </a>
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
                    placeholder="Search ebooks by title, category or description..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading ebooks...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">
                  <p>Error: {error}</p>
                </div>
              ) : filteredEbooks.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
                    {currentEbooks.map((ebook) => {
                      const isFree = ebook.price === "0.00" || ebook.price === 0 || ebook.price === "₹0.00";
                      return (
                        <div
                          key={ebook.id}
                          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 flex flex-col overflow-hidden"
                        >
                          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 h-48 flex items-center justify-center p-4">
                            <img
                              src={ebook.thumbnail ? `http://localhost:5000/uploads/thumbnails/${ebook.thumbnail}` : ''}
                              alt={ebook.title}
                              className="h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <h3 className="text-md font-semibold text-gray-800 mb-1">{ebook.title}</h3>
                              <p className="text-sm text-indigo-600 mb-1">{ebook.category}</p>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{ebook.description}</p>
                            </div>

                            <div className="mt-auto">
                              <div className="flex items-center justify-between text-sm font-medium mb-4">
                                <span className={isFree ? "text-green-600 text-md" : "text-indigo-600 text-md"}>
                                  {isFree ? "Free" : `₹ ${ebook.price}`}
                                </span>
                              </div>

                              <div className="flex items-center justify-between space-x-2">
                                <a
                                  href={`http://localhost:5000/uploads/${ebook.ebook}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex-1 py-2 px-4 rounded-md text-center font-medium transition ${
                                    isFree
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                  }`}
                                >
                                  <FontAwesomeIcon
                                    icon={isFree ? faDownload : faShoppingCart}
                                    className="mr-2"
                                  />
                                  {isFree ? "Download" : "Purchase"}
                                </a>

                                <div className="flex items-center space-x-2">
                                  <Link
                                    to={`/admin/ebooks/edit-ebook/${ebook.id}`}
                                    className="text-indigo-600 hover:text-indigo-800"
                                    title="Edit"
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Link>
                                  <button
                                    onClick={() => deleteEbook(ebook.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {filteredEbooks.length > ebooksPerPage && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstEbook + 1}</span> to{' '}
                            <span className="font-medium">
                              {indexOfLastEbook > filteredEbooks.length ? filteredEbooks.length : indexOfLastEbook}
                            </span>{' '}
                            of <span className="font-medium">{filteredEbooks.length}</span> ebooks
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Previous</span>
                              <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No ebooks found matching your criteria</p>
                  <a href='/admin/ebooks/create-ebook'>
                  <div className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center mx-auto">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add New E-book
                  </div>
                  </a>
                </div>
              )}
            </div>
          </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default EbooksList;