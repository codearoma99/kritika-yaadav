import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faBoxOpen, faReceipt, faSignOutAlt, faUserCircle, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCalcSubmenuOpen, setIsCalcSubmenuOpen] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  if (!userId) return;

  const fetchCartCount = () => {
    axios
      .get(`http://localhost:5000/api/cart/count/${userId}`)
      .then((res) => {
        setCartCount(res.data.count || 0);
        // console.log({cartCount});
      })
      .catch((err) => {
        console.error('Error fetching cart count:', err);
      });
  };

  // Fetch initially
  fetchCartCount();

  // Poll every 5 seconds
  const intervalId = setInterval(fetchCartCount, 100); 

  // Cleanup interval on unmount
  return () => clearInterval(intervalId);
}, []);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserData(user);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  // Toggle calculators dropdown
  const toggleCalcSubmenu = () => {
    setIsCalcSubmenuOpen(!isCalcSubmenuOpen);
  };

  // Close calculators submenu when clicking outside (optional enhancement)
  // You can implement this if needed

  return (
    <header className="bg-white fixed w-full z-50 shadow-sm" style={{ zIndex: 999999999999 }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center mobile_menu">
          {/* Logo */}
          <div className="w-1/4 md:w-auto">
            <Link to="/" className="block">
              <img src="/assets/img/logo/logo1.png" alt="Logo" className="h-10 logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:block w-3/8">
            <nav>
              <ul className="flex justify-end space-x-8 items-center">
                <li><Link to="/" className="text-gray-800 hover:text-indigo-600 transition font-medium">Home</Link></li>
                <li><Link to="/about" className="text-gray-800 hover:text-indigo-600 transition font-medium">About Us</Link></li>
                <li><Link to="/courses" className="text-gray-800 hover:text-indigo-600 transition font-medium">Courses</Link></li>
                <li><Link to="/ebook" className="text-gray-800 hover:text-indigo-600 transition font-medium">E-Book</Link></li>
                <li><Link to="/stock-screener" className="text-gray-800 hover:text-indigo-600 transition font-medium">Stock Screener</Link></li>

                {/* Calculators dropdown toggled on click */}
                <li className="relative">
                  <button
                    type="button"
                    onClick={toggleCalcSubmenu}
                    className="text-gray-800 hover:text-indigo-600 transition font-medium flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Calculators</span>
                    <svg
                      className={`w-3 h-3 mt-1 transition-transform duration-200 ${isCalcSubmenuOpen ? 'rotate-180' : 'rotate-0'}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {isCalcSubmenuOpen && (
                    <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <li>
                        <Link
                          to="/calculators/loan-emi"
                          className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                          onClick={() => setIsCalcSubmenuOpen(false)} // optional: close on link click
                        >
                          Loan EMI Calculator
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/calculators/sip"
                          className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                          onClick={() => setIsCalcSubmenuOpen(false)}
                        >
                          SIP Calculator
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/calculators/goal"
                          className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                          onClick={() => setIsCalcSubmenuOpen(false)}
                        >
                          Goal Calculator
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li><Link to="/membership" className="text-gray-800 hover:text-indigo-600 transition font-medium">Membership </Link></li>
                <li><Link to="/faq" className="text-gray-800 hover:text-indigo-600 transition font-medium">FAQ</Link></li>
                <li><Link to="/contact" className="text-gray-800 hover:text-indigo-600 transition font-medium">Contact Us</Link></li>
                 {/* Cart Icon with count */}
          <li className="relative">
            <Link to="/cart" className="block text-gray-800 transition">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>

                {isLoggedIn ? (
                  <li className="relative">
                    <div
                      className="flex items-center space-x-2 cursor-pointer group"
                      onClick={toggleProfileDropdown}
                    >
                      {userData?.profileImage ? (
                        <img
                          src={userData.profileImage}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FontAwesomeIcon icon={faUserCircle} className="text-indigo-600 text-xl" />
                        </div>
                      )}
                      <span className="text-gray-800 font-medium">{userData?.name || 'User'}</span>
                    </div>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <Link
                          to="/history#course-history"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FontAwesomeIcon icon={faBook} className="mr-3" />
                          Purchased Courses
                        </Link>
                        <Link
                          to="/history#ebooks-history"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FontAwesomeIcon icon={faBookOpen} className="mr-3" />
                          Purchased E-books
                        </Link>
                        <Link
                          to="/history#package-history"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FontAwesomeIcon icon={faBoxOpen} className="mr-3" />
                          Purchased Packages
                        </Link>
                        
                        <Link
                          to="/history#payment-history"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FontAwesomeIcon icon={faReceipt} className="mr-3" />
                          Payment History
                        </Link>
                        <Link
                          to="/cart"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
                          My Cart
                        </Link>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                          Logout
                        </button>
                      </div>
                    )}
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden w-1/4 text-right">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="xl:hidden bg-white rounded-lg mt-2 py-4 shadow-lg border border-gray-200">
            <nav>
              <ul className="flex flex-col space-y-3 px-4">
                <li><Link to="/" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">Home</Link></li>
                <li><Link to="/about" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">About Us</Link></li>
                <li><Link to="/courses" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">Courses</Link></li>
                <li><Link to="/ebook" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">E-Book</Link></li>
                <li><Link to="/stock-screener" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">Stock Screener</Link></li>

                {/* Calculators submenu in mobile menu */}
                <li>
                  <button
                    type="button"
                    onClick={() => setIsCalcSubmenuOpen(!isCalcSubmenuOpen)}
                    className="w-full text-left flex items-center space-x-1 text-gray-800 hover:text-indigo-600 transition font-medium focus:outline-none"
                  >
                    <span>Calculators</span>
                    <svg
                      className={`w-3 h-3 mt-1 transition-transform duration-200 ${isCalcSubmenuOpen ? 'rotate-180' : 'rotate-0'}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isCalcSubmenuOpen && (
                    <ul className="mt-2 pl-4 border-l border-gray-200">
                      <li>
                        <Link to="/calculators/loan-emi" onClick={() => { setIsCalcSubmenuOpen(false); toggleMenu(); }} className="block py-2 text-gray-800 hover:bg-indigo-100 rounded">
                          Loan EMI Calculator
                        </Link>
                      </li>
                      <li>
                        <Link to="/calculators/sip" onClick={() => { setIsCalcSubmenuOpen(false); toggleMenu(); }} className="block py-2 text-gray-800 hover:bg-indigo-100 rounded">
                          SIP Calculator
                        </Link>
                      </li>
                      <li>
                        <Link to="/calculators/goal" onClick={() => { setIsCalcSubmenuOpen(false); toggleMenu(); }} className="block py-2 text-gray-800 hover:bg-indigo-100 rounded">
                          Goal Calculator
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li><Link to="/blogs" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">Blogs</Link></li>
                <li><Link to="/faq" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">FAQ</Link></li>
                <li><Link to="/contact" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">Contact Us</Link></li>

                {isLoggedIn ? (
                  <>
                    <li className="border-t border-gray-200 pt-2 mt-2">
                      <Link to="/purchased-courses" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">
                        <FontAwesomeIcon icon={faBook} className="mr-3" />
                        Purchased Courses
                      </Link>
                    </li>
                    <li>
                      <Link to="/purchased-ebooks" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
                        Purchased E-books
                      </Link>
                    </li>
                    <li>
                      <Link to="/payment-history" onClick={toggleMenu} className="block py-2 text-gray-800 hover:text-indigo-600">
                        <FontAwesomeIcon icon={faReceipt} className="mr-3" />
                        Payment History
                      </Link>
                    </li>
                    <li className="border-t border-gray-200 pt-2 mt-2">
                      <button
                        onClick={() => { toggleMenu(); handleLogout(); }}
                        className="w-full text-left py-2 text-gray-800 hover:text-indigo-600"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="border-t border-gray-200 pt-2 mt-2">
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="block py-2 px-4 bg-indigo-600 text-white rounded-md text-center hover:bg-indigo-700"
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;