// frontend/src/pages/CartPage.js

import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isCouponDropdownOpen, setIsCouponDropdownOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const [courseRes, ebookRes] = await Promise.all([
          fetch(`http://localhost:5000/api/courses/cart/${userId}`),
          fetch(`http://localhost:5000/api/ebooks/cart/${userId}`),
        ]);

        if (!courseRes.ok || !ebookRes.ok) {
          throw new Error('Failed to fetch cart items');
        }

        const [courses, ebooks] = await Promise.all([
          courseRes.json(),
          ebookRes.json(),
        ]);

        const formattedCourses = courses.map(item => ({
          id: item.id,
          type: 'course',
          product_id: item.course_id,
          title: item.title,
          description: item.short_description,
          price: item.price,
          image: `/uploads/thumbnails/${item.thumbnail}`,
        }));

        const formattedEbooks = ebooks.map(item => ({
          id: item.id,
          type: 'ebook',
          product_id: item.course_id,
          title: item.title,
          description: item.description,
          price: item.price,
          image: `/uploads/ebooks/${item.ebook}`, // adjust path if needed
        }));

        setCartItems([...formattedCourses, ...formattedEbooks]);
      } catch (err) {
        console.error('Cart fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/coupons');
      const json = await res.json();
      if (res.ok) setCoupons(json.data);
      else throw new Error('Failed to load coupons');
    } catch (err) {
      console.error(err);
    }
  };

  // Automatically apply best coupon when cart items or coupons change
  useEffect(() => {
    if (cartItems.length > 0 && coupons.length > 0) {
      applyBestCoupon();
    }
  }, [cartItems, coupons]);

  const applyBestCoupon = () => {
    const applicableCoupons = coupons.filter(coupon => 
      subtotal >= coupon.minimum_amount && 
      (coupon.use_number_of_times === null || coupon.use_number_of_times > 0)
    );

    if (applicableCoupons.length === 0) {
      setSelectedCoupon(null);
      return;
    }

    // Find the coupon that gives maximum discount
    const bestCoupon = applicableCoupons.reduce((best, current) => {
      const currentDiscount = calculateDiscount(current);
      const bestDiscount = calculateDiscount(best);
      return currentDiscount > bestDiscount ? current : best;
    });

    setSelectedCoupon(bestCoupon);
  };

  const calculateDiscount = (coupon) => {
    if (!coupon) return 0;
    if (coupon.discount_type === 'percentage') {
      return subtotal * (coupon.discount_value / 100);
    } else if (coupon.discount_type === 'amount') {
      return coupon.discount_value;
    }
    return 0;
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/cart/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove item');

      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Could not remove item from cart.');
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 5000 ? 0 : 200;
  
  // Calculate discount based on selected coupon
  let discount = 0;
  if (selectedCoupon) {
    discount = calculateDiscount(selectedCoupon);
  }
  
  const total = subtotal + tax + shipping - discount;

  const formatINR = (value) => {
    const num = Number(value) || 0;
    return `₹${num.toFixed(2).toLocaleString('en-IN')}`;
  };

  const handleCouponSelect = (coupon) => {
    if (subtotal < coupon.minimum_amount) {
      alert(`Minimum ₹${coupon.minimum_amount} required to apply this coupon.`);
      return;
    }
    if (coupon.use_number_of_times !== null && coupon.use_number_of_times <= 0) {
      alert('This coupon has reached its usage limit.');
      return;
    }
    
    setSelectedCoupon(coupon);
    setIsCouponDropdownOpen(false);
  };

  const handlePayment = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total) * 100 }), // amount in paise
      });

      if (!res.ok) throw new Error('Failed to create order');

      const data = await res.json();

      const options = {
        key: 'rzp_test_R7xdrdgK4j4Z3r',
        amount: data.amount,
        currency: data.currency,
        name: 'Market Maestroo',
        description: 'Purchase',
        image: '/logo.png',
        order_id: data.id,

        handler: async function (response) {
          alert("✅ Payment Successful!");
          console.log('Razorpay Response:', response);

          try {
            setIsProcessing(true); // ✅ Start loading

            const purchases = cartItems.map(item => ({
              product_id: item.product_id,
              product_type: item.type,
              price: item.price,
              cart_item_id: item.id,
            }));

            const purchaseRes = await fetch('http://localhost:5000/api/payment/record-purchase', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: userId,
                purchases,
                payment_id: response.razorpay_payment_id,
              }),
            });

            if (!purchaseRes.ok) throw new Error('Failed to save purchases');

            setCartItems([]); // ✅ Clear frontend cart
            alert('✅ Purchase recorded and cart cleared!');

          } catch (purchaseError) {
            console.error('Error processing purchases:', purchaseError);
            alert('Payment was successful but failed to record purchases.');
          } finally {
            setIsProcessing(false); // ✅ Stop loading
          }
        },

        prefill: {
          name: user?.name || "Student",
          email: user?.email || "",
        },
        theme: { color: '#000000' },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error('❌ Payment initiation failed:', err);
      alert('Payment could not be started');
    }
  };

  if (loading) {
    return (
      <>
        <div className="bg-center bg-no-repeat bg-cover py-20" style={{ backgroundImage: "url('assets/img/all-images/posters/br8.png')" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center">
              <div className="text-center w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white">Cart</h2>
                <a href="/" className="text-lg inline-flex items-center gap-2 text-white mt-4">
                  Home <i className="fa-solid fa-angle-right"></i> Cart
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
          <p>Loading your cart...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="bg-center bg-no-repeat bg-cover py-20" style={{ backgroundImage: "url('assets/img/all-images/posters/br8.png')" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center">
              <div className="text-center w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white">Cart</h2>
                <a href="/" className="text-lg inline-flex items-center gap-2 text-white mt-4">
                  Home <i className="fa-solid fa-angle-right"></i> Cart
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto my-16 px-4 py-16 max-w-2xl text-center bg-blue-50 border border-blue-100 rounded-lg shadow-md">
          <div className="text-blue-500 text-6xl mb-4">
            <i className="fas fa-user-circle"></i>
          </div>
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">You're not logged in</h2>
          <p className="text-blue-600 mb-6">
            Please log in to view your cart and continue with your purchase.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            <i className="fas fa-sign-in-alt mr-2"></i> Login
          </a>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
        <div className="bg-center bg-no-repeat bg-cover py-20" style={{ backgroundImage: "url('assets/img/all-images/posters/br8.png')" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center">
              <div className="text-center w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white">Cart</h2>
                <a href="/" className="text-lg inline-flex items-center gap-2 text-white mt-4">
                  Home <i className="fa-solid fa-angle-right"></i> Cart
                </a>
              </div>
            </div>
          </div>
        </div>

        {isProcessing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div
                className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col items-center space-y-4">
                  <svg
                    className="animate-spin h-10 w-10 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>

                  <h2 className="text-lg font-semibold">Processing Your Order...</h2>
                  <p className="text-gray-600 text-sm">Sending invoice and clearing your cart. Please wait.</p>
                </div>
              </div>
            </div>
          )}

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-lg mb-6">Your cart is empty</p>
              <a href='/courses'>
                <button className="bg-white text-blue-500 border border-blue-500 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
                  Continue Shopping
                </button>
              </a>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-6">
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-gray-600 font-medium">
                  <div className="col-span-8">Item</div>
                  <div className="col-span-4 text-right">Price</div>
                </div>

                {cartItems.map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 py-6 border-b border-gray-100">
                    <div className="col-span-12 md:col-span-8 flex items-start gap-4">
                      {item.type === 'ebook' ? (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md text-blue-600 text-3xl">
                          <i className="fa-solid fa-book-open"></i>
                        </div>
                      ) : (
                        <img
                          src={`http://localhost:5000${item.image}`}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}

                      <div>
                        <h3 className="font-medium text-gray-800">
                          {item.title} {item.type === 'ebook' && <span className="text-sm text-gray-400">(eBook)</span>}
                        </h3>
                        <p className="text-sm text-gray-600 hidden md:block">{item.description}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 text-sm hover:text-red-700 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-4 text-gray-700 text-right flex md:block justify-between">
                      <span className="md:hidden font-medium">Price</span>
                      <span className="font-medium">{formatINR(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3 bg-white rounded-lg shadow-sm p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  
                  {selectedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-gray-600">Discount ({selectedCoupon.coupon_code})</span>
                      <span>-{formatINR(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span>{formatINR(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatINR(total)}</span>
                  </div>
                  {/* Coupons Section - Zomato/Swiggy Style */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">Apply Coupon</h3>
                    {selectedCoupon && (
                      <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                        Applied: {selectedCoupon.coupon_code}
                      </span>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div 
                      className="border border-gray-300 rounded-lg p-3 cursor-pointer bg-white hover:border-gray-400 transition-colors"
                      onClick={() => setIsCouponDropdownOpen(!isCouponDropdownOpen)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          {selectedCoupon ? `Applied: ${selectedCoupon.coupon_code}` : 'Select a coupon'}
                        </span>
                        <i className={`fas fa-chevron-${isCouponDropdownOpen ? 'up' : 'down'} text-gray-500`}></i>
                      </div>
                    </div>

                    {isCouponDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                        {coupons.filter(coupon => 
                          subtotal >= coupon.minimum_amount && 
                          (coupon.use_number_of_times === null || coupon.use_number_of_times > 0)
                        ).length === 0 ? (
                          <div className="p-3 text-center text-gray-500">
                            No coupons available
                          </div>
                        ) : (
                          coupons
                            .filter(coupon => 
                              subtotal >= coupon.minimum_amount && 
                              (coupon.use_number_of_times === null || coupon.use_number_of_times > 0)
                            )
                            .map(coupon => (
                              <div 
                                key={coupon.coupon_id}
                                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                  selectedCoupon?.coupon_id === coupon.coupon_id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                                onClick={() => handleCouponSelect(coupon)}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-medium text-gray-800">{coupon.coupon_code}</span>
                                  <span className="text-green-600 font-semibold">
                                    {coupon.discount_type === 'percentage' 
                                      ? `${coupon.discount_value}% OFF` 
                                      : `₹${coupon.discount_value} OFF`}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{coupon.description}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  <span>Min. order: ₹{coupon.minimum_amount}</span>
                                  {coupon.use_number_of_times !== null && (
                                    <span>Uses left: {coupon.use_number_of_times}</span>
                                  )}
                                </div>
                                {selectedCoupon?.coupon_id === coupon.coupon_id && (
                                  <div className="flex items-center mt-2 text-green-600 text-sm">
                                    <i className="fas fa-check-circle mr-1"></i>
                                    <span>Applied</span>
                                  </div>
                                )}
                              </div>
                            ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Applied Coupon Details */}
                  {selectedCoupon && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-green-800">{selectedCoupon.coupon_code}</span>
                          <span className="text-green-600 ml-2">
                            • {selectedCoupon.discount_type === 'percentage' 
                                ? `${selectedCoupon.discount_value}% OFF` 
                                : `₹${selectedCoupon.discount_value} OFF`}
                          </span>
                        </div>
                        <button 
                          onClick={() => setSelectedCoupon(null)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm text-green-700 mt-1">You save {formatINR(discount)}</p>
                    </div>
                  )}
                </div>

                  <button
                    onClick={handlePayment}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mt-6"
                  >
                    Proceed to Checkout
                  </button>

                  <button className="w-full bg-white text-blue-600 border border-blue-600 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors">
                    Continue Shopping
                  </button>
                </div>

                
              </div>
            </div>
          )}
        </div>
      <Footer />
    </>
  );
};

export default CartPage;