import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/packages');
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle delete
  const handleDelete = async () => {
  console.log('Deleting package ID:', selectedPackageId); // <-- Add this

  try {
    const response = await fetch(`http://localhost:5000/api/packages/${selectedPackageId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok) {
      setPackages(packages.filter(pkg => pkg.id !== selectedPackageId));
      setShowDeleteModal(false);
    } else {
      alert(data.message || 'Failed to delete package');
    }
  } catch (error) {
    console.error('Delete error:', error);
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
              Packages Management
            </h1>
            <Link
              to="/admin/create-packages"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              Add New Package
            </Link>
          </div>

          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pkg.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{pkg.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <Link
                        to={`/admin/packages/edit-package/${pkg.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedPackageId(pkg.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Delete Package</h2>
                <p className="text-gray-700 mb-6">Are you sure you want to delete this package?</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default PackagesList;
