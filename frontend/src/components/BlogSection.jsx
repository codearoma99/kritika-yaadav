import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  return (
    <div className="vl-blog-1-area">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.length === 0 && (
            <p className="text-center col-span-3 text-gray-500">No blogs found.</p>
          )}

          {blogs.map((blog) => (
            <div
              key={blog.id}
              data-aos="fade-left"
              data-aos-duration="900"
              className="vl-blog-1-item bg-white"
            >
              <div className="vl-blog-1-thumb image-anime">
                <img
                  src={`http://localhost:5000/uploads/${blog.image}`}
                  alt={blog.title}
                  className="w-full rounded-md"
                />
              </div>
              <div className="vl-blog-1-content mt-2">
                <h4 className="vl-blog-1-title text-xl font-semibold mb-4">
                  {/* Using react-router Link instead of anchor to avoid full reload */}
                  <Link
                    to={`/blog-details/${blog.id}`}
                    className="hover:text-primary transition blog-title"
                  >
                    {blog.title}
                  </Link>
                </h4>
                <p className="text-gray-700 mb-6">
                  {blog.description && blog.description.length > 150
                ? blog.description.substring(0, 150) + '...'
                : blog.description || ''}

                </p>
                <div className="vl-blog-1-icon">
                  <Link
                    to={`/blog-details/${blog.id}`}
                    className="text-blue-600 font-medium flex items-center gap-2"
                  >
                    Read More <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;