import React, { useState, useEffect } from 'react';

const ProjectSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/testimonials');
        const data = await res.json();
        const approved = data.testimonials.filter(t => t.status === 'approved');
        setTestimonials(approved);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    };

    fetchTestimonials();
  }, []);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="project1-section py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 heading1">
          <h5 data-aos="fade-left" data-aos-duration="800">TESTIMONIALS</h5><br />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-0">
            Groundbreaking Projects Redefining Success
          </h2>
        </div>

        {/* Carousel + Image Row */}
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Testimonial Carousel */}
          <div className="w-full lg:w-1/2 relative overflow-hidden px-4 py-8 md:px-0">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4 md:px-0">
                  <div className="rounded-xl shadow-sm p-10 border border-gray-100 hover:border-yellow-100 transition-all position-relative">
                    <img src="/assets/img/all-images/bg/feature-one-shape-1.png" alt="" className="absolute top-0 right-0 testimonial-img" />
                    {/* Testimonial Header */}
                    <div className="flex items-center mb-6">
                      <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      <h5 className="text-yellow-600 text-lg font-medium uppercase tracking-wider">⭐⭐⭐⭐⭐</h5>
                    </div>

                    {/* Testimonial Content */}
                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                      "{testimonial.message}"
                    </p>

                    {/* Testimonial Author */}
                    <div className="flex items-center justify-end">
                      <div className="text-right mr-4">
                        <p className="text-gray-900 font-bold">{testimonial.name}, {testimonial.designation}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-yellow-500 w-12 h-12 flex items-center justify-center rounded-full shadow-lg border border-gray-200 text-gray-700 transition-all duration-300"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-yellow-500 w-12 h-12 flex items-center justify-center rounded-full shadow-lg border border-gray-200 text-gray-700 transition-all duration-300"
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Right: Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative">
              <div className="img1">
                <img
                  src="assets/img/all-images/project/project-img1.png"
                  alt=""
                  className="rounded-lg w-full"
                />
              </div>
              <img
                src="assets/img/elements/elements7.png"
                alt=""
                className="absolute animate-pulse project-animate-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;
