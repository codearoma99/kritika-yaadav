import React, { useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const CreateBlogs = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: null,
   });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append('title', formData.title);
  form.append('description', formData.description); // ✅ Add description
  form.append('content', formData.content);
  if (formData.image) {
    form.append('image', formData.image);
  }

  try {
    const response = await fetch('http://localhost:5000/api/blogs', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();

    if (response.ok) {
      alert('Blog created successfully!');
      // ✅ Reset form including description
      setFormData({
        title: '',
        description: '',
        content: '',
        image: null,
      });
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Something went wrong.');
  }
};



  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Create Blog</h1>
            <Link
              to="/admin/blogs"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Back to Blogs
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-6">
            {/* Blog Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Blog Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {/* Blog Description */}
            <div>
            <label className="block text-gray-700 font-medium mb-2">Short Description</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write a short description (150-200 characters)..."
                required
            />
            </div>


            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
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
                      <span>Upload an image</span>
                      <input
                        id="file-upload"
                        name="image"
                        type="file"
                        onChange={handleFileChange}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                  {formData.image && (
                    <p className="text-sm text-green-600">{formData.image.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Blog Content</label>
              <ReactQuill
                value={formData.content}
                onChange={(value) => handleEditorChange('content', value)}
                modules={modules}
                formats={formats}
                placeholder="Write the blog content here..."
                className="bg-white"
              />
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
              >
                Submit Blog
              </button>
            </div>
          </form>
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default CreateBlogs;
