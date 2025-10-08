import React, { useState, useEffect } from 'react';
import StockScreenarCalculator from './StockScreenarCalculator';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

const StockScreener = () => {
   useEffect(() => {
      AOS.init({
        duration: 1000, // animation duration in ms
        once: true,     // animation only happens once
      });
    }, []);
    
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState(null); // This holds the entire row as an object
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchScreenerContent = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/screener-content/1'); // Update path if needed
        if (response.data.success) {
          setData(response.data.data); // This now holds all columns like data.lr_box4_title
        }
      } catch (error) {
        console.error('Failed to fetch screener content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenerContent();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality would go here
    console.log('Searching for:', searchTerm);
  };

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xl font-bold">Kritika Stock Valuations</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-indigo-200 transition">Features</a>
            <a href="#how-to-use" className="hover:text-indigo-200 transition">How to Use</a>
            <a href="#education" className="hover:text-indigo-200 transition">Education</a>
            <a href="#testimonials" className="hover:text-indigo-200 transition">Success Stories</a>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-800 px-4 py-2">
            <a href="#features" className="block py-2 hover:text-indigo-200 transition">Features</a>
            <a href="#how-to-use" className="block py-2 hover:text-indigo-200 transition">How to Use</a>
            <a href="#education" className="block py-2 hover:text-indigo-200 transition">Education</a>
            <a href="#testimonials" className="block py-2 hover:text-indigo-200 transition">Success Stories</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className="text-white py-16 bg-cover bg-center"
        style={{ backgroundImage: "url('assets/img/all-images/posters/screener-banner.jpg')" }}
      >

        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-yellow-400 text-indigo-800 font-bold px-3 py-1 rounded-full text-sm mb-4">FREE!</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">{data.sub_title}</h2>
            <p className="text-lg mb-8">{data.micro_title}</p>
            <blockquote className="bg-indigo-700 bg-opacity-50 rounded-lg p-4 mb-8 italic">
              {data.quote}

            </blockquote>
            
           
          </div>
        </div>
      </section>

      {/* Screener Section */}
        <StockScreenarCalculator />
      {/* Screener Section End  */}

      
      {/* Philosophy Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-6" data-aos="fade-up" data-aos-delay="100">
              Why Most Investors Fail & How You Can Succeed
            </h2>

            <blockquote className="text-xl italic text-gray-700 mb-8" data-aos="fade-up" data-aos-delay="200">
              "Investing without checking fundamentals is like sailing without a map - Risky & Uncertain"
              <span className="block mt-2 font-semibold" data-aos="fade-up" data-aos-delay="300">
                - Kritika Yadav CFP®
              </span>
            </blockquote>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-left" data-aos="fade-right" data-aos-delay="400">
              <p className="font-bold text-red-700 mb-2" data-aos="fade-right" data-aos-delay="450">{data.dis_title1}</p>
              <p data-aos="fade-right" data-aos-delay="500">
                {data.dis_text1}
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 text-left" data-aos="fade-left" data-aos-delay="600">
              <p className="font-bold text-green-700 mb-2" data-aos="fade-left" data-aos-delay="650">{data.dis_title2}</p>
              <p data-aos="fade-left" data-aos-delay="700">
                {data.dis_text2}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Screener Interface Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-600 position-relative" id="features" data-aos="fade-up" >
        <img src="assets/img/all-images/posters/instant-stock.png" alt="Decorative Shape" className="absolute bottom-0 left-0 w-auto h-auto" />
        <img src="assets/img/all-images/posters/growth.png" alt="Decorative Shape" className="absolute bottom-0 right-0 w-45 h-auto" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white" data-aos="fade-up" data-aos-delay="100">
            Instant Stock Analysis - Powered by Kritika's Methodology
          </h2>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto" data-aos="zoom-in" data-aos-delay="200">
            <div className="p-6 search-title" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-2xl font-bold">Search Any Stock & Get Complete Fundamental Analysis</h3>
            </div>
            <div className="p-6" data-aos="fade-up" data-aos-delay="400">
              <h4 className="text-xl font-semibold mb-4">What You'll Get in Every Search:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start" data-aos="fade-up" data-aos-delay="500">
                  <div className="bg-indigo-100 p-2 rounded-full mr-4">
                    {/* SVG remains unchanged */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">{data.sa_title1}</h5>
                    <p className="text-gray-600">{data.sa_text1}</p>
                  </div>
                </div>

                <div className="flex items-start" data-aos="fade-up" data-aos-delay="600">
                  <div className="bg-indigo-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">{data.sa_title2}</h5>
                    <p className="text-gray-600">{data.sa_text2}</p>
                  </div>
                </div>

                <div className="flex items-start" data-aos="fade-up" data-aos-delay="700">
                  <div className="bg-indigo-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">{data.sa_title3}</h5>
                    <p className="text-gray-600">{data.sa_text3}</p>
                  </div>
                </div>

                <div className="flex items-start" data-aos="fade-up" data-aos-delay="800">
                  <div className="bg-indigo-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">{data.sa_title4}</h5>
                    <p className="text-gray-600">{data.sa_text4}</p>
                  </div>
                </div>

                <div className="flex items-start" data-aos="fade-up" data-aos-delay="900">
                  <div className="bg-indigo-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">{data.sa_title5}</h5>
                    <p className="text-gray-600">{data.sa_text5}</p>
                  </div>
                </div>

                <div className="flex items-start" data-aos="fade-up" data-aos-delay="1000">
                  <div className="bg-indigo-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">{data.sa_title6}</h5>
                    <p className="text-gray-600">{data.sa_text6}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white" data-aos="fade-up">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="50">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up" data-aos-delay="100">
            What Makes Kritika's Screener Different?
          </h2>

          <div className="grid md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="150">
            <div
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <div
                className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4"
                data-aos="zoom-in"
                data-aos-delay="250"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-700" data-aos="fade-up" data-aos-delay="350">
                {data.sd_box1_title}
              </h3>
              <ul className="space-y-2" data-aos="fade-up" data-aos-delay="400">
                <li className="flex items-start" data-aos="fade-right" data-aos-delay="450">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{data.sd_box1_text}</span>
                </li>
                <li className="flex items-start" data-aos="fade-right" data-aos-delay="500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{data.sd_box1_text2}</span>
                </li>
                <li className="flex items-start" data-aos="fade-right" data-aos-delay="550">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{data.sd_box1_text3}</span>
                </li>
              </ul>
            </div>

            <div
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition"
              data-aos="zoom-in"
              data-aos-delay="600"
            >
              <div
                className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4"
                data-aos="zoom-in"
                data-aos-delay="650"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-aos="zoom-in"
                  data-aos-delay="700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-700" data-aos="fade-up" data-aos-delay="750">
                {data.sd_box2_title}
              </h3>
              <ul className="space-y-2" data-aos="fade-up" data-aos-delay="800">
                <li className="flex items-start" data-aos="fade-right" data-aos-delay="850">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{data.sd_box2_text}</span>
                </li>
                <li className="flex items-start" data-aos="fade-right" data-aos-delay="900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{data.sd_box2_text2}</span>
                </li>
                <li className="flex items-start" data-aos="fade-right" data-aos-delay="950">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{data.sd_box2_text3}</span>
                </li>
              </ul>
            </div>

            <div
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition"
              data-aos="zoom-in"
              data-aos-delay="1050"
            >
              <div
                className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4"
                data-aos="zoom-in"
                data-aos-delay="1100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-aos="zoom-in"
                  data-aos-delay="1150"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-700" data-aos="fade-up" data-aos-delay="1200">
                {data.sd_box3_title}
              </h3>
              <ul className="space-y-2" data-aos="fade-up" data-aos-delay="1250">
                <li className="flex items-start" data-aos="fade-right" data-aos-delay="1300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{data.sd_box3_text}</span>
                </li>
                <li className="flex items-start" data-aos="fade-right" data-aos-delay="1350">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{data.sd_box3_text2}</span>
                </li>
                <li className="flex items-start" data-aos="fade-right" data-aos-delay="1400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{data.sd_box3_text3}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>


      {/* How to Use Section */}
      <section 
        className="py-16 bg-indigo-50" 
        id="how-to-use"
        data-aos="fade-up"
        data-aos-duration="800"
      >
          <div 
            className="container mx-auto px-4" 
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="800"
          >
            <h2 
              className="text-3xl font-bold text-center mb-12" 
              data-aos="zoom-in" 
              data-aos-delay="200" 
              data-aos-duration="700"
            >
              3 Simple Steps to Smart Investing
            </h2>

            <div 
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" 
              data-aos="fade-up" 
              data-aos-delay="300" 
              data-aos-duration="800"
            >
              {/* Card 1 */}
              <div 
                className="bg-white p-8 rounded-xl border-2 border-indigo-100 hover:border-indigo-300 transition-all shadow-lg hover:shadow-xl"
                data-aos="flip-left"
                data-aos-delay="400"
                data-aos-duration="900"
              >
                <div 
                  className="bg-gradient-to-br from-indigo-600 to-indigo-400 text-white w-12 h-12 rounded-full flex items-center justify-center mb-6 font-bold text-xl shadow-md"
                  data-aos="zoom-in"
                  data-aos-delay="450"
                  data-aos-duration="600"
                >
                  1
                </div>
                <h3 
                  className="text-xl font-bold mb-4 text-indigo-700"
                  data-aos="fade-right"
                  data-aos-delay="500"
                  data-aos-duration="700"
                >
                  {data.si_box1_title}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li 
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="550"
                    data-aos-duration="600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>{data.si_box1_text1}</span>
                  </li>
                  <li 
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="600"
                    data-aos-duration="600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>{data.si_box1_text2}</span>
                  </li>
                  <li 
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="650"
                    data-aos-duration="600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{data.si_box1_text3}</span>
                  </li>
                </ul>
              </div>

              {/* Card 2 */}
              <div 
                className="bg-white p-8 rounded-xl border-2 border-indigo-100 hover:border-indigo-300 transition-all shadow-lg hover:shadow-xl"
                data-aos="flip-left"
                data-aos-delay="500"
                data-aos-duration="900"
              >
                <div 
                  className="bg-gradient-to-br from-indigo-600 to-indigo-400 text-white w-12 h-12 rounded-full flex items-center justify-center mb-6 font-bold text-xl shadow-md"
                  data-aos="zoom-in"
                  data-aos-delay="550"
                  data-aos-duration="600"
                >
                  2
                </div>
                <h3 
                  className="text-xl font-bold mb-4 text-indigo-700"
                  data-aos="fade-right"
                  data-aos-delay="600"
                  data-aos-duration="700"
                >
                  {data.si_box2_title}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li 
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="650"
                    data-aos-duration="600"
                  >
                    <div className="bg-green-100 text-green-600 p-1 rounded-full mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{data.si_box2_text1}</span>
                  </li>
                  <li 
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="700"
                    data-aos-duration="600"
                  >
                    <div className="bg-yellow-100 text-yellow-600 p-1 rounded-full mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span>{data.si_box2_text2}</span>
                  </li>
                  <li 
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="750"
                    data-aos-duration="600"
                  >
                    <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span>{data.si_box2_text3}</span>
                  </li>
                </ul>
              </div>

              {/* Card 3 */}
              <div 
                className="bg-white p-8 rounded-xl border-2 border-indigo-100 hover:border-indigo-300 transition-all shadow-lg hover:shadow-xl"
                data-aos="flip-left"
                data-aos-delay="600"
                data-aos-duration="900"
              >
                <div 
                  className="bg-gradient-to-br from-indigo-600 to-indigo-400 text-white w-12 h-12 rounded-full flex items-center justify-center mb-6 font-bold text-xl shadow-md"
                  data-aos="zoom-in"
                  data-aos-delay="650"
                  data-aos-duration="600"
                >
                  3
                </div>
                <h3 
                  className="text-xl font-bold mb-4 text-indigo-700"
                  data-aos="fade-right"
                  data-aos-delay="700"
                  data-aos-duration="700"
                >
                  {data.si_box3_title}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li 
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="750"
                    data-aos-duration="600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{data.si_box3_text1}</span>
                  </li>
                  <li 
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="800"
                    data-aos-duration="600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{data.si_box3_text2}</span>
                  </li>
                  <li 
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="850"
                    data-aos-duration="600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{data.si_box3_text3}</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
      </section>


      {/* Educational Section */}
      <section className="py-16 bg-white" id="education" data-aos="fade-up">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-3xl font-bold text-center mb-6" data-aos="fade-up" data-aos-delay="200">Learn to Read Like a Pro</h2>
          <h3
            className="text-xl font-semibold text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Master these key financial metrics to make smarter investment decisions
          </h3>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto" data-aos="fade-up" data-aos-delay="400">
            {/* Box 1 */}
            <div
              className="bg-white p-6 rounded-xl border-2 border-indigo-50 hover:border-indigo-100 transition-all shadow-md hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="flex items-center mb-4" data-aos="fade-right" data-aos-delay="600">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-indigo-700">{data.lr_box1_title}</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="700">
                  <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-green-100">
                    {data.lr_box1_tag1}
                  </div>
                  <span className="text-gray-700">{data.lr_box1_text1}</span>
                </li>
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="800">
                  <div className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-blue-100">
                    {data.lr_box1_tag2}
                  </div>
                  <span className="text-gray-700">{data.lr_box1_text2}</span>
                </li>
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="900">
                  <div className="bg-red-50 text-red-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-red-100">
                    {data.lr_box1_tag3}
                  </div>
                  <span className="text-gray-700">{data.lr_box1_text3}</span>
                </li>
              </ul>
            </div>

            {/* Box 2 */}
            <div
              className="bg-white p-6 rounded-xl border-2 border-indigo-50 hover:border-indigo-100 transition-all shadow-md hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="flex items-center mb-4" data-aos="fade-right" data-aos-delay="700">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-indigo-700">{data.lr_box2_title}</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="800">
                  <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-green-100">
                    {data.lr_box2_tag1}
                  </div>
                  <span className="text-gray-700">{data.lr_box2_text1}</span>
                </li>
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="900">
                  <div className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-blue-100">
                    {data.lr_box2_tag2}
                  </div>
                  <span className="text-gray-700">{data.lr_box2_text2}</span>
                </li>
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="1000">
                  <div className="bg-red-50 text-red-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-red-100">
                    {data.lr_box2_tag3}
                  </div>
                  <span className="text-gray-700">{data.lr_box2_text3}</span>
                </li>
              </ul>
            </div>

            {/* Box 3 */}
            <div
              className="bg-white p-6 rounded-xl border-2 border-indigo-50 hover:border-indigo-100 transition-all shadow-md hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <div className="flex items-center mb-4" data-aos="fade-right" data-aos-delay="800">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-indigo-700">{data.lr_box3_title}</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="900">
                  <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-green-100">
                    {data.lr_box3_tag1}
                  </div>
                  <span className="text-gray-700">{data.lr_box3_text1}</span>
                </li>
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="1000">
                  <div className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-blue-100">
                    {data.lr_box3_tag2}
                  </div>
                  <span className="text-gray-700">{data.lr_box3_text2}</span>
                </li>
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="1100">
                  <div className="bg-red-50 text-red-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-red-100">
                    {data.lr_box3_tag3}
                  </div>
                  <span className="text-gray-700">{data.lr_box3_text3}</span>
                </li>
              </ul>
            </div>

            {/* Box 4 */}
            <div
              className="bg-white p-6 rounded-xl border-2 border-indigo-50 hover:border-indigo-100 transition-all shadow-md hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <div className="flex items-center mb-4" data-aos="fade-right" data-aos-delay="900">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-indigo-700">{data.lr_box4_title}</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="1000">
                  <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-green-100">
                    {data.lr_box4_tag1}
                  </div>
                  <span className="text-gray-700">{data.lr_box4_text1}</span>
                </li>
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="1100">
                  <div className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-blue-100">
                    {data.lr_box4_tag2}
                  </div>
                  <span className="text-gray-700">{data.lr_box4_text2}</span>
                </li>
                <li className="flex items-start" data-aos="fade-left" data-aos-delay="1200">
                  <div className="bg-red-50 text-red-700 text-sm font-medium px-3 py-1.5 rounded-full mr-3 border border-red-100">
                    {data.lr_box4_tag3}
                  </div>
                  <span className="text-gray-700">{data.lr_box4_text3}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Special Features Section */}
      <section className="py-16 bg-indigo-50" data-aos="fade-up">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-3xl font-bold text-center mb-6" data-aos="fade-up" data-aos-delay="200">Exclusive Kritika Insights</h2>
          <p className="text-xl text-center mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="300">
            Professional-grade analysis tools powered by Kritika's investment methodology
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto" data-aos="fade-up" data-aos-delay="400">
        {/* Pattern Recognition Card */}
        <div
          className="bg-white p-8 rounded-xl border border-indigo-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <div className="flex items-center mb-6" data-aos="fade-right" data-aos-delay="600">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-indigo-700" data-aos="fade-right" data-aos-delay="700">{data.ki_box1_title}</h3>
          </div>
        
          <ul className="space-y-4">
            <li className="flex items-start" data-aos="fade-left" data-aos-delay="800">
              <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0" data-aos="fade-left" data-aos-delay="810">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700" data-aos="fade-left" data-aos-delay="820">{data.ki_box1_text1}</span>
            </li>
            <li className="flex items-start" data-aos="fade-left" data-aos-delay="900">
              <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0" data-aos="fade-left" data-aos-delay="910">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700" data-aos="fade-left" data-aos-delay="920">{data.ki_box1_text2}</span>
            </li>
            <li className="flex items-start" data-aos="fade-left" data-aos-delay="1000">
              <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0" data-aos="fade-left" data-aos-delay="1010">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700" data-aos="fade-left" data-aos-delay="1020">{data.ki_box1_text3}</span>
            </li>
          </ul>
        </div>
        
        {/* User-Friendly Interface Card */}
        <div
          className="bg-white p-8 rounded-xl border border-indigo-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          data-aos="fade-up"
          data-aos-delay="1100"
        >
          <div className="flex items-center mb-6" data-aos="fade-right" data-aos-delay="1200">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-indigo-700" data-aos="fade-right" data-aos-delay="1300">{data.ki_box2_title}</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start" data-aos="fade-left" data-aos-delay="1350">
              <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0" data-aos="fade-left" data-aos-delay="1360">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700" data-aos="fade-left" data-aos-delay="1370">{data.ki_box2_text1}</span>
            </li>
            <li className="flex items-start" data-aos="fade-left" data-aos-delay="1450">
              <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0" data-aos="fade-left" data-aos-delay="1460">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700" data-aos="fade-left" data-aos-delay="1470">{data.ki_box2_text2}</span>
            </li>
            <li className="flex items-start" data-aos="fade-left" data-aos-delay="1550">
              <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0" data-aos="fade-left" data-aos-delay="1560">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700" data-aos="fade-left" data-aos-delay="1570">{data.ki_box2_text3}</span>
            </li>
          </ul>
        </div>
      </div>

        </div>
      </section>


      {/* Disclaimers Section */}
      <section className="py-16 bg-red-50" data-aos="fade-up">
        <div className="container mx-auto px-4 max-w-4xl" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-3xl font-bold text-center text-red-700 mb-8" data-aos="fade-up" data-aos-delay="200">
            Important Disclaimers
          </h2>
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-6" data-aos="fade-up" data-aos-delay="300">
            Investment Guidance & Risk Warning
          </h3>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8" data-aos="fade-up" data-aos-delay="400">
            <h4 className="font-bold text-lg mb-3 text-gray-800" data-aos="fade-up" data-aos-delay="450">
              {data.id_box1_title}
            </h4>
            <ul className="space-y-3 text-gray-700">
              {[data.id_box1_text1, data.id_box1_text2, data.id_box1_text3, data.id_box1_text4].map((text, index) => (
                <li className="flex items-start" key={index} data-aos="fade-right" data-aos-delay={500 + index * 100}>
                  <div className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded mr-3" data-aos="fade-right" data-aos-delay={510 + index * 100}>
                    {index + 1}
                  </div>
                  <span data-aos="fade-right" data-aos-delay={520 + index * 100}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="900">
            <h4 className="font-bold text-lg mb-3 text-red-700" data-aos="fade-up" data-aos-delay="950">
              {data.id_box2_title}
            </h4>
            <ul className="space-y-3 text-gray-700">
              {[data.id_box2_text1, data.id_box2_text2, data.id_box2_text3, data.id_box2_text4].map((text, index) => (
                <li className="flex items-start" key={index} data-aos="fade-right" data-aos-delay={1000 + index * 100}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor" data-aos="fade-right" data-aos-delay={1010 + index * 100}>
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span data-aos="fade-right" data-aos-delay={1020 + index * 100}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>


      {/* Call to Action Section */}
      <section
        className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white"
        data-aos="fade-up"
      >
        <div
          className="container mx-auto px-4 text-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-3xl font-bold mb-8" data-aos="fade-up" data-aos-delay="200">
            Ready to Start Smart Investing?
          </h2>

          <div
            className="max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h3 className="text-xl font-semibold mb-6" data-aos="fade-up" data-aos-delay="400">
              Try Our Free Screener Now
            </h3>
            <p className="mb-8" data-aos="fade-up" data-aos-delay="500">
              Search any stock and get instant fundamental analysis
            </p>

            <div
              className="flex flex-col sm:flex-row justify-center gap-4"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <a href='#features'>
                <button
                  className="bg-white text-indigo-800 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition shadow-lg"
                  data-aos="zoom-in"
                  data-aos-delay="700"
                >
                  SEARCH STOCKS NOW
                </button>
              </a>
              <a href='#features'>
                <button
                  className="bg-white text-indigo-800 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition shadow-lg"
                  data-aos="zoom-in"
                  data-aos-delay="800"
                >
                  VIEW SAMPLE ANALYSIS
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Support & Community Section */}
      <section className="py-16 bg-gray-100 overflow-hidden" data-aos="fade-up">
        <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="zoom-in" data-aos-delay="200">
            Join Thousands of Smart Investors
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto" data-aos="fade-up" data-aos-delay="300">
            <div className="bg-white p-6 rounded-xl shadow-md" data-aos="fade-right" data-aos-delay="400">
              <h3 className="text-xl font-bold mb-4 text-indigo-700" data-aos="fade-down" data-aos-delay="500">Get Help:</h3>
              <ul className="space-y-3 text-gray-700">
                {[data.ju_box1_text1, data.ju_box1_text2, data.ju_box1_text3, data.ju_box1_text4].map((text, index) => (
                  <li className="flex items-start" key={index} data-aos="fade-left" data-aos-delay={600 + index * 100}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      {index === 0 && (
                        <>
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </>
                      )}
                      {index === 1 && (
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                      )}
                      {index === 2 && (
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      )}
                      {index === 3 && (
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md" data-aos="fade-left" data-aos-delay="400">
              <h3 className="text-xl font-bold mb-4 text-indigo-700" data-aos="fade-down" data-aos-delay="500">Community Features:</h3>
              <ul className="space-y-3 text-gray-700">
                {[data.ju_box2_text1, data.ju_box2_text2, data.ju_box2_text3, data.ju_box2_text4].map((text, index) => (
                  <li className="flex items-start" key={index} data-aos="fade-right" data-aos-delay={600 + index * 100}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      {index === 0 && (
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                      )}
                      {index === 1 && (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      )}
                      {index === 2 && (
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      )}
                      {index === 3 && (
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Final Message */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-8">From Kritika Yadav CFP®</h2>
          
          <blockquote className="text-xl italic mb-8">
            {data.fk_quote1}

          </blockquote>
          
          <p className="text-lg mb-8">
            {data.fk_quote2}
          </p>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Screener Capabilities</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-indigo-700">Data Coverage:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{data.sc_box1_text1}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{data.sc_box1_text2}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{data.sc_box1_text3}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{data.sc_box1_text4}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-indigo-700">Technical Features:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{data.sc_box2_text1}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{data.sc_box2_text2}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{data.sc_box2_text3}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{data.sc_box2_text4}</span>
                </li>
              </ul>
            </div>
            
           
          </div>
        </div>
      </section>

    </div>
  );
};

export default StockScreener;