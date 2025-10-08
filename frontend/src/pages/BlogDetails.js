import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]); // For sidebar latest blogs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blog-details/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch blog details');
        }
        const data = await res.json();
        setBlog(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blogs'); // fetch all blogs
        const data = await res.json();
        if (data.success) {
          // Sort by createdAt descending (newest first)
          const sorted = data.blogs.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          // Take top 3 latest blogs
          setLatestBlogs(sorted.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch latest blogs:', err);
      }
    };

    fetchBlog();
    fetchLatestBlogs();
  }, [id]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;
  if (!blog) return null;

  return (
    <>
      <div>
        <Header />
        <div
          className="bg-center bg-no-repeat bg-cover py-20"
          style={{ backgroundImage: "url('/assets/img/all-images/posters/br6.jpg')" }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center">
              <div className="text-center w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white mobile_ft">{blog.title}</h2>
                 <div className="my-6 mobile_mb-0"></div>
                <a href="/" className="text-lg inline-flex items-center gap-2 text-white">
                  Home <i className="fa-solid fa-angle-right"></i> <span>{blog.title}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Details Section */}
        <div className="blog-details-siderbars-area py-16">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="blog-main-detailsarea rightpadding">
                  <div className="img1 mb-6">
                    <img src={`http://localhost:5000/uploads/${blog.image}`} alt={blog.title} />
                  </div>

                  <h3>{blog.title}</h3>
                  <div className="space20"></div>
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
              </div>

              {/* Sidebar: Latest 3 blogs */}
              <div className="col-lg-4">
                <div className="blog-side-widget">
                  <div className="recent-posts-area">
                    <h3 className='mb-3'>Latest Added Blog</h3>
                    {latestBlogs.length === 0 ? (
                      <p>No recent blogs.</p>
                    ) : (
                      latestBlogs.map((item) => (
                        <div key={item.id} className="recent-post-item mb-4 flex gap-3 items-center">
                            
                          <img
                            src={`http://localhost:5000/uploads/${item.image}`}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="flex items-center text-xs gap-1">
                                <i className="fa-regular fa-calendar"></i>
                                {new Date(item.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>

                            <h4 className="text-sm font-semibold">
                              <Link to={`/blog-details/${item.id}`} className="hover:text-primary">
                                {item.title}
                              </Link>
                            </h4>
                            {/* Optionally, show date */}
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default BlogDetailPage;