// src/pages/admin/EditPackage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [main, setMain] = useState({
    title: '',
    price: '',
    duration: '',
    minimum_duration: '',
    info_single_line: ''
  });
  const [includes, setIncludes] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/packages/${id}/details`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load package details');

        setMain({
          title: data.package.title,
          price: data.package.price,
          duration: data.package.duration,
          minimum_duration: data.package.minimum_duration,
          info_single_line: data.package.info_single_line
        });

        setIncludes(data.includes || []);
        setFaqs(data.faqs || []);
      } catch (err) {
        console.error('Error fetching package:', err);
        alert('Error loading package data');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setMain((prev) => ({ ...prev, [name]: value }));
  };

  const handleIncludeChange = (index, field, value) => {
    const newIncludes = [...includes];
    newIncludes[index] = { ...newIncludes[index], [field]: value };
    setIncludes(newIncludes);
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const body = {
        title: main.title,
        price: main.price,
        duration: main.duration,
        minimum_duration: main.minimum_duration,
        info_single_line: main.info_single_line,
        includes: includes,
        faqs: faqs
      };

      const response = await fetch(`http://localhost:5000/api/packages/${id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update package');

      alert('Package updated successfully');
      navigate('/admin/packages');
    } catch (err) {
      console.error('Error updating package:', err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      ['link'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'font', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link'
  ];

  if (loading) return <div className="p-10">Loading package details...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Package</h1>
            <Link
              to="/admin/packages"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              All Packages
            </Link>
          </div>

          <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-6">

            {/* Main Package Info */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Package Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Package Title"
                  value={main.title}
                  onChange={handleMainChange}
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={main.price}
                  onChange={handleMainChange}
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (e.g. in days)"
                  value={main.duration}
                  onChange={handleMainChange}
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="number"
                  name="minimum_duration"
                  placeholder="Minimum Duration"
                  value={main.minimum_duration}
                  onChange={handleMainChange}
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="text"
                  name="info_single_line"
                  placeholder="Info (single line)"
                  value={main.info_single_line}
                  onChange={handleMainChange}
                  className="border p-2 rounded-md w-full md:col-span-2"
                />
              </div>
            </section>

            {/* Package Includes */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Includes</h2>
              {includes.map((item, index) => (
                <div key={item.id ?? index} className="mb-6 border p-4 rounded-md bg-gray-50">
                  <label className="block mb-2 font-medium">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleIncludeChange(index, 'title', e.target.value)}
                    className="mb-4 border p-2 rounded-md w-full"
                    placeholder="Section Title (e.g. What's Included)"
                  />

                  <label className="block mb-2 font-medium">Includes (HTML or text)</label>
                  <ReactQuill
                    value={item.includes}
                    onChange={(value) => handleIncludeChange(index, 'includes', value)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="List key inclusions or benefits"
                    className="bg-white"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setIncludes([...includes, { title: '', includes: '' }])}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                + Add Include
              </button>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-xl font-semibold mb-4">FAQs</h2>
              {faqs.map((faq, index) => (
                <div key={faq.id ?? index} className="mb-6 border p-4 rounded-md bg-gray-50">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    className="mb-4 border p-2 rounded-md w-full"
                    placeholder="FAQ Question"
                  />
                  <input
                    type="text"
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                    className="border p-2 rounded-md w-full"
                    placeholder="FAQ Answer"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                + Add FAQ
              </button>
            </section>

            {/* Save button */}
            <div className="flex justify-end">
            <button
                type="submit"
                disabled={saving}
                className={`${
                  saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white px-6 py-2 rounded-md`}
              >
                {saving ? 'Updating...' : 'Update Package'}
              </button>
            </div>

          </form>
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default EditPackage;