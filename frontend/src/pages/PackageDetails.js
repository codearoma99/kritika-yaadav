import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CommentSection from '../components/CommentSection';
import axios from 'axios';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packageData, setPackageData] = useState(null);

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(0);

  const userId = userData?.id;

  // Fetch tax percentage
  useEffect(() => {
    const fetchTax = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/taxes/package');

        // Log full tax objects for debug (optional)
        console.log('Fetched taxes:', res.data.taxes);

        // Just grab the first tax entry and get its percentage
        if (Array.isArray(res.data.taxes) && res.data.taxes.length > 0) {
          const taxPercentage = res.data.taxes[0].percentage;
          setGstPercentage(taxPercentage);
        } else {
          console.warn('No tax data found. Defaulting to 18%.');
          setGstPercentage(18); // fallback
        }

      } catch (err) {
        console.error('Failed to fetch tax info:', err);
        setGstPercentage(18); // fallback
      }
    };

    fetchTax();
  }, []);



  // Fetch package details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/packages/${id}/details`);
        if (!res.ok) {
          throw new Error('Failed to fetch package details');
        }
        const data = await res.json();
        setPackageData(data);
        // Initialize discounted price after package data is loaded
        setDiscountedPrice(data.package.price);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  // Check user login status and purchase status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserData(user);

        // Call API to check package purchase only if packageData is available
        if (packageData && packageData.package) {
          checkIfPackagePurchased(user.id, packageData.package.id);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [packageData]);

  const checkIfPackagePurchased = async (userId, packageId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/packages/check-purchase', {
        params: {
          userId,
          packageId
        }
      });

      setHasPurchased(response.data.purchased);
      console.log('Package purchased:', response.data.purchased);
    } catch (error) {
      console.error('Error checking purchase:', error);
    }
  };

  // Fetch coupons only after package data is available
  useEffect(() => {
    if (packageData && packageData.package) {
      const fetchCoupons = async () => {
        try {
          const res = await fetch(`/api/custom-coupons/visible?product_type=package&product_id=${packageData.package.id}`);
          const data = await res.json();
          setCoupons(data);
        } catch (err) {
          console.error('Failed to fetch coupons:', err);
        }
      };

      fetchCoupons();
    }
  }, [packageData]);

  const handleCouponSelect = (coupon) => {
    if (!packageData || !packageData.package) return;
    
    setSelectedCoupon(coupon);
    setManualCode('');
    
    let discounted;
    if (coupon.discount_type === 'percentage') {
      discounted = packageData.package.price - (packageData.package.price * coupon.amount) / 100;
    } else {
      discounted = packageData.package.price - coupon.amount;
    }

    setDiscountedPrice(Math.max(discounted, 0));
  };

  const handleApplyManualCode = async () => {
    const match = coupons.find(c => c.coupon_code === manualCode && c.status.startsWith('active'));
    if (match) {
      handleCouponSelect(match);
    } else {
      alert('Invalid or expired coupon code');
    }
  };

  const handleSubscribe = async () => {
    if (!packageData || !packageData.package || !packageData.package.price || !packageData.package.minimum_duration) {
      alert('Package details are not loaded properly.');
      return;
    }

    const pkg = packageData.package;
    
    const baseAmount = discountedPrice * pkg.minimum_duration;
    const gstAmount = baseAmount * (gstPercentage / 100);
    const totalAmount = baseAmount + gstAmount;
    const amountInPaise = Math.round(totalAmount * 100);

    try {
      const orderRes = await fetch('http://localhost:5000/api/payment/package-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInPaise })
      });
      const orderData = await orderRes.json();

      const options = {
        key: 'rzp_test_R7xdrdgK4j4Z3r',
        amount: orderData.amount,
        currency: 'INR',
        name: pkg.title,
        description: `Subscription for ${pkg.title}`,
        order_id: orderData.id,
        handler: async function (response) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);

          const user = JSON.parse(localStorage.getItem('user'));
          const user_id = user?.id;
          const package_id = pkg?.id;

          try {
            const res = await fetch('http://localhost:5000/api/purchase', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id,
                package_id,
                amount: totalAmount.toFixed(2),
                transaction_id: response.razorpay_payment_id,
              }),
            });

            const data = await res.json();

            if (res.ok) {
              alert('Purchase recorded successfully!');
              setHasPurchased(true);
            } else {
              alert('Payment done, but failed to record purchase: ' + data.message);
            }
          } catch (err) {
            alert('Payment done, but failed to record purchase.');
            console.error(err);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-10 bg-red-50 rounded-lg max-w-md">
        <div className="text-red-600 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-800 mb-2 mobile_ft">Error Loading Package</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
  
  if (!packageData || !packageData.package) return null;

  const { package: pkg, includes, faqs } = packageData;

  // MOVE THE CALCULATIONS HERE - after pkg is defined
  const perMonth = discountedPrice;
  const baseAmount = discountedPrice * pkg.minimum_duration;
  const gstAmount = baseAmount * (gstPercentage / 100);
  const totalAmount = baseAmount + gstAmount;
  const originalTotal = pkg.price * pkg.minimum_duration * 1.18;
  const savings = selectedCoupon ? (originalTotal - totalAmount) : 0;

  // Function to render HTML content safely
  const renderHTML = (html) => {
    const withCheckmarks = html.replace(
      /<li>(.*?)<\/li>/g,
      `<li>$1 <i class="fa-sharp-duotone fa-regular fa-circle-check text-green-500 "></i></li>`
    );
    return { __html: withCheckmarks };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
        <Header />
        <div
            className="bg-center bg-no-repeat bg-cover py-20"
            style={{ backgroundImage: "url('/assets/img/all-images/posters/br6.jpg')" }}
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center">
                <div className="text-center w-full">
                  <h2 className="text-4xl md:text-5xl font-bold text-white">{pkg.title}</h2>
                   <div className="my-6 mobile_mb-0"></div>
                  <a
                    href="/"
                    className=" text-lg inline-flex items-center gap-2 hover:text-white text-white"
                  >
                    Home <i className="fa-solid fa-angle-right"></i> <span className="opacity-80">Membership/{pkg.title}</span>
                  </a>
                </div>
              </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content Column */}
            <div className="flex-1">
              {/* Includes Section */}
              <section className="mb-12 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 pb-2 border-b-2 border-indigo-500 inline-block">
                  What's Included
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {includes.length > 0 ? (
                      includes.map((inc) => (
                      <div key={inc.id} className="border-l-4 border-indigo-400 pl-4 py-1 shadow-md rounded-lg include-checkbox">
                          <h3 className="text-xl font-semibold text-gray-800 mb-3">{inc.title}</h3>
                          <div
                          className="text-gray-700 prose prose-indigo max-w-none"
                          dangerouslySetInnerHTML={renderHTML(inc.includes)}
                          />
                      </div>
                      ))
                  ) : (
                      <p className="text-gray-500 italic col-span-2">No includes found for this package.</p>
                  )}
                </div>
              </section>
              
              {/* FAQ Section */}
              <section className="mb-12 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 pb-2 border-b-2 border-indigo-500 inline-block">
                  Frequently Asked Questions
                </h2>
                
                {faqs.length > 0 ? (
                  <div className="space-y-6">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-300">
                        <h3 className="font-dark-question text-gray-800 text-lg mb-1 flex items-start">
                          <span className="bg-indigo-100 text-indigo-600 rounded-full p-2 mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </span>
                          {faq.question}
                        </h3>
                        <p className="mt- text-gray-600 ml-10">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No FAQs available for this package.</p>
                )}
              </section>
               <CommentSection productType="package" productId={id} userId={userId} />
            </div>

            {/* Sidebar Column */}
            <div className="lg:w-80">
              <div className="sticky top-6 bg-gradient-to-br from-indigo-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Package Summary</h3>

                <div className="space-y-4">
                  {/* Price Breakdown */}
                  <div>
                    <span className="block text-sm opacity-80">Base Price (for {pkg.minimum_duration} months)</span>
                    <div className='d-flex'>
                      <span className="block text-lg font-semibold">₹{baseAmount.toFixed(2)} : </span>
                      <span className='block text-lg ml-2 font-semibold'>{perMonth}/Month</span>
                    </div>
                  </div>

                 <div>
  <span className="block text-sm opacity-80">GST ({gstPercentage}%)</span>
  <span className="block text-lg font-semibold">₹{gstAmount.toFixed(2)}</span>
</div>


                  <div>
                    <span className="block text-sm opacity-80">Total Payable</span>
                    <span className="block text-2xl font-bold">
                      ₹{totalAmount.toFixed(2)}
                      {selectedCoupon && (
                        <span className="text-sm line-through text-white text-opacity-60 ml-2">
                          ₹{originalTotal.toFixed(2)}
                        </span>
                      )}
                    </span>
                    {selectedCoupon && (
                      <span className="block text-sm text-green-300 font-medium">
                        You saved ₹{savings.toFixed(2)} with "{selectedCoupon.coupon_code}"
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="block text-sm opacity-80">Duration</span>
                    <span className="block text-lg font-semibold">{pkg.duration}</span>
                  </div>

                  <div>
                    <span className="block text-sm opacity-80">Minimum Commitment</span>
                    <span className="block text-lg font-semibold">{pkg.minimum_duration} months</span>
                  </div>

                  {/* Coupon Dropdown */}
                  {coupons.length > 0 && (
                    <div className="mt-6">
                      <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="border border-white border-opacity-30 rounded-lg px-4 py-2 bg-white bg-opacity-10 cursor-pointer flex justify-between items-center text-sm text-white hover:bg-opacity-20 transition"
                      >
                        <span>{selectedCoupon ? selectedCoupon.coupon_code : 'Select a coupon'}</span>
                        <svg
                          className={`w-4 h-4 transform transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {showDropdown && (
                        <div className="mt-2 bg-white text-gray-800 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                          {coupons
                            .filter(c => c.status.startsWith('active'))
                            .map(coupon => {
                              const isSelected = selectedCoupon?.id === coupon.id;
                              return (
                                <div
                                  key={coupon.id}
                                  onClick={() => {
                                    handleCouponSelect(coupon);
                                    setShowDropdown(false);
                                  }}
                                  className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                                    isSelected ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">{coupon.coupon_code}</span>
                                    <span className="text-green-600 font-semibold">
                                      {coupon.discount_type === 'percentage'
                                        ? `${coupon.amount}% OFF`
                                        : `₹${coupon.amount} OFF`}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}

                          {selectedCoupon && (
                            <div className="p-3 text-right bg-gray-50 border-t">
                              <button
                                onClick={() => {
                                  setSelectedCoupon(null);
                                  setDiscountedPrice(pkg.price);
                                  setManualCode('');
                                  setShowDropdown(false);
                                }}
                                className="text-sm text-red-600 font-semibold hover:underline"
                              >
                                Remove Coupon
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Manual Entry */}
                      <div className="flex items-center space-x-2 mt-3">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                          className="flex-1 px-3 py-2 rounded text-sm border border-white border-opacity-30 bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                          onClick={handleApplyManualCode}
                          className="px-3 py-2 text-sm bg-white text-indigo-700 font-semibold rounded hover:bg-gray-200 transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Subscribe Button */}
                  <div className="pt-4 border-t border-white border-opacity-20">
                    {isLoggedIn ? (
                      hasPurchased ? (
                        <button
                          className="w-full bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg shadow-md cursor-not-allowed"
                          disabled
                        >
                          Plan is Already Active
                        </button>
                      ) : (
                        <button
                          onClick={handleSubscribe}
                          className="w-full bg-white text-indigo-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Subscribe Now
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-white text-indigo-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      >
                        Login to Subscribe
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       <Footer />
    </div>
  );
};

export default PackageDetails;