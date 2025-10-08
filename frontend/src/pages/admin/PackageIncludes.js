import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link, useParams, useNavigate } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import { FaTrash } from 'react-icons/fa';

const PackageIncludes = () => {
  const { id: package_id } = useParams(); // Get `id` from URL
  const [packageTitle, setPackageTitle] = useState('');
  const [includesList, setIncludesList] = useState([{ title: '', includes: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
const navigate = useNavigate();
  // Fetch package title
  useEffect(() => {
    if (!package_id) return;

    const fetchPackageTitle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/packages/${package_id}`);
        const data = await res.json();
        if (res.ok) {
          setPackageTitle(data.title);
        } else {
          setPackageTitle('Package Not Found');
        }
      } catch (err) {
        console.error(err);
        setPackageTitle('Error loading package');
      }
    };

    fetchPackageTitle();
  }, [package_id]);

  const handleChange = (index, field, value) => {
    const updated = [...includesList];
    updated[index][field] = value;
    setIncludesList(updated);
  };

  const handleAddMore = () => {
    setIncludesList([...includesList, { title: '', includes: '' }]);
  };

  const handleRemove = (index) => {
    const updated = [...includesList];
    updated.splice(index, 1);
    setIncludesList(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/package-includes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id,
          includes: includesList,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Includes added successfully!');
        navigate(`/admin/packages/package-faq/${result.package.id}`);
        setIncludesList([{ title: '', includes: '' }]); // Reset form
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Package Includes for: <span className="text-indigo-600">{packageTitle}</span>
            </h1>
            <Link
              to="/admin/packages/packages-list"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              List of Packages
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md w-100">
            <form onSubmit={handleSubmit}>
              {includesList.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-6 relative"
                >
                  {includesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  )}

                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Includes Editor */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What You'll Learn <span className="text-red-500">*</span>
                    </label>
                    <ReactQuill
                      value={item.includes}
                      onChange={(value) => handleChange(index, 'includes', value)}
                      modules={modules}
                      formats={formats}
                      placeholder="List key inclusions or benefits"
                      className="h-48"
                    />
                  </div>
                </div>
              ))}

              {/* Add More Button */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleAddMore}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                >
                  + Add More
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                >
                  {isSubmitting ? 'Saving...' : 'Save Includes'}
                </button>
              </div>
            </form>
          </div>
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default PackageIncludes;
