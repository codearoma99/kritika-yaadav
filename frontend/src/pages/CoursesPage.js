// AboutPage.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PremiumCoursesList from '../components/PremiumCoursesList';

const CoursesPage = () => {
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
            style={{ backgroundImage: "url('assets/img/all-images/posters/br7.jpg')" }}
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center">
                <div className="text-center w-full">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mobile_ft">Courses</h2>
                   <div className="my-6 mobile_mb-0"></div>
                  <a
                    href="/"
                    className=" text-lg inline-flex items-center gap-2 hover:text-white text-white"
                  >
                    Home <i className="fa-solid fa-angle-right"></i> <span className="">Courses</span>
                  </a>
                </div>
              </div>
            </div>
            </div>
              <PremiumCoursesList />
             <Footer />
        </div>
      }
    </>
  );
};

export default CoursesPage;