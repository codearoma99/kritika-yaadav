import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const PremiumCoursesList = ({ limit }) => {
  const [courses, setCourses] = useState([]);
  const [ratingsData, setRatingsData] = useState({}); // { courseId: { avg_rating, review_count } }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const fetchCoursesAndRatings = async () => {
      try {
        setLoading(true);

        // Fetch courses
        const coursesResponse = await axios.get('http://localhost:5000/api/courses');
        let fetchedCourses = coursesResponse.data;

        // Apply limit if provided
        if (limit) {
          fetchedCourses = fetchedCourses.slice(0, limit);
        }

        setCourses(fetchedCourses);

        // Fetch ratings for the fetched courses
        const courseIds = fetchedCourses.map(course => course.id);

        if (courseIds.length > 0) {
          const ratingsResponse = await axios.post('http://localhost:5000/api/reviews/courses', { courseIds });
          setRatingsData(ratingsResponse.data || {});
        } else {
          setRatingsData({});
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses or ratings:', error);
        setLoading(false);
      }
    };

    fetchCoursesAndRatings();
  }, [limit]);

  if (loading) {
    return <div className="text-center py-20">Loading courses...</div>;
  }

  return (
    <div className="courses-section-area py-16 bg-center bg-no-repeat bg-cover">
      <div className="container mx-auto px-4">
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {courses.map((course) => {
            // Get dynamic rating data or fallback to default values
            const rating = ratingsData[course.id]?.avg_rating || 4.2;
            const reviewCount = ratingsData[course.id]?.review_count || 15;

            return (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 course-boxarea"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:5000/uploads/thumbnails/${course.thumbnail}`} // dynamically loaded
                    alt={course.title}
                    className="w-full object-cover rounded-t-lg"
                    style={{ height: '400px' }} // Fixed height for consistency
                  />
                  {course.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center">
                    <h3 className="text-xl font-semibold text-gray-800 capitalize">
                      {course.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 course-description mb-4">
                    {course.short_description}
                  </p>
                  {/* Rating Section */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center space-x-1 mr-2">
                      {[1, 2, 3, 4, 5].map(star => {
                        let icon = faStar;
                        if (star === Math.ceil(rating) && rating % 1 !== 0) {
                          icon = faStarHalfAlt;
                        }
                        const color = star <= rating ? 'text-yellow-400' : 'text-gray-300';
                        return (
                          <FontAwesomeIcon
                            key={star}
                            icon={icon}
                            className={color}
                            size="xs"
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm font-medium text-gray-700 mr-1">{rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{course.price}
                    </span>
                    <a
                      href={`/course-info?id=${course.id}`}
                      className="vl-btn1 inline-block bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PremiumCoursesList;