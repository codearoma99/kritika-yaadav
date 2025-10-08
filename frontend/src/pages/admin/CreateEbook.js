import React, { useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link } from 'react-router-dom';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CreateEbook = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    file: null,
    thumbnail: null,
    downloadable: false
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : files ? files[0] : value
      }));

  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert('Please upload an ebook file.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('file', formData.file);
    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
    }
    data.append('downloadable', formData.downloadable ? 1 : 0);


    try {
      setUploading(true);

      const res = await fetch('http://localhost:5000/api/ebooks', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert('Ebook uploaded successfully!');
        console.log(result);

        setFormData({
          title: '',
          description: '',
          price: '',
          file: null,
          downloadable: false
        });
      } else {
        console.error('Upload failed:', result);
        alert(`Upload failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading ebook:', error);
      alert('An error occurred during upload.');
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
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              Courses Management
            </h1>
            <Link
              to="/admin/create-course"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              Add New Course
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Create New Ebook</h2>
            <form onSubmit={handleSubmit}>

              {/* Title Field */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Enter ebook title"
                />
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Enter ebook description"
                ></textarea>
              </div>

              {/* Price Field */}
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="0.00"
                />
              </div>

              {/* Toggle Switch for Downloadable */}
              {/* Toggle Switch for Downloadable */}
                <div className="mb-6">
                  <label htmlFor="downloadable" className="block text-sm font-medium text-gray-700 mb-2">
                    Allow Download
                  </label>
                  <div
                    onClick={() => setFormData(prev => ({ ...prev, downloadable: !prev.downloadable }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-300 ${formData.downloadable ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${formData.downloadable ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {formData.downloadable ? 'Yes, this ebook is downloadable' : 'No, this ebook is not downloadable'}
                  </p>
                </div>

               
               {/* Thumbnail Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image <span className="text-red-500">*</span>
                  </label>

                  {!formData.thumbnail ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex justify-center text-gray-400">
                          <FontAwesomeIcon icon={faCloudUploadAlt} className="h-12 w-12" />
                        </div>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="thumbnail-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                          >
                            <span>Upload a thumbnail</span>
                            <input
                              id="thumbnail-upload"
                              name="thumbnail"
                              type="file"
                              accept="image/*"
                              onChange={handleChange}
                              className="sr-only"
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          JPG, PNG, or WebP files up to 5MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
                          <FontAwesomeIcon icon={faCloudUploadAlt} className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {formData.thumbnail.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(formData.thumbnail.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, thumbnail: null }))
                        }
                        className="ml-1 p-1 text-gray-400 hover:text-gray-500"
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>


              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ebook File <span className="text-red-500">*</span>
                </label>

                {!formData.file ? (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex justify-center text-gray-400">
                        <FontAwesomeIcon icon={faCloudUploadAlt} className="h-12 w-12" />
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file"
                            type="file"
                            onChange={handleChange}
                            className="sr-only"
                            accept=".pdf,.epub,.mobi"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, EPUB, or MOBI files up to 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                        <FontAwesomeIcon icon={faCloudUploadAlt} className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {formData.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="ml-1 p-1 text-gray-400 hover:text-gray-500"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-4 py-2 ${uploading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  {uploading ? 'Uploading...' : 'Create Ebook'}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateEbook;