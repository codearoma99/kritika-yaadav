import React, { useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link, useNavigate } from 'react-router-dom';

const CreatePackages = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    duration: 'per 1 month',
    minimum_duration: '',
    info_single_line: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/api/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Package created successfully!');
      navigate(`/admin/packages/package-includes/${result.package.id}`);
      console.log('Created package:', result.package);

      // Optional: reset form
      setFormData({
        title: '',
        price: '',
        duration: 'per 1 month',
        minimum_duration: '',
        info_single_line: '',
      });
    } else {
      console.error('Server error:', result);
      alert('Failed to create package: ' + result.message);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An unexpected error occurred. Please try again.');
  }
};


  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create Package
            </h1>
            <Link 
              to="/admin/packages/packages-list" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Packages List
            </Link>
          </div>

          {/* Create Package Form */}
          <div className="bg-white p-6 rounded-md shadow-md w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="per 1 month">Per 1 Month</option>
                  <option value="per 3 months">Per 3 Months</option>
                  <option value="per 6 months">Per 6 Months</option>
                  <option value="per year">Per Year</option>
                </select>
              </div>

              {/* Minimum Duration */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Minimum Duration (in months)
                </label>
                <input
                  type="number"
                  name="minimum_duration"
                  value={formData.minimum_duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Info Single Line */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Info (Single Line)
                </label>
                <input
                  type="text"
                  name="info_single_line"
                  value={formData.info_single_line}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-md"
                >
                  Create Package
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

export default CreatePackages;
