import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import CommentSection from './CommentSection';

const CourseInfo = () => {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gstPercentage, setGstPercentage] = useState(0);

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const { search } = useLocation();
  const courseId = new URLSearchParams(search).get('id');

  const userId = user?.id;
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(0);


  // Fetch course tax
  useEffect(() => {
    const fetchCourseTax = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/taxes/course');

        // Optional: Debug output
        console.log('Fetched course taxes:', res.data.taxes);

        if (Array.isArray(res.data.taxes) && res.data.taxes.length > 0) {
          const taxPercentage = res.data.taxes[0].percentage;
          setGstPercentage(taxPercentage); // or setCourseGstPercentage if separate
          console.log('GST Percentage set to:', taxPercentage);
        } else {
          console.warn('No course tax found. Defaulting to 18%.');
          setGstPercentage(18); // fallback
        }

      } catch (err) {
        console.error('Failed to fetch course tax info:', err);
        setGstPercentage(18); // fallback
      }
    };

    fetchCourseTax();
  }, []);

const gstAmount = Number(discountedPrice) * (Number(gstPercentage) / 100);
const finalPrice = Number(discountedPrice) + gstAmount;

console.log("GST Amount:", gstAmount.toFixed(2));
console.log("Final price:", finalPrice.toFixed(2));



  // Load user data from localStorage once on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Error parsing user data', e);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch course and modules
  useEffect(() => {
    if (!courseId) {
      setError('No course ID provided in URL.');
      setLoading(false);
      return;
    }

    const fetchCourseData = async () => {
      try {
        const [courseRes, modulesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/courses/${courseId}`),
          fetch(`http://localhost:5000/api/courses/${courseId}/modules`),
        ]);

        if (!courseRes.ok) throw new Error('Course not found');

        const courseData = await courseRes.json();
        const modulesData = modulesRes.ok ? await modulesRes.json() : [];

        setCourse(courseData);
        setModules(modulesData);
        // Initialize discounted price with course price once course is loaded
        setDiscountedPrice(courseData.price || 0);
      } catch (err) {
        setError(err.message || 'Error loading course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Fetch purchase status for logged in user
  useEffect(() => {
    const fetchPurchaseStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!userId) {
          console.warn('User ID not found');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}/purchase-status`,
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
              'x-user-id': userId,
            },
          }
        );

        setHasPurchased(response.data.hasPurchased);
      } catch (err) {
        console.error('Error checking purchase status:', err);
      }
    };

    if (isLoggedIn && courseId && userId) {
      fetchPurchaseStatus();
    }
  }, [isLoggedIn, courseId, userId]);

  // Check if course is already in cart
  useEffect(() => {
    const checkCourseInCart = async () => {
      try {
        if (!userId || !courseId) return;

        const response = await axios.get(
          `http://localhost:5000/api/courses/check-course-in-cart`,
          {
            params: {
              user_id: userId,
              course_id: courseId,
            },
          }
        );

        setIsInCart(response.data.inCart);
      } catch (err) {
        console.error('Error checking cart status:', err);
      }
    };

    if (userId && courseId) {
      checkCourseInCart();
    }
  }, [userId, courseId]);

  // Handle payment 
  const handlePayment = async () => {
    if (!course || !user) return;
    
    const userId = user.id;
    const courseId = course.id;
    const amountInPaise = discountedPrice > 0 ? discountedPrice * 100 : course.price * 100;
    

    const options = {
      key: 'rzp_test_R7xdrdgK4j4Z3r',
      amount: amountInPaise,
      currency: 'INR',
      name: 'Market Maestroo',
      description: course.title,
      handler: async function (response) {
        // Payment successful, now save to DB
        try {
          const res = await fetch('http://localhost:5000/api/purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              course_id: courseId,
              payment_id: response.razorpay_payment_id,
              product_amount: discountedPrice > 0 ? discountedPrice : course.price,
              coupon_id: selectedCoupon?.coupon_id || null,
            }),
          });

          const data = await res.json();
          if (data.success) {
            alert('Purchase recorded successfully!');
            setHasPurchased(true);
          } else {
            alert('Payment succeeded but failed to save purchase.');
          }
        } catch (err) {
          console.error('Error saving purchase:', err);
          alert('Error saving purchase');
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

// Coupon code management 
useEffect(() => {
  const fetchCoupons = async () => {
    try {
      console.log(`[fetchCoupons] Fetching coupons for product_type=course and product_id=${courseId}...`);
      const res = await fetch(`http://localhost:5000/api/custom-coupons/visible?product_type=course&product_id=${courseId}`);
      const data = await res.json();
      console.log(`[fetchCoupons] Received ${data.length} coupons:`, data);
      setCoupons(data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  if (courseId) {
    fetchCoupons();
  }
}, [courseId]);


const calculateDiscountedPrice = (coupon) => {
  if (!course) {
    console.warn('[calculateDiscountedPrice] No course data available');
    return 0;
  }

  const price = Number(course.price);
  if (isNaN(price)) {
    console.warn('[calculateDiscountedPrice] No valid course price');
    return 0;
  }

  console.log('[calculateDiscountedPrice] course.price:', price);
  console.log('[calculateDiscountedPrice] coupon.amount:', coupon.amount);

  let discountedPrice = 0;

  if (coupon.discount_type === 'percentage') {
    discountedPrice = price - (price * coupon.amount) / 100;
    console.log(`[calculateDiscountedPrice] Percentage discount: ${coupon.amount}% off on ₹${price} = ₹${discountedPrice}`);
  } else {
    discountedPrice = price - coupon.amount;
    console.log(`[calculateDiscountedPrice] Fixed discount: ₹${coupon.amount} off on ₹${price} = ₹${discountedPrice}`);
  }

  discountedPrice = discountedPrice > 0 ? discountedPrice : 0;

  return discountedPrice;
};


const handleCouponSelect = (coupon) => {
  if (!course) {
    console.warn('[handleCouponSelect] No course data available, cannot apply coupon');
    return;
  }

  console.log('[handleCouponSelect] Selected coupon:', coupon);

  // Removed minimum amount check completely

  setSelectedCoupon(coupon);
  const newPrice = calculateDiscountedPrice(coupon);
  console.log('[handleCouponSelect] Discounted price calculated:', newPrice);
  setDiscountedPrice(newPrice > 0 ? newPrice : 0);
};

const handleApplyManualCode = () => {
  console.log('[handleApplyManualCode] Trying manual coupon code:', manualCode);

  const foundCoupon = coupons.find(
    coupon => coupon.coupon_code.toLowerCase() === manualCode.toLowerCase()
  );

  if (!foundCoupon) {
    console.warn('[handleApplyManualCode] Invalid coupon code:', manualCode);
    alert('Invalid coupon code');
    return;
  }

  console.log('[handleApplyManualCode] Found coupon for manual code:', foundCoupon);
  handleCouponSelect(foundCoupon);
};



  // Add course to cart
  const handleAddToCart = async () => {
    try {
      if (!userId || !courseId || !course) {
        alert('You must be logged in to add to cart');
        return;
      }

      const response = await axios.post(`http://localhost:5000/api/courses/add-to-cart`, {
        user_id: userId,
        course_id: courseId,
        price: course.price,
      });

      if (response.status === 201) {
        alert('Course added to cart');
        setIsInCart(true);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert('Course already in cart');
        setIsInCart(true);
      } else {
        console.error('Add to cart error:', error);
        alert('Could not add course to cart.');
      }
    }
  };

  // Safe data access functions
  const getSafeArrayFromHtml = (htmlString) => {
    if (!htmlString) return [];
    return htmlString
      .replace(/<\/?ul>/g, '')
      .split(/<\/li>\s*<li>/g)
      .map(item => item.replace(/<\/?li>/g, '').trim())
      .filter(item => item);
  };

  if (loading) return <div className="text-center py-20">Loading course info...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!course) return <div className="text-center py-20">Course not found.</div>;
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="background-primary text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{course.title || 'Untitled Course'}</h1>
          <p className="text-xl text-blue-200 mb-4">{course.short_description || ''}</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-semibold">
              Price: ₹{course.price || 0}
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.timing || 'Flexible'}
            </span>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full">
              Level: {course.level || 'All Levels'}
            </span>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side */}
          <div className="lg:w-2/3 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Overview</h2>
              <div
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: course.course_overview || 'No overview available.' }}
              ></div>

              {/* What You'll Learn */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-4">What You'll Learn:</h2>
              <ul className="space-y-2 mb-6">
                {getSafeArrayFromHtml(course.what_you_will_learn).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
                {getSafeArrayFromHtml(course.what_you_will_learn).length === 0 && (
                  <li className="text-gray-500">No learning objectives listed.</li>
                )}
              </ul>

              {/* Requirements */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Requirements:</h2>
              <ul className="space-y-2 mb-6">
                {getSafeArrayFromHtml(course.requirements).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
                {getSafeArrayFromHtml(course.requirements).length === 0 && (
                  <li className="text-gray-500">No requirements listed.</li>
                )}
              </ul>
            </div>

            {/* Curriculum / Modules */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Curriculum</h2>
              <div className="space-y-4">
                {modules.length > 0 ? (
                  modules.map((mod, index) => {
                    const colorClasses = [
                      { border: 'border-blue-500', bg: 'bg-blue-50' },
                      { border: 'border-purple-500', bg: 'bg-purple-50' },
                      { border: 'border-green-500', bg: 'bg-green-50' },
                      { border: 'border-yellow-500', bg: 'bg-yellow-50' },
                      { border: 'border-pink-500', bg: 'bg-pink-50' },
                    ];

                    const color = colorClasses[index % colorClasses.length];

                    return (
                      <div
                        key={mod.id}
                        className={`border-l-4 ${color.border} pl-4 py-2 ${color.bg} rounded-r`}
                      >
                        <h3 className="text-xl font-semibold text-gray-800">{mod.title}</h3>
                        <ul className="mt-2 space-y-1 text-gray-600">
                          {getSafeArrayFromHtml(mod.description).map((item, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mt-2 mr-2"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                          {getSafeArrayFromHtml(mod.description).length === 0 && (
                            <li className="text-gray-500">No description available.</li>
                          )}
                        </ul>
                      </div>
                    );
                  })
                ) : (
                  <p>No modules available for this course.</p>
                )}
              </div>
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">About the Instructor</h2>
                <div className="flex items-start gap-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{course.instructor.name}</h3>
                    <p className="text-gray-600 mb-2">{course.instructor.bio}</p>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(course.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-gray-600">
                        {course.rating || 0} ({course.students || 0}+ students)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Comments Section */}
            <CommentSection productType="course" productId={courseId} userId={userId} />
          </div>

          {/* Right Side – Enrollment Card */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-4">
              <img 
                src={course.thumbnail ? `http://localhost:5000${course.thumbnail}` : '/placeholder-thumbnail.jpg'} 
                alt={course.title} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  {selectedCoupon ? (
                    <>
                      <span className="text-3xl font-bold text-gray-800 line-through mr-2">
                        ₹{course.price}<small>{gstAmount.toFixed(2)}</small>
                      </span>
                      <span className="text-3xl font-bold text-green-600">
                        ₹{discountedPrice}+ <small>{gstAmount.toFixed(2)}</small>
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-800">
                      ₹{course.price}  <small className='text-sm text-muted'>+ {gstAmount.toFixed(2)} Tax</small>
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{modules.length} lessons</span>
                </div>

                {/* Conditional Purchase / Cart Buttons */}
                {isLoggedIn ? (
                  <>
                    {hasPurchased ? (
                      <Link to={`/course-detail?id=${course.id}`}>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-center transition mb-2">
                          Go to Learning Page
                        </button>
                      </Link>
                    ) : (
                      <>
                        {isInCart ? (
                          <Link to="/cart">
                            <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-medium transition mb-2">
                              Go to Cart
                            </button>
                          </Link>
                        ) : (
                          <button
                            onClick={handleAddToCart}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-center transition mb-2"
                          >
                            Add to Cart
                          </button>
                        )}
                      </>
                    )}

                    {/* Coupon Section */}
                    {coupons.length > 0 && (
                      <div className="mb-4 relative">
                        {/* Dropdown Toggle */}
                        <div
                          className="border border-gray-300 rounded-lg px-4 py-3 bg-white cursor-pointer hover:shadow-sm transition flex justify-between items-center"
                          onClick={() => setShowDropdown(!showDropdown)}
                        >
                          <span className="text-sm text-gray-800 font-medium">
                            {selectedCoupon ? selectedCoupon.coupon_code : 'Select a coupon'}
                          </span>
                          <svg
                            className={`w-4 h-4 ml-2 transform transition-transform ${
                              showDropdown ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                            {coupons.filter(coupon => coupon.status === 'active').length === 0 ? (
                              <div className="p-4 text-center text-gray-500">
                                No coupons available
                              </div>
                            ) : (
                              coupons
                                .filter(coupon => coupon.status === 'active')
                                .map(coupon => {
                                  const isSelected = selectedCoupon?.id === coupon.id;

                                  return (
                                    <div
                                      key={coupon.id}
                                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${
                                        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                      }`}
                                      onClick={() => {
                                        handleCouponSelect(coupon);
                                        setShowDropdown(false); // Close dropdown on select
                                      }}
                                    >
                                      <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-800">{coupon.coupon_code}</span>
                                        <span className="text-green-600 font-semibold">
                                          {coupon.discount_type === 'percentage'
                                            ? `${coupon.amount}% OFF`
                                            : `₹${coupon.amount} OFF`}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })
                            )}

                            {/* Remove Selected Coupon */}
                            {selectedCoupon && (
                              <div className="p-4 text-right border-t border-gray-200 bg-gray-50">
                                <button
                                  onClick={() => {
                                    setSelectedCoupon(null);
                                    setDiscountedPrice(course.price);
                                    setManualCode('');
                                    setShowDropdown(false);
                                  }}
                                  className="text-red-600 text-sm font-medium hover:underline"
                                >
                                  Remove Coupon
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Manual Code Entry */}
                        <div className="flex items-center space-x-2 mt-4">
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <button
                            onClick={handleApplyManualCode}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}



                    {!hasPurchased && (
                      <button 
                        className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-medium transition mb-2"
                        onClick={handlePayment}
                      >
                        Buy Now
                      </button>
                    )}
                  </>
                ) : (
                  <Link to="/login" className="block w-full">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium text-center transition">
                      Login to Continue
                    </button>
                  </Link>
                )}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">This course includes:</h3>
                  <ul className="space-y-2 mb-6">
                    {getSafeArrayFromHtml(course.course_includes).map((item, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                    {getSafeArrayFromHtml(course.course_includes).length === 0 && (
                      <li className="text-gray-500">No course features listed.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;