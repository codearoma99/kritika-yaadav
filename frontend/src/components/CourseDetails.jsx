import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeVideo, setActiveVideo] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('id');

  // const faqs = [
  //   {
  //     id: 1,
  //     question: "Is this course suitable for beginners in penny stocks?",
  //     answer: "This course is designed for intermediate learners who understand basic stock market concepts. We recommend completing our 'Stock Market Basics' e-book first if you're completely new to investing."
  //   },
  //   {
  //     id: 2,
  //     question: "How much money do I need to start implementing these strategies?",
  //     answer: "You can start with as little as ₹10,000-₹25,000. The course teaches position sizing, so you'll learn how to allocate funds safely across multiple penny stock opportunities."
  //   }
  // ];

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(res.data);
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      }
    };

    const fetchModules = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}/modules`);
        setModules(res.data);
      } catch (error) {
        console.error('Failed to fetch modules:', error);
      }
    };

    if (courseId) {
      fetchCourseDetails();
      fetchModules();
    }
  }, [courseId]);

  const handleVideoChange = (index) => {
    setActiveVideo(index);
    const videoElement = document.getElementById('course-video');
    if (videoElement) {
      videoElement.load();
      videoElement.play().catch(e => console.log("Auto-play prevented", e));
    }
  };

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  if (!course) return <div className="p-8">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="background-primary text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">COURSE: {course.title}</h1>
          <p className="text-xl text-blue-200 mb-4">"{course.short_description}"</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-semibold">Price: ₹{course.price}</span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.timing} of Premium Content
            </span>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full">Level: {course.level}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video List */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-4">
              <div className="p-4 course-content-title text-white">
                <h3 className="font-bold text-lg">Course Content</h3>
                <p className="text-sm text-gray-300">{modules.length} videos</p>
              </div>
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
                {modules.map((module, index) => (
                  <div 
                    key={module.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition ${activeVideo === index ? 'bg-blue-50' : ''}`}
                    onClick={() => handleVideoChange(index)}
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={`http://localhost:5000/uploads/thumbnails/${module.video_thumbnail}`} 
                          alt={module.video_title} 
                          className="w-32 h-20 object-cover rounded"
                        />
                        <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                          {module.duration}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 line-clamp-2">{module.video_title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Video {index + 1}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Player & Modules */}
          <div className="lg:w-2/3">
            {/* Video Player */}
            {modules[activeVideo] && (
              <>
              <div className="bg-black rounded-xl overflow-hidden shadow-xl">
                <video 
                  id="course-video"
                  key={modules[activeVideo].id}
                  controls 
                  autoPlay
                  className="w-full aspect-video"
                >
                  <source src={`http://localhost:5000/uploads/videos/${modules[activeVideo].video_filename}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
                <div className="video-title p-4 mob_vi_ti">
                  <h2 className="text-xl font-semibold">{modules[activeVideo].video_title}</h2>
                </div>
              </>
            )}

            {/* Overview */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6 mp_pt-course0">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Overview</h2>
              <p className="text-gray-600">{course.course_overview}</p>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Modules</h2>
            <div className="space-y-4">
              {modules.map((module, index) => (
              <div
                key={module.id}
                className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  Module {index + 1}: {module.title}
                </h3>

                {/* Render HTML content from description */}
                <div
                  className="mt-2 space-y-1 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: module.description }}
                />
              </div>
            ))}

  </div>
</div>


            {/* FAQ Section */}
            {/* <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">FAQ - MULTIBAGGER PENNY STOCKS COURSE</h2>
              
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-200 pb-4">
                    <button
                      className="flex justify-between items-center w-full text-left font-semibold text-gray-800 hover:text-blue-600 focus:outline-none"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span>{faq.question}</span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${activeFaq === faq.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeFaq === faq.id && (
                      <div className="mt-2 text-gray-600">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
