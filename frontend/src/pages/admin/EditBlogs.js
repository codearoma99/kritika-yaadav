import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';

const EditBlogs = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(true); // For fetching blog
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blog-details/${id}`);
        if (!res.ok) throw new Error('Failed to fetch blog data');
        const data = await res.json();

        setTitle(data.title || '');
        setDescription(data.description || '');
        setContent(data.content || '');
        setExistingImage(data.image || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('content', content);
      if (image) formData.append('image', image);

      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update blog');
      }

      setSuccess('Blog updated successfully!');
      setTimeout(() => navigate('/admin/blogs-list'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="loader"></div>
    </div>
  );
}

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Blog</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-md shadow-md">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (HTML allowed)</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Existing Image</label>
              {existingImage ? (
                <img
                  src={`http://localhost:5000/uploads/${existingImage}`}
                  alt="Current"
                  className="mb-4 max-w-xs rounded-md"
                />
              ) : (
                <p>No image uploaded</p>
              )}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload New Image (optional)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
              />
              {image && (
                <div className="mt-4">
                  <p className="mb-1">Preview:</p>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="max-w-xs rounded-md"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-md text-white transition ${
                submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {submitting ? 'Updating...' : 'Update Blog'}
            </button>
          </form>
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default EditBlogs;
