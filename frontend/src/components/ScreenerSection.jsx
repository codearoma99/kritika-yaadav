import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useContent from '../hooks/useContent'; // adjust path as needed

const ScreenerSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const { content, loading, error } = useContent();
  

  // ✅ Don't try to render content until it's loaded
  if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;
  if (!content) return <div>No content found.</div>;

  // ✅ Build quotes array dynamically from content
  const quotes = [
    content.quote_1,
    content.quote_2,
    content.quote_3,
    content.quote_4,
    content.quote_5,
  ].filter(Boolean); // Remove empty or undefined values

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 scrnner-section">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12 heading1" data-aos="fade-up" data-aos-duration="800">
          <h5 data-aos="fade-left" data-aos-delay="100" className="light-title">Screener</h5><br />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 light-title" data-aos="fade-up" data-aos-delay="200">
            Screener & Fundamental Analysis
          </h2>
          <p className="text-xl text-indigo-600 font-medium mb-6 light-title" data-aos="zoom-in" data-aos-delay="300">
            Discover Hidden Gems with Our Advanced Stock Screener
          </p>
          <p className="text-lg text-gray-600 italic max-w-3xl mx-auto light-title" data-aos="fade-up" data-aos-delay="400">
            "Finding tomorrow's wealth creators in today's market opportunities"
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Quotes Section */}
          <div className="lg:w-1/2" data-aos="fade-right" data-aos-delay="100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-indigo-200 light-title" data-aos="fade-up" data-aos-delay="200">
              Fundamental Analysis Insights
            </h3>
            <div className="space-y-6">
              {quotes.map((text, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-indigo-400"
                  data-aos="fade-up"
                  data-aos-delay={300 + index * 100}
                >
                  <p className="text-gray-700 italic">"{text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Image Section */}
          <div className="lg:w-1/2" data-aos="fade-left" data-aos-delay="150">
            {content.screener_banner ? (
              <img
                src={`http://localhost:5000/uploads/content/${content.screener_banner}`}
                alt="Screener Banner"
                className="rounded-xl shadow-lg border border-gray-200"
              />
            ) : (
              <div className="text-center text-gray-500 italic">Screener image not available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>
        {`
        .quote-card:hover {
          transform: translateY(-3px);
        }
        .feature-item:hover .feature-icon {
          transform: scale(1.1);
          background-color: #6366f1;
          color: white;
        }
      `}</style>
    </section>
  );
};

export default ScreenerSection;
