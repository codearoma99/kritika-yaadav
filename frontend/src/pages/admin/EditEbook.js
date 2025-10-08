// frontend/src/pages/admin/EditEbook.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditEbook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    file: null,
    thumbnail: null,
    existingFile: null,
    existingThumbnail: null,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ebooks/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData((prev) => ({
            ...prev,
            title: data.title,
            description: data.description,
            price: data.price,
            existingFile: data.ebook,
            existingThumbnail: data.thumbnail || null,
          }));
        } else {
          alert(data.message || 'Failed to fetch ebook');
        }
      } catch (err) {
        console.error(err);
        alert('Error fetching ebook details');
      }
    };

    fetchEbook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRemoveFile = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);

    if (formData.file) data.append('file', formData.file);
    if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);

    try {
      setUploading(true);

      const res = await fetch(`http://localhost:5000/api/ebooks/${id}`, {
        method: 'PUT',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert('Ebook updated successfully!');
        navigate('/admin/ebooks');
      } else {
        alert(`Update failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating ebook.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Ebook</h1>
            <Link
              to="/admin/ebooks/"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              All E-Books
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              {/* Ebook File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Ebook File</label>
                {!formData.file ? (
                  <div className="flex items-center space-x-4">
                    {formData.existingFile && (
                      <p className="text-sm text-gray-600">Current: {formData.existingFile}</p>
                    )}
                    <input
                      type="file"
                      name="file"
                      onChange={handleChange}
                      accept=".pdf,.epub,.mobi"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded border">
                    <p>{formData.file.name}</p>
                    <button onClick={() => handleRemoveFile('file')} type="button">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Thumbnail Image</label>
                {!formData.thumbnail ? (
                  <div className="flex items-center space-x-4">
                    {formData.existingThumbnail && (
                      <p className="text-sm text-gray-600">Current: {formData.existingThumbnail}</p>
                    )}
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded border">
                    <p>{formData.thumbnail.name}</p>
                    <button onClick={() => handleRemoveFile('thumbnail')} type="button">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/ebooks')}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  {uploading ? 'Updating...' : 'Update Ebook'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditEbook;