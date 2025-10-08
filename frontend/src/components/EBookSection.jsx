import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faShoppingCart,
  faFilePdf,
  faFileAlt,
  faStar,
  faFire,
  faPen,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';
import axios from 'axios';

const EbooksSection = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [purchasedEbookIds, setPurchasedEbookIds] = useState([]);
  const [cartEbookIds, setCartEbookIds] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentEbook, setCurrentEbook] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedEbookId, setSelectedEbookId] = useState(null);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [selectedEbookForPurchase, setSelectedEbookForPurchase] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const user_id = user?.id;
  const [gstPercentage, setGstPercentage] = useState(0);


  // Fetch Taxes
  useEffect(() => {
    const fetchEbookTax = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/taxes/ebook');

        // Debug (optional)
        console.log('Fetched ebook taxes:', res.data.taxes);

        if (Array.isArray(res.data.taxes) && res.data.taxes.length > 0) {
          const ebookTaxPercentage = res.data.taxes[0].percentage;
          setGstPercentage(ebookTaxPercentage); // Or use separate state if needed
        } else {
          console.warn('No ebook tax found. Defaulting to 18%.');
          setGstPercentage(18); // Optional fallback
        }

      } catch (err) {
        console.error('Failed to fetch ebook tax info:', err);
        setGstPercentage(18); // Optional fallback
      }
    };

    fetchEbookTax();
  }, []);


  const getEbookIcon = (title) =>
    title.toLowerCase().includes('guide') ? faFileAlt : faFilePdf;

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case "Popular":
        return faFire;
      case "Bestseller":
        return faStar;
      default:
        return faStar;
    }
  };

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ebooks");
        if (!response.ok) throw new Error("Failed to load ebooks");
        const data = await response.json();
        setEbooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPurchases = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payment/purchases/${user_id}`);
        const data = await res.json();
        const purchasedIds = data
          .filter(item => item.product_type === 'ebook')
          .map(item => item.course_id);
        setPurchasedEbookIds(purchasedIds);
      } catch (err) {
        console.error('Failed to fetch purchases', err);
      }
    };

    const fetchCartItems = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ebooks/cart/${user_id}`);
        const data = await res.json();
        const cartIds = data.map(item => item.course_id);
        setCartEbookIds(cartIds);
      } catch (err) {
        console.error('Failed to fetch cart items', err);
      }
    };

    fetchEbooks();
    if (user_id) {
      fetchPurchases();
      fetchCartItems();
    }
  }, [user_id]);

  // Fetch coupons for Buy Now modal
  useEffect(() => {
    if (selectedEbookForPurchase) {
      const fetchCoupons = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/custom-coupons/visible?product_type=ebook&product_id=${selectedEbookForPurchase.id}`);
          const data = await res.json();
          setCoupons(data);
          setDiscountedPrice(Number(selectedEbookForPurchase.price) || 0);
        } catch (err) {
          console.error('Failed to fetch coupons:', err);
        }
      };

      fetchCoupons();
    }
  }, [selectedEbookForPurchase]);

  const handleCouponSelect = (coupon) => {
    if (!selectedEbookForPurchase) return;

    setSelectedCoupon(coupon);
    setManualCode('');

    const price = Number(selectedEbookForPurchase.price) || 0;
    let discounted;
    if (coupon.discount_type === 'percentage') {
      discounted = price - (price * coupon.amount) / 100;
    } else {
      discounted = price - coupon.amount;
    }

    setDiscountedPrice(Math.max(Number(discounted) || 0, 0));
  };

  const handleApplyManualCode = async () => {
    const match = coupons.find(c => c.coupon_code === manualCode && c.status.startsWith('active'));
    if (match) {
      handleCouponSelect(match);
    } else {
      alert('Invalid or expired coupon code');
    }
  };

  const addToCart = async (ebook) => {
    setCartMessage(null);
    try {
      const response = await fetch('http://localhost:5000/api/ebooks/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          course_id: ebook.id,
          price: Number(ebook.price) || 0
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setCartMessage(data.message || 'Failed to add ebook to cart');
      } else {
        setCartMessage('Ebook added to cart successfully!');
        setCartEbookIds(prev => [...prev, ebook.id]);
      }
    } catch (err) {
      setCartMessage('Server error: ' + err.message);
    }
  };

  const openBuyNowModal = (ebook) => {
    setSelectedEbookForPurchase(ebook);
    setSelectedCoupon(null);
    setDiscountedPrice(Number(ebook.price) || 0);
    setShowBuyNowModal(true);
  };

  const closeBuyNowModal = () => {
    setShowBuyNowModal(false);
    setSelectedEbookForPurchase(null);
    setSelectedCoupon(null);
    setManualCode('');
  };

const handleBuyNow = async () => {
  if (!selectedEbookForPurchase) return;

  const baseAmount = Number(discountedPrice) || 0;
  const gst = baseAmount * 0.18;
  const total = baseAmount + gst;
  const amountInPaise = Math.round(total * 100);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  if (!userId) {
    alert('User not logged in.');
    return;
  }

  try {
    // Step 1: Create Razorpay order
    const orderRes = await fetch('http://localhost:5000/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountInPaise }),
    });

    const orderData = await orderRes.json();

    // Step 2: Razorpay checkout options
    const options = {
      key: 'rzp_test_R7xdrdgK4j4Z3r',
      amount: orderData.amount,
      currency: 'INR',
      name: selectedEbookForPurchase.title,
      description: `Purchase of ${selectedEbookForPurchase.title}`,
      order_id: orderData.id,

    handler: async function (response) {
  alert(`✅ Payment successful! Payment ID: ${response.razorpay_payment_id}`);

  //  Start loader
  setIsProcessingPurchase(true);

  try {
    const purchasePayload = {
      userId,
      payment_id: response.razorpay_payment_id,
      purchases: [
        {
          product_id: selectedEbookForPurchase.id,
          product_type: 'ebook',
          price: parseFloat(total.toFixed(2)),
          cart_item_id: 0,
        },
      ],
    };

    const res = await fetch('http://localhost:5000/api/payment/record-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchasePayload),
    });

    const data = await res.json();

    if (res.ok) {
      closeBuyNowModal();

      setTimeout(() => {
        alert('🎉 Purchase recorded successfully!');
      }, 100);

      setPurchasedEbookIds((prev) => [...prev, selectedEbookForPurchase.id]);
    } else {
      console.error('Server responded with:', data);
      alert('⚠️ Payment done, but failed to record purchase: ' + data.message);
    }
  } catch (err) {
    alert('⚠️ Payment done, but failed to record purchase.');
    console.error('Recording error:', err);
  } finally {
    //  Stop loader
    setIsProcessingPurchase(false);
  }
},

      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || ''
      },
      theme: { color: '#3399cc' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error('❌ Payment initiation failed:', err);
    alert('Payment failed. Please try again.');
  }
};




  const openEbookViewer = async (ebook) => {
    setCurrentEbook(ebook);
    try {
      const response = await fetch(`http://localhost:5000/uploads/${ebook.ebook}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setViewerOpen(true);
    } catch (err) {
      console.error('Failed to load PDF:', err);
      alert('Failed to load the ebook. Please try again later.');
    }
  };

  const closeEbookViewer = () => {
    setViewerOpen(false);
    setCurrentEbook(null);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
  };


  useEffect(() => {
    if (cartMessage) {
      const timer = setTimeout(() => setCartMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [cartMessage]);

  const [ebookRatings, setEbookRatings] = useState({});

  useEffect(() => {
    if (ebooks.length > 0) {
      const ebookIds = ebooks.map(e => e.id);

      fetch('http://localhost:5000/api/reviews/ebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ebookIds }),
      })
        .then(res => res.json())
        .then(data => {
          setEbookRatings(data);
        })
        .catch(err => console.error('Failed to fetch ebook ratings:', err));
    }
  }, [ebooks]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) closeEbookViewer();
    };

    if (viewerOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [viewerOpen]);

  if (loading) return <p className="text-center py-10">Loading ebooks...</p>;
  if (error) return <p className="text-center text-red-600 py-10">Error: {error}</p>;

  // Calculate amounts for Buy Now modal
  const baseAmount = Number(discountedPrice) || 0;
  const gstAmount = baseAmount * (gstPercentage/ 100);
  const totalAmount = baseAmount + gstAmount;
  const originalTotal = selectedEbookForPurchase ? (Number(selectedEbookForPurchase.price) * 1.18) : 0;
  const savings = selectedCoupon ? (originalTotal - totalAmount) : 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {isProcessingPurchase && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
            <div className="text-center">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600 mb-2"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <p className="text-gray-700 font-medium">Recording your purchase...</p>
            </div>
          </div>
        )}

        {cartMessage && (
          <div className="fixed bottom-5 right-5 z-50 w-full max-w-xs">
            <div className="relative bg-green-500 text-white px-4 py-3 rounded shadow-md">
              <p>{cartMessage}</p>
              <button className="absolute top-1 right-2 font-bold" onClick={() => setCartMessage(null)}>
                ×
              </button>
              <div className="absolute bottom-0 left-0 h-1 bg-white animate-progress-bar" />
            </div>
          </div>
        )}

        {/* Ebook Viewer Modal */}
        {viewerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">{currentEbook.title}</h3>
                <button 
                  onClick={closeEbookViewer}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>
              <div className="flex-grow overflow-hidden">
                <iframe 
                  src={pdfUrl}
                  className="w-full h-full"
                  title={currentEbook.title}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              <div className="p-4 border-t text-center text-sm text-gray-500">
                This document is for viewing only. Downloading is disabled.
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              style={{
                zIndex: 99999999999,
                height: '400px',
                overflowX: 'hidden',
                overflowY: 'scroll'
              }}
              className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative"
            >
              <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
              <CommentSection 
                productType="ebook" 
                productId={selectedEbookId} 
                userId={user_id} 
              />
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Buy Now Modal */}
        {showBuyNowModal && selectedEbookForPurchase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">

              {/* ✅ Loader Overlay */}
              {isProcessingPurchase && (
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex items-center justify-center z-20">
                  <div className="text-center">
                    <p className="w-100 text-center d-flex justify-center"><svg
                      className="animate-spin h-8 w-8 text-indigo-600 mb-2"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg></p>
                    <p className="text-gray-700 font-medium">Recording your purchase...</p>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Complete Your Purchase</h3>
                <button
                  onClick={!isProcessingPurchase ? closeBuyNowModal : undefined}
                  disabled={isProcessingPurchase}
                  className={`text-gray-500 hover:text-gray-700 transition ${
                    isProcessingPurchase ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Side - Ebook Details */}
                <div className="lg:w-1/2 p-6 border-r">
                  <div className="items-center space-x-4 mb-4">
                    <img
                      src={
                        selectedEbookForPurchase.thumbnail
                          ? `http://localhost:5000/uploads/thumbnails/${selectedEbookForPurchase.thumbnail}`
                          : 'https://via.placeholder.com/150?text=No+Thumbnail'
                      }
                      alt={selectedEbookForPurchase.title}
                      className="w-100 h-auto object-cover rounded-lg"
                    />
                    <div className="ms-0 mt-3">
                      <h4 className="text-lg font-semibold">{selectedEbookForPurchase.title}</h4>
                      <p className="text-gray-600 text-sm">{selectedEbookForPurchase.description}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Payment Summary */}
                <div className="lg:w-1/2 p-6">
                  <h4 className="text-lg font-semibold mb-4">Payment Summary</h4>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>₹{baseAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST ({gstPercentage}%):</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total Payable:</span>
                      <span>
                        ₹{totalAmount.toFixed(2)}
                        {selectedCoupon && (
                          <span className="text-sm line-through text-gray-500 ml-2">
                            ₹{originalTotal.toFixed(2)}
                          </span>
                        )}
                      </span>
                    </div>
                    {selectedCoupon && (
                      <div className="text-green-600 text-sm">
                        You saved ₹{savings.toFixed(2)} with "{selectedCoupon.coupon_code}"
                      </div>
                    )}
                  </div>

                  {/* Coupon Section */}
                  {coupons.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                          className="flex-1 px-3 py-2 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={handleApplyManualCode}
                          className="px-3 py-2 text-sm bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
                        >
                          Apply
                        </button>
                      </div>

                      <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 cursor-pointer flex justify-between items-center text-sm"
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
                        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                          {coupons
                            .filter((c) => c.status.startsWith('active'))
                            .map((coupon) => {
                              const isSelected = selectedCoupon?.id === coupon.id;
                              return (
                                <div
                                  key={coupon.id}
                                  onClick={() => {
                                    handleCouponSelect(coupon);
                                    setShowDropdown(false);
                                  }}
                                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
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
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
                  >
                    Pay Now - ₹{totalAmount.toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ebooks.map((ebook) => {
            const alreadyPurchased = purchasedEbookIds.includes(ebook.id);
            const alreadyInCart = cartEbookIds.includes(ebook.id);
            const ratingData = ebookRatings[ebook.id];
            const rating = ratingData ? ratingData.avg_rating : 0;
            const reviewCount = ratingData ? ratingData.review_count : 0;

            return (
              <div
                key={ebook.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="mb-4">
                    <img
                      src={
                        ebook.thumbnail
                          ? `http://localhost:5000/uploads/thumbnails/${ebook.thumbnail}`
                          : 'https://via.placeholder.com/150?text=No+Thumbnail'
                      }
                      alt={ebook.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 mb-0 capitalize">{ebook.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{ebook.description}</p>
                  <h2 className="text-xl font-semibold mt-2 mb-0 capitalize">
                    {Number(ebook.price) <= 0 ? (
                      <span className="text-green-600 font-bold"> Free</span>
                    ) : (
                      <span className="font-bold text-indigo-600">₹{ebook.price}</span>
                    )}
                  </h2>
                </div>
              
                <div className="px-6 pb-6">
                  {/* Review Section */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                      <span className="font-medium text-gray-700">
                        {rating ? rating.toFixed(1) : 'N/A'}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowReviewModal(true);
                        setSelectedEbookId(ebook.id);
                      }}
                      className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faPen} className="mr-1 text-xs" />
                      Write Review
                    </button>
                  </div>

                  {/* Action Buttons - Two buttons in one row */}
                  {!user_id ? (
                    <Link
                      to="/login"
                      className="w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                      Login to Purchase
                    </Link>
                  ) : alreadyPurchased ? (
                    ebook.downloadable === 1 ? (
                      <a
                        href={`http://localhost:5000/uploads/${ebook.ebook}`}
                        download
                        className="w-full block text-center py-3 px-4 rounded-lg font-medium transition-colors duration-300 bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download E‑Book
                      </a>
                    ) : (
                      <button
                        onClick={() => openEbookViewer(ebook)}
                        className="w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                        View (No Download)
                      </button>
                    )
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {alreadyInCart ? (
                        <Link
                          to="/cart"
                          className="col-span-2 py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        >
                          <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                          Go to Cart
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => addToCart(ebook)}
                            className="py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {/* <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> */}
                            Add to Cart
                          </button>
                          <button
                            onClick={() => openBuyNowModal(ebook)}
                            className="py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Buy Now
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EbooksSection;