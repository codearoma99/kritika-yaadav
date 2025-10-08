import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';

const AdminFAQPage = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categoryName, setCategoryName] = useState('');
  const [faqCategories, setFaqCategories] = useState([]);
  const [faqItems, setFaqItems] = useState([
    { question: '', answer: '' }
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 🔁 Fetch categories on component mount
useEffect(() => {
  fetchCategories();
}, []);

// ✅ Function to fetch categories
const fetchCategories = async () => {
  console.log('[FETCH CATEGORIES] Sending GET request...');
  try {
    const res = await axios.get('http://localhost:5000/api/faq/categories');
    console.log('[FETCH CATEGORIES] Response:', res.data);
    if (res.data.success) {
      setFaqCategories(res.data.data);
    } else {
      console.warn('[FETCH CATEGORIES] API responded but success=false');
    }
  } catch (err) {
    console.error('[FETCH CATEGORIES] Error fetching categories:', err);
  }
};

// ✅ Function to handle new category submission
const handleAddCategory = async (e) => {
  e.preventDefault();

  if (!categoryName.trim()) {
    console.warn('[ADD CATEGORY] Title is empty.');
    return alert('Category title is required');
  }

  console.log('[ADD CATEGORY] Sending POST request with title:', categoryName);

  try {
    const res = await axios.post('http://localhost:5000/api/faq/categories', { title: categoryName });

    console.log('[ADD CATEGORY] Response:', res.data);

    if (res.data.success) {
      setCategoryName('');
      fetchCategories(); // Refresh category list
      alert('Category added!');
    } else {
      console.warn('[ADD CATEGORY] API responded but success=false');
    }
  } catch (err) {
    console.error('[ADD CATEGORY] Error adding category:', err);
  }
};

// ✅ Function to add another FAQ item input
const handleAddMoreFaq = () => {
  console.log('[ADD FAQ] Adding new empty FAQ item');
  setFaqItems([...faqItems, { question: '', answer: '' }]);
};

// ✅ Function to update question/answer input
const handleFaqChange = (index, field, value) => {
  console.log(`[UPDATE FAQ] Changing index ${index} field ${field} to "${value}"`);
  const updatedFaqs = [...faqItems];
  updatedFaqs[index][field] = value;
  setFaqItems(updatedFaqs);
};

// ✅ Function to submit all FAQ items
const handleSubmitFaqItems = async (e) => {
  e.preventDefault();

  if (!selectedCategoryId) {
    console.warn('[SUBMIT FAQ] No category selected');
    return alert('Please select a category');
  }

  const payload = faqItems.map(item => ({
    ...item,
    category_id: selectedCategoryId
  }));

  console.log('[SUBMIT FAQ] Submitting payload:', payload);

  try {
    const res = await axios.post('http://localhost:5000/api/faq/items/bulk', { items: payload });
    console.log('[SUBMIT FAQ] Response:', res.data);

    if (res.data.success) {
      setFaqItems([{ question: '', answer: '' }]); // Reset form
      alert('FAQ items added!');
    } else {
      console.warn('[SUBMIT FAQ] API responded but success=false');
    }
  } catch (err) {
    console.error('[SUBMIT FAQ] Error adding FAQ items:', err);
  }
};


  const filteredCategories = faqCategories.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />

        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage FAQ</h1>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex space-x-4">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 font-semibold rounded ${
                activeTab === 'categories'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              Add FAQ Categories
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-2 font-semibold rounded ${
                activeTab === 'items'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              Add FAQ Items
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'categories' && (
            <div className="bg-white p-6 rounded shadow-md w-full">
              <h2 className="text-lg font-semibold mb-4">Create FAQ Category</h2>
              <form onSubmit={handleAddCategory}>
                <label className="block mb-2 text-sm font-medium text-gray-700">Category Title</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Account & Login"
                  required
                />
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Category
                </button>
              </form>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="bg-white p-6 rounded shadow-md w-full">
              <h2 className="text-lg font-semibold mb-4">Create FAQ Items</h2>
              <form onSubmit={handleSubmitFaqItems}>
                <label className="block mb-2 text-sm font-medium text-gray-700">Select Category</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">-- Select Category --</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>

                {faqItems.map((item, index) => (
                  <div key={index} className="mb-6 border-b border-gray-200 pb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Question #{index + 1}</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter the question"
                      required
                    />

                    <label className="block mb-2 text-sm font-medium text-gray-700">Answer</label>
                    <textarea
                      rows={4}
                      value={item.answer}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter the answer"
                      required
                    ></textarea>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddMoreFaq}
                  className="mb-4 text-blue-600 font-medium"
                >
                  + Add another FAQ
                </button>

                <button
                  type="submit"
                  className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit All FAQs
                </button>
              </form>
            </div>
          )}
        </main>

        <FooterAdmin />
      </div>
    </div>
  );
};

export default AdminFAQPage;
