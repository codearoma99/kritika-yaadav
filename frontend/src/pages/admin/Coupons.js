import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicketAlt,
  faSearch,
  faEdit,
  faTrash,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faCheckCircle,
  faTimesCircle,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [customCoupons, setCustomCoupons] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_amount: '',
    usage_limit: '',
    status: 'active',
    id: null,
    product_type: '',
    product_id: '',
    coupon_code: '',
    amount: '',
    min_amount: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const couponsPerPage = 5;

  // Fetch coupons
  useEffect(() => {
    fetchAllCoupons();
  }, []);

  const fetchAllCoupons = async () => {
    setLoading(true);
    try {
      const response1 = await fetch('http://localhost:5000/api/coupons');
      const data1 = await response1.json();

      const response2 = await fetch('http://localhost:5000/api/custom-coupons');
      const data2 = await response2.json();

      if (response1.ok && response2.ok) {
        setCoupons(data1.data || []);
        setCustomCoupons(data2 || []);
      } else {
        alert('Failed to fetch coupons');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching coupons');
    } finally {
      setLoading(false);
    }
  };

  // Filter Coupons
  const filteredCoupons = [...coupons, ...customCoupons].filter((c) => {
    const statusMatch = statusFilter === 'All' || c.status === statusFilter;
    const typeMatch =
      typeFilter === 'All' ||
      (typeFilter === 'Regular' && !c.product_type) ||
      (typeFilter === 'Custom' && c.product_type);
    
    const searchMatch = c.code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       c.coupon_code?.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && typeMatch && searchMatch;
  });

  // Fetch product options
  useEffect(() => {
    if (!formData.product_type) return;

    const fetchOptions = async () => {
      let url = '';
      if (formData.product_type === 'course') url = 'http://localhost:5000/api/courses';
      if (formData.product_type === 'ebook') url = 'http://localhost:5000/api/ebooks';
      if (formData.product_type === 'package') url = 'http://localhost:5000/api/packages';

      if (url) {
        try {
          const res = await fetch(url);
          const data = await res.json();
          setProductOptions(data);
        } catch (err) {
          console.error('Error fetching product options:', err);
          setProductOptions([]);
        }
      }
    };

    fetchOptions();
  }, [formData.product_type]);

  // Pagination
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusMap = {
      active: { class: 'bg-green-100 text-green-800', icon: faCheckCircle },
      expired: { class: 'bg-red-100 text-red-800', icon: faTimesCircle },
      inactive: { class: 'bg-gray-100 text-gray-800', icon: faTimesCircle }
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${statusMap[status]?.class || 'bg-gray-100 text-gray-800'}`}>
        <FontAwesomeIcon icon={statusMap[status]?.icon || faTimesCircle} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      minimum_amount: '',
      usage_limit: '',
      status: 'active',
      id: null,
      product_type: '',
      product_id: '',
      coupon_code: '',
      amount: '',
      min_amount: ''
    });
    setIsEditing(false);
  };

  // Regular coupon submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = isEditing && formData.id;

    try {
      const response = await fetch(`http://localhost:5000/api/coupons${isEdit ? `/${formData.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          discount_type: formData.discount_type,
          discount_value: parseFloat(formData.discount_value),
          minimum_amount: formData.minimum_amount ? parseFloat(formData.minimum_amount) : 0,
          usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
          status: formData.status,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Coupon ${isEdit ? 'updated' : 'created'} successfully`);
        resetForm();
        setShowForm(false);
        fetchAllCoupons();
      } else {
        alert(`Failed to ${isEdit ? 'update' : 'create'} coupon`);
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    }
  };

  // Custom coupon submit
  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `http://localhost:5000/api/custom-coupons/${formData.id}`
        : `http://localhost:5000/api/custom-coupons`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_type: formData.product_type,
          product_id: formData.product_id,
          coupon_code: formData.coupon_code,
          discount_type: formData.discount_type,
          amount: parseFloat(formData.amount),
          min_amount: formData.min_amount ? parseFloat(formData.min_amount) : 0,
          status: formData.status
        }),
      });

      if (res.ok) {
        alert(`Custom coupon ${isEditing ? 'updated' : 'created'} successfully`);
        fetchAllCoupons();
        setShowCustomForm(false);
        resetForm();
      } else {
        alert('Failed to save custom coupon');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting custom coupon');
    }
  };

  // Edit coupon - FIXED
  const editCoupon = (coupon) => {
    if (coupon.product_type) {
      // Custom coupon
      setFormData({
        code: '',
        discount_type: coupon.discount_type || 'percentage',
        discount_value: '',
        minimum_amount: '',
        usage_limit: '',
        status: coupon.status,
        id: coupon.id,
        product_type: coupon.product_type,
        product_id: coupon.product_id,
        coupon_code: coupon.coupon_code,
        amount: coupon.amount,
        min_amount: coupon.min_amount
      });
      setIsEditing(true);
      setShowCustomForm(true);
    } else {
      // Regular coupon
      setFormData({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        minimum_amount: coupon.minimum_amount,
        usage_limit: coupon.usage_limit,
        status: coupon.status,
        id: coupon.coupon_id || coupon.id,
        product_type: '',
        product_id: '',
        coupon_code: '',
        amount: '',
        min_amount: ''
      });
      setIsEditing(true);
      setShowForm(true);
    }
  };

  // Delete coupon - FIXED
  const deleteCoupon = async (coupon) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      let url = '';
      if (coupon.product_type) {
        // Custom coupon
        url = `http://localhost:5000/api/custom-coupons/${coupon.id}`;
      } else {
        // Regular coupon
        url = `http://localhost:5000/api/coupons/${coupon.coupon_id || coupon.id}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Coupon deleted successfully');
        fetchAllCoupons();
      } else {
        alert('Failed to delete coupon');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting coupon');
    }
  };

  // Toggle status - FIXED
  const toggleStatus = async (coupon) => {
    try {
      let url = '';
      if (coupon.product_type) {
        // Custom coupon
        url = `http://localhost:5000/api/custom-coupons/${coupon.id}/toggle`;
      } else {
        // Regular coupon
        url = `http://localhost:5000/api/coupons/${coupon.coupon_id || coupon.id}/toggle`;
      }

      const response = await fetch(url, {
        method: 'PATCH',
      });

      const result = await response.json();
      if (response.ok) {
        alert('Status updated successfully');
        fetchAllCoupons();
      } else {
        alert('Failed to toggle status');
      }
    } catch (error) {
      console.error(error);
      alert('Error toggling status');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-100 fix_width1">
          <div className="flex justify-between items-center mb-6 mobile_part1">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faTicketAlt} className="mr-2 text-indigo-600" />
              Coupons Management
            </h1>
            <div className="flex gap-2 btn_Add1">
              <button
                onClick={() => {
                  resetForm();
                  setShowCustomForm(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create Custom Coupon
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create Regular Coupon
              </button>
            </div>
          </div>

          {/* Custom Coupon Form */}
          {showCustomForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    {isEditing ? 'Edit Custom Coupon' : 'Create New Custom Coupon'}
                  </h2>
                  <form onSubmit={handleCustomSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Form fields remain the same */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
                        <select
                          name="product_type"
                          value={formData.product_type}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="">-- Select --</option>
                          <option value="course">Course</option>
                          <option value="ebook">Ebook</option>
                          <option value="package">Package</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                        <select
                          name="product_id"
                          value={formData.product_id}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="">-- Select {formData.product_type || 'Product'} --</option>
                          {productOptions.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                        <input
                          type="text"
                          name="coupon_code"
                          value={formData.coupon_code}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                        <select
                          name="discount_type"
                          value={formData.discount_type}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="percentage">Percentage</option>
                          <option value="amount">Fixed Amount</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {formData.discount_type === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          min="1"
                          max={formData.discount_type === 'percentage' ? '100' : ''}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div className='d-none'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount</label>
                        <input
                          type="number"
                          name="min_amount"
                          value="500"
                          onChange={handleInputChange}
                          min="0"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="active-invisible">Active but Invisible</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomForm(false);
                          resetForm();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isEditing ? 'Update Coupon' : 'Create Coupon'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Regular Coupon Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Form fields remain the same */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                        <input
                          type="text"
                          name="code"
                          value={formData.code}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                        <select
                          name="discount_type"
                          value={formData.discount_type}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="percentage">Percentage</option>
                          <option value="amount">Fixed Amount</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {formData.discount_type === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
                        </label>
                        <input
                          type="number"
                          name="discount_value"
                          value={formData.discount_value}
                          onChange={handleInputChange}
                          min="1"
                          max={formData.discount_type === 'percentage' ? '100' : ''}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount</label>
                        <input
                          type="number"
                          name="minimum_amount"
                          value={formData.minimum_amount}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                        <input
                          type="number"
                          name="usage_limit"
                          value={formData.usage_limit}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isEditing ? 'Update Coupon' : 'Create Coupon'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Coupons List */}
          <div className="bg-white shadow rounded-lg p-6">
            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="active-invisible">Active but Invisible</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Types</option>
                  <option value="Regular">Regular</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Code</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Product Type</th>
                    <th className="px-4 py-2 border">Product ID</th>
                    <th className="px-4 py-2 border">Discount</th>
                    <th className="px-4 py-2 border">Min Amount</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCoupons.map((coupon) => (
                    <tr key={`coupon-${coupon.id}`} className="text-center">
                      <td className="px-4 py-2 border">{coupon.id || coupon.coupon_id}</td>
                      <td className="px-4 py-2 border font-medium">
                        {coupon.coupon_code || coupon.code}
                      </td>
                      <td className="px-4 py-2 border">
                        {coupon.product_type ? 'Custom' : 'Regular'}
                      </td>
                      <td className="px-4 py-2 border">{coupon.product_type || '-'}</td>
                      <td className="px-4 py-2 border">{coupon.product_id || '-'}</td>
                      <td className="px-4 py-2 border">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.amount || coupon.discount_value}%`
                          : `₹${coupon.amount || coupon.discount_value}`}
                      </td>
                      <td className="px-4 py-2 border">
                        ₹{coupon.min_amount || coupon.minimum_amount || 0}
                      </td>
                      <td className="px-4 py-2 border">
                        <StatusBadge status={coupon.status} />
                      </td>
                      <td className="px-4 py-2 border">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => editCoupon(coupon)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => deleteCoupon(coupon)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <button
                            onClick={() => toggleStatus(coupon)}
                            className={`p-1 ${coupon.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                            title={coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            <FontAwesomeIcon icon={coupon.status === 'active' ? faTimesCircle : faCheckCircle} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </div>
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default Coupons;