// AboutPage.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EBookSection from '../components/EBookSection';

const EBookPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
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
            style={{ backgroundImage: "url('assets/img/all-images/posters/br2.png')" }}
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center">
                <div className="text-center w-full">
                  <h2 className="text-4xl md:text-5xl font-bold text-white">E-Books</h2>
                  <div className="my-6"></div>
                  <a
                    href="/"
                    className=" text-lg inline-flex items-center gap-2 hover:text-white text-white"
                  >
                    Home <i className="fa-solid fa-angle-right"></i> <span className="opacity-80">E-Books</span>
                  </a>
                </div>
              </div>
            </div>
            </div>
            <section className="py-16 container">
                <EBookSection />
            </section>
             <Footer />
        </div>
      }
    </>
  );
};

export default EBookPage;