// src/pages/admin/TestimonialsList.js

import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link } from 'react-router-dom';

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/testimonials');
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Update status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/testimonials/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (res.ok) {
        setTestimonials(prev =>
          prev.map(t => (t.id === id ? { ...t, status: newStatus } : t))
        );
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
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
            <h1 className="text-2xl font-bold text-gray-800">Testimonials Management</h1>
            <Link
              to="/admin/create-testimonials"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Add New Testimonial
            </Link>
          </div>

          {loading ? (
            <p>Loading testimonials...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.designation}</p>
                  <p className="mt-4 text-gray-700 italic">"{testimonial.message}"</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        testimonial.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : testimonial.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {testimonial.status}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStatus(testimonial.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(testimonial.id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default TestimonialsList;