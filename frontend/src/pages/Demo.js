// AboutPage.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {

  // For check user is login or not and for give condition 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Use below condition to display content based on login status
    // {isLoggedIn ? (
    //   <button
    //       onClick={handleSubscribe}
    //       className="w-full bg-white text-indigo-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
    //       >
    //       Subscribe Now
    //   </button>
    // ) : (
    //   <button
    //     onClick={() => navigate('/login')}
    //     className="w-full bg-white text-indigo-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
    //   >
    //     Login to Subscribe
    //   </button>
    // )}

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true,     // animation only happens once
    });
  }, []);
  return (
    <>
      {
        <div>
            <Header />
            <div
                className="bg-center bg-no-repeat bg-cover py-20"
                style={{ backgroundImage: "url('/assets/img/all-images/posters/br3.png')" }}
              >
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex justify-center">
                    <div className="text-center w-full">
                      <h2 className="text-4xl md:text-5xl font-bold text-white">Loan EMI Calculator</h2>
                      <div className="my-6"></div>
                      <a
                        href="/"
                        className=" text-lg inline-flex items-center gap-2 hover:text-white text-white"
                      >
                        Home <i className="fa-solid fa-angle-right"></i> <span className="">Loan EMI Calculator</span>
                      </a>
                    </div>
                  </div>
                </div>
            </div>

            
             <Footer />
        </div>
      }
    </>
  );
};

export default AboutPage;