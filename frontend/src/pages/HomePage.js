import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectCarousel from '../components/Project';
import ScreenerSection from '../components/ScreenerSection';
import EBookSection from '../components/EBookSection';
import ContactSection from '../components/ContactSection';
import PremiumCoursesList from '../components/PremiumCoursesList';
import BlogSection from '../components/BlogSection';
import MembershipPackages from '../components/MembershipPackages';
import useContent from '../hooks/useContent'; // adjust path as needed




const HomePage = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const { content, loading, error } = useContent();



useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true,     // animation only happens once
    });
  }, []);
    
  // ✅ Don't try to render content until it's loaded
  if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;
  if (!content) return <div>No content found.</div>; // safety check
  return (
    <>
      {
        <div>
            <Header />

            {/* Hero Section ======================= */}
            <div className="hero1-section-area" style={{
                backgroundImage: `url("assets/img/all-images/bg/hero-bg1.png")`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}>
                <div className="container" data-aos="fade-up">
                    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {/* Slide 1 - Your original content */}
                            <div className="carousel-item active">
                                <div className="row align-items-center">
                                    <div className="col-lg-6" data-aos="fade-right" data-aos-delay="100">
                                        <div className="heading-area">
                                            <h5 data-aos="fade-left" data-aos-delay="200">
                                            {content.slider1_title}
                                            </h5>

                                        

                                            <div className="space20" data-aos="fade" data-aos-delay="250"></div>
                                            <h1
                                            className="text-anime-style-3 hero-section-heading"
                                            data-aos="fade-up"
                                            data-aos-delay="100"
                                            >
                                            {content.slider1_subtitle}
                                            </h1>

                                            <div className="hero-images-area block lg:hidden">
                                                <div className="img1" data-aos="fade-up" data-aos-delay="750">
                                                {/* Dynamically load slider1_image */}
                                                <img
                                                    src={content.slider1_image ? `http://localhost:5000/uploads/content/${content.slider1_image}` : 'assets/img/all-images/hero/hero-img-2.png'}
                                                    alt={content.slider1_title || 'Slider 1 Image'}
                                                />
                                                </div>
                                                <img
                                                src="assets/img/elements/elements1.png"
                                                alt=""
                                                className="elements1"
                                                data-aos="fade-down"
                                                data-aos-delay="800"
                                                />
                                                <img
                                                src="assets/img/elements/elements4.png"
                                                alt=""
                                                className="elements4 aniamtion-key-2"
                                                data-aos="zoom-in"
                                                data-aos-delay="950"
                                                />
                                                <img
                                                src="assets/img/elements/elements5.png"
                                                alt=""
                                                className="elements5 keyframe5"
                                                data-aos="flip-left"
                                                data-aos-delay="1000"
                                                />
                                            </div>

                                            <div className="space20" data-aos="fade" data-aos-delay="350"></div>
                                            <p data-aos="fade-left" data-aos-delay="100" data-aos-duration="800">
                                            {content.slider1_content}
                                            </p>
                                            <div className="space32" data-aos="fade" data-aos-delay="450"></div>
                                            <div className="btn-area1" data-aos="fade-up" data-aos-delay="500">
                                            {content.slider1_button1 && content.slider1_button1_link && (
                                                <a href={content.slider1_button1_link} className="vl-btn1" data-aos="zoom-in">
                                                {content.slider1_button1}
                                                </a>
                                            )}
                                            {content.slider1_button2 && content.slider1_button2_link && (
                                                <a href={content.slider1_button2_link} className="vl-btn1 btn2" data-aos="zoom-in">
                                                {content.slider1_button2}
                                                </a>
                                            )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 hidden lg:block" data-aos="zoom-in" data-aos-delay="700" data-aos-duration="1000">
                                        <div className="hero-images-area">
                                            <div className="img1" data-aos="fade-up" data-aos-delay="750">
                                            {/* Dynamically load slider1_image */}
                                            <img
                                                src={content.slider1_image ? `http://localhost:5000/uploads/content/${content.slider1_image}` : 'assets/img/all-images/hero/hero-img-2.png'}
                                                alt={content.slider1_title || 'Slider 1 Image'}
                                            />
                                            </div>
                                            <img
                                            src="assets/img/elements/elements1.png"
                                            alt=""
                                            className="elements1"
                                            data-aos="fade-down"
                                            data-aos-delay="800"
                                            />
                                            <img
                                            src="assets/img/elements/elements4.png"
                                            alt=""
                                            className="elements4 aniamtion-key-2"
                                            data-aos="zoom-in"
                                            data-aos-delay="950"
                                            />
                                            <img
                                            src="assets/img/elements/elements5.png"
                                            alt=""
                                            className="elements5 keyframe5"
                                            data-aos="flip-left"
                                            data-aos-delay="1000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Slide 2 - Updated with slider2 fields */}
                            <div className="carousel-item">
                            <div className="row align-items-center">
                                <div className="col-lg-6" data-aos="fade-right" data-aos-delay="100">
                                <div className="heading-area">
                                    <h5 data-aos="fade-left" data-aos-delay="200">
                                    {content.slider2_title}
                                    </h5>
                                    <div className="space20" data-aos="fade" data-aos-delay="250"></div>
                                    <h1
                                    className="text-anime-style-3 hero-section-heading"
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                    >
                                    {content.slider2_subtitle}
                                    </h1>
                                    <div className="space20" data-aos="fade" data-aos-delay="350"></div>
                                    <p data-aos="fade-left" data-aos-delay="100" data-aos-duration="800">
                                    {content.slider2_content}
                                    </p>
                                    <div className="space32" data-aos="fade" data-aos-delay="450"></div>
                                    <div className="btn-area1" data-aos="fade-up" data-aos-delay="500">
                                    {content.slider2_button1 && content.slider2_button1_link && (
                                        <a href={content.slider2_button1_link} className="vl-btn1" data-aos="zoom-in">
                                        {content.slider2_button1}
                                        </a>
                                    )}
                                    {content.slider2_button2 && content.slider2_button2_link && (
                                        <a href={content.slider2_button2_link} className="vl-btn1 btn2" data-aos="zoom-in">
                                        {content.slider2_button2}
                                        </a>
                                    )}
                                    </div>
                                </div>
                                </div>

                                <div className="col-lg-6" data-aos="zoom-in" data-aos-delay="700" data-aos-duration="1000">
                                <div className="hero-images-area">
                                    <div className="img1 aniamtion-key-1" data-aos="fade-up" data-aos-delay="750">
                                    {/* Dynamic slider2 image */}
                                    <img
                                        src={content.slider2_image ? `http://localhost:5000/uploads/content/${content.slider2_image}` : 'assets/img/all-images/hero/hero-img1.png'}
                                        alt={content.slider2_title || 'Slider 2 Image'}
                                    />
                                    </div>
                                    <img
                                    src="assets/img/elements/elements1.png"
                                    alt=""
                                    className="elements1"
                                    data-aos="fade-down"
                                    data-aos-delay="800"
                                    />
                                    <img
                                    src="assets/img/elements/elements2.png"
                                    alt=""
                                    className="elements2 aniamtion-key-4"
                                    data-aos="fade-right"
                                    data-aos-delay="850"
                                    />
                                    <img
                                    src="assets/img/elements/elements3.png"
                                    alt=""
                                    className="elements3 aniamtion-key-1"
                                    data-aos="fade-left"
                                    data-aos-delay="900"
                                    />
                                </div>
                                </div>
                            </div>
                            </div>

                        </div>

                        {/* Navigation Buttons */}
                        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* End Hero Section ======================= */}

            {/* About Section ======================= */}
            <div className="bg-center bg-no-repeat bg-cover about1-section-area py-16 animate-bg" style={{ backgroundImage: "url('assets/img/all-images/bg/features-bg-1-1.png')" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                        <div className="about-images-area">
                            <div className="img1">
                            <img
                                src={content.about_image_home ? `http://localhost:5000/uploads/content/${content.about_image_home}` : "assets/img/all-images/about/about-img1.png"}
                                alt="About Image"
                            />
                            </div>
                            <img
                            src="assets/img/elements/elements6.png"
                            alt=""
                            className="elements6 aniamtion-key-1"
                            />
                        </div>
                        </div>
                        <div className="col-lg-6">
                        <div className="about-heading heading1">
                            <h5 data-aos="fade-left" data-aos-duration="800">
                            About Kritika Yadav
                            </h5>
                            <div className="space16"></div>
                            <h2 className="text-anime-style-3">
                            {content.about_title || "Empowering India's Financial Future, One Investor at a Time"}
                            </h2>
                            <div className="space16"></div>
                            <p data-aos="fade-left" data-aos-duration="900">
                            {content.about_content || "Default about content goes here..."}
                            </p>
                            <div className="space32"></div>
                            <div className="pera-box" data-aos="fade-left" data-aos-duration="1000">
                            <div className="icons ab-icon-box">
                                <img
                                src={content.about_box_icon1 ? `/assets/img/icons/about-icon.svg` : "assets/img/icons/about-icon.svg"}
                                alt={content.about_box_title1 || "About Box Icon"}
                                />
                            </div>
                            <div className="text">
                                <a href="#">{content.about_box_title1 || "Professional Achievements:"}</a>
                                <div className="space10"></div>
                                <p>{content.about_box_content1 || "Achievements content here."}</p>
                            </div>
                            </div>
                            <div className="space32"></div>
                            <div className="btn-area1" data-aos="fade-left" data-aos-duration="1100">
                            <a href="/about" className="vl-btn1">Learn More</a>
                            </div>
                        </div>
                        </div>
                    </div>
            </div>

            </div>
            {/* End About Section ======================= */}
            
            {/* SCREENER Section */}
            <ScreenerSection />
            {/* <FundamentalCalculator /> */}

            {/* EBook Section */}
            <section
            className="py-16 bg-gray-50 animate-scroll-bg"
            style={{
                backgroundImage: "url('assets/img/all-images/bg/5.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
                backgroundPosition: "0 0",
            }}
            >
                <div className="container mx-auto px-4">
                <div className="text-center mb-12 heading1">
                    <h5 data-aos="fade-left" data-aos-duration="800">E-Books</h5><br></br>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-0">E-Books Collection</h2>
                    <p className="text-xl text-indigo-600 font-medium mb-2">
                        Essential financial knowledge at your fingertips
                    </p>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Build your investment library with expert-curated content
                </p>
                </div>
                <EBookSection />
            
                {/* Call to action */}
                <div className="mt-12 text-center">
                {/* <p className="text-gray-600 mb-6">
                    Expand your financial knowledge with our growing collection
                </p> */}
                <a href="/ebook">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg inline-flex items-center">
                    View all E-books
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>   
                </a>
                </div>

            </div>
            </section>
            {/* End EBook Section */}

            {/* Course Section using Tailwind CSS */}
            <div className="courses-section-area py-16 bg-center bg-no-repeat bg-cover"
                style={{
                    backgroundImage: 'url(/assets/img/all-images/bg/testi-shape.png)',
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover',
                }}>
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center heading1">
                        <h5 data-aos="fade-left" className="light-title" data-aos-duration="800">PREMIUM COURSES</h5><br />
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-0 light-title">
                            Master the market with expert-led courses
                        </h2>
                        <p className="text-xl text-gray-600 mt-4 light-title">
                            Transform your financial future with proven investment strategies
                        </p>
                       <PremiumCoursesList limit={3} />

                        {/* Button Row */}
                        <div className="flex justify-center">
                        <a
                            href="/courses"
                            className="vl-btn1 inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-md transition-colors"
                        >
                            View All Premium Courses
                        </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Course Section using Tailwind CSS */}

            {/* Pricing Packages */}
            
            <MembershipPackages />
            {/* Pricing Packages end */}

            {/* Our Project section ========================= */}
             <ProjectCarousel />
            {/* End Our Project section ========================= */}

            {/* SEBI Disclaimer Section Start ===================== */}
            {/* <SEBIDisclaimer /> */}
            {/* SEBI Disclaimer Section End ===================== */}

            {/* Get In Touch Section Start ===================== */}
            <ContactSection />

            {/* Get in Touch Section End ===================== */}
            

            {/* Blog section start =====================  */}
            <div className="vl-blog-1-area py-16"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 heading1">
                        <h5 data-aos="fade-left" data-aos-duration="800">OUR Blog</h5><br></br>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-0">
                            Financial Advice And Investments Tips
                        </h2>
                    </div>
                    

                    <BlogSection />
                </div>
            </div>
            {/* Blog section end =====================   */}

            {/* Poster */}
             <div className='container mx-auto px-4 mb-16'>
               <img
                    src={`http://localhost:5000/uploads/content/${content.home_page_banner}`}
                    alt="poster"
                    className="w-full rounded-lg shadow-lg"
                    />

            </div>
            {/* End Poster */}   
            <Footer />
        </div>
      }
     
    </>
  );
};

export default HomePage;