import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useParams } from 'react-router-dom';

const PackageFAQ = () => {
  const { id: package_id } = useParams();
  const [packageTitle, setPackageTitle] = useState('');
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch package title
  useEffect(() => {
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
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleAddMore = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemove = (index) => {
    const updated = [...faqs];
    updated.splice(index, 1);
    setFaqs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/package-faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id, faqs }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('FAQs added successfully!');
        setFaqs([{ question: '', answer: '' }]);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Add FAQs for: <span className="text-indigo-600">{packageTitle}</span>
            </h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-6 relative"
                >
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}

                  {/* Question */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleChange(index, 'question', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Answer */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleChange(index, 'answer', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                      required
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

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                >
                  {isSubmitting ? 'Saving...' : 'Save FAQs'}
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

export default PackageFAQ;