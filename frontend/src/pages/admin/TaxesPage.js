import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const TAX_TYPES = ['ebook', 'course', 'package'];

const TaxesPage = () => {
  const [activeTab, setActiveTab] = useState('ebook');
  const [taxData, setTaxData] = useState({
    ebook: null,
    course: null,
    package: null
  });
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState({
    title: '',
    percentage: ''
  });

  useEffect(() => {
    // Fetch all taxes data by type
    const fetchTaxes = async () => {
      try {
        const resp = await axios.get('http://localhost:5000/api/taxes'); // returns all
        const data = resp.data; // assume array of { id, title, percentage, product_type, ... }
        const byType = {};
        data.forEach(t => {
          byType[t.product_type] = t;
        });
        setTaxData(byType);
        // initialize edit values for activeTab
        if (byType[activeTab]) {
          setEdit({
            title: byType[activeTab].title,
            percentage: byType[activeTab].percentage
          });
        }
      } catch (err) {
        console.error('Error fetching taxes', err);
      }
    };

    fetchTaxes();
  }, []);

  useEffect(() => {
    // When activeTab changes, update the edit fields
    const current = taxData[activeTab];
    if (current) {
      setEdit({
        title: current.title,
        percentage: current.percentage
      });
    }
  }, [activeTab, taxData]);

  const handleSave = async () => {
    const current = taxData[activeTab];
    if (!current) return;
    setLoading(true);
    try {
      const resp = await axios.put(`http://localhost:5000/api/taxes/${current.id}`, {
        title: edit.title,
        percentage: edit.percentage
      });
      // assuming resp.data is the updated record
      setTaxData(prev => ({
        ...prev,
        [activeTab]: resp.data
      }));
      alert('Updated successfully');
    } catch (err) {
      console.error('Update failed', err);
      alert('Update failed');
    } finally {
      setLoading(false);
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
              Taxes Management
            </h1>
            {/* you might have "Add New" link if needed */}
          </div>

          {/* Tabs */}
          <div className="mb-4 border-b border-gray-300">
            {TAX_TYPES.map(type => (
              <button
                key={type}
                className={`py-2 px-4 -mb-px font-semibold text-sm ${
                  activeTab === type
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
                onClick={() => setActiveTab(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            {taxData[activeTab] ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                    value={edit.title}
                    onChange={e => setEdit(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                    value={edit.percentage}
                    onChange={e => setEdit(prev => ({ ...prev, percentage: e.target.value }))}
                  />
                </div>
                <div className="pt-4">
                  <button
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No data for {activeTab}</div>
            )}
          </div>
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default TaxesPage;