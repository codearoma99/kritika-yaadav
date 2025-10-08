// CourseDetails.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseInfo from '../components/CourseInfo';

const CourseDetail = () => {
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
                <CourseInfo />
            <Footer />
        </div>
      }
    </>
  );
};

export default CourseDetail;