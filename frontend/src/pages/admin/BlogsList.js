import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

const confirmDelete = async () => {
  setIsDeleting(true);
  try {
    const res = await fetch(`http://localhost:5000/api/blogs/${deleteId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      // ✅ Use functional update to ensure fresh state
    //   setBlogs(prevBlogs => pre vBlogs.filter(blog => blog.id !== deleteId));
      window.location.reload();
    }
  } catch (err) {
    console.error('Delete failed:', err);
  } finally {
    setIsDeleting(false);
    setShowModal(false);
    setDeleteId(null);
  }
};


  const handleEdit = (id) => {
    navigate(`/admin/edit-blog/${id}`);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Blogs Management</h1>
            <Link
              to="/admin/create-blogs"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Add New Blog
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded shadow p-4">
                <img
                  src={`http://localhost:5000/uploads/${blog.image}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded"
                />
                <h2 className="text-lg font-semibold mt-4">{blog.title}</h2>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(blog.id)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(blog.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
        <FooterAdmin />
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30"
        style={{ backdropFilter: 'blur(1px)', zIndex: 1000000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Blog</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this blog?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${
                  isDeleting && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsList;