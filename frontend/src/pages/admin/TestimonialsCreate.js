import React, { useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link } from 'react-router-dom';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TestimonialsCreate = () => {
  const [testimonial, setTestimonial] = useState({
    name: '',
    designation: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestimonial((prev) => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log('Submitting testimonial:', testimonial);

    const response = await fetch('http://localhost:5000/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testimonial),
    });

    console.log('Raw response:', response);
    const data = await response.json();
    console.log('Parsed response data:', data);

    if (response.ok) {
      alert('Testimonial added successfully!');
      setTestimonial({ name: '', designation: '', message: '' });
    } else {
      alert(`Failed to add testimonial: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Network or other error:', error);
    alert(`Error: ${error.message}`);
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
              <Link to="/admin/testimonials" className="mr-4 text-indigo-600 hover:text-indigo-800">
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              Create New Testimonial
            </h1>
            <Link
              to="/admin/testimonials"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              View All Testimonials
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={testimonial.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Enter person's name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={testimonial.designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Enter person's designation"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={testimonial.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Enter testimonial message"
                ></textarea>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Testimonial
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestimonialsCreate;