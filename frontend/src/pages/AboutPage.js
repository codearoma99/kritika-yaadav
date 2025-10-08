// AboutPage.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import useContent from '../hooks/useContent'; // adjust path as needed

const AboutPage = () => {
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
              <div
                className="bg-center bg-no-repeat bg-cover py-20"
                style={{ backgroundImage: "url('assets/img/all-images/posters/br3.png')" }}
              >
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex justify-center">
                    <div className="text-center w-full">
                      <h2 className="text-4xl md:text-5xl font-bold text-white">About Us</h2>
                      <div className="my-6"></div>
                      <a
                        href="/"
                        className=" text-lg inline-flex items-center gap-2 hover:text-white text-white"
                      >
                        Home <i className="fa-solid fa-angle-right"></i> <span className="">About Us</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            
              <div className="aboutinner-section-area py-16">
                <div className="container">
                <div className="row align-items-center">
                  {/* Left Column */}
                  <div className="col-lg-7">
                    <div className="about-heading heading1">
                      <h5 data-aos="fade-left" data-aos-duration="800">About Us</h5>
                      <div className="space16"></div>
                      <h2 className="text-anime-style-3">
                        {content.about_title || "Empowering India's Financial Future, One Investor at a Time"}
                      </h2>
                      <div className="space16"></div>
                      <p data-aos="fade-left" data-aos-duration="900">
                        {content.about_content || "Kritika Yadav, CFP® (USA), is a pioneering force in India’s financial education..."}
                      </p>
                      <div className="space32"></div>

                      {/* Box 1 */}
                      <div className="pera-box" data-aos="fade-left" data-aos-duration="1000">
                        <div className="icons">
                          <img
                            src={content.about_box_icon1 ? `/assets/img/icons/about-icon.svg` : "assets/img/icons/about-icon.svg"}
                            alt={content.about_box_title1 || "About Box Icon 1"}
                          />
                        </div>
                        <div className="text">
                          <a href="#">{content.about_box_title1 || "Professional Achievements"}</a>
                          <div className="space10"></div>
                          <p>{content.about_box_content1 || "Achievements content goes here."}</p>
                        </div>
                      </div>

                      <div className="space32"></div>

                      {/* Box 2 */}
                      <div className="pera-box" data-aos="fade-left" data-aos-duration="1000">
                        <div className="icons">
                          <img
                            src={content.about_box_icon2 ? `/assets/img/icons/about-icon2.svg` : "assets/img/icons/about-icon2.svg"}
                            alt={content.about_box_title2 || "About Box Icon 2"}
                          />
                        </div>
                        <div className="text">
                          <a href="#">{content.about_box_title2 || "Education & Expertise"}</a>
                          <div className="space10"></div>
                          <p>{content.about_box_content2 || "Box 2 content goes here."}</p>
                        </div>
                      </div>

                      <div className="space32"></div>
                    </div>
                  </div>

                  {/* Right Column (Images) */}
                  <div className="col-lg-5">
                    <div className="about-images-area">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="img2">
                            <img
                              src={content.about_image1 ? `http://localhost:5000/uploads/content/${content.about_image1}` : "assets/img/all-images/about/about-img9.png"}
                              alt="About Image 1"
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="space30"></div>
                          <div className="img1">
                            <img
                              src={content.about_image2 ? `http://localhost:5000/uploads/content/${content.about_image2}` : "assets/img/all-images/about/about-img11.png"}
                              alt="About Image 2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              </div>

              <div className="aboutinner2-section-area py-16">
                <div className="container">
                  <div className="row align-items-center">
                    {/* Left Images */}
                    <div className="col-lg-6">
                      <div className="about-images-area position-relative">
                        <img src="assets/img/elements/elements40.png" alt="" className="elements18 d-none" />
                        <div className="img1 text-end">
                          <img
                            src={
                              content.whychoose_image
                                ? `http://localhost:5000/uploads/content/${content.whychoose_image}`
                                : "assets/img/all-images/about/about-01.png"
                            }
                            alt="Why Choose Image"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full lg:w-1/2 px-4">
                      <div className="heading1">
                        <h5 data-aos="fade-left" data-aos-duration="800" className="text-base font-medium text-gray-600 mb-4">
                          Why Choose Kritika Yadav
                        </h5>

                        <h2 className="text-anime-style-3 text-3xl md:text-4xl font-bold text-gray-800 leading-snug mb-6">
                          {content.whychoose_title || "Transforming Financial Literacy Across India"}
                        </h2>

                        <p data-aos="fade-left" data-aos-duration="900" className="text-gray-700 mb-2">
                          {content.whychoose_para1}
                        </p>

                        <p data-aos="fade-left" data-aos-duration="1000" className="text-gray-700 mb-2">
                          {content.whychoose_para2}
                        </p>

                        <p data-aos="fade-left" data-aos-duration="1100" className="text-gray-700 mb-8">
                          {content.whychoose_para3}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                          {/* Fun Fact 1 */}
                          <div className="counter-boxarea text-center">
                            <h3 className="text-3xl font-bold text-indigo-700">
                              <span className="counter">{content.funfact_count1}</span>
                              {content.funfact_count1 >= 1000 ? "K+" : "+"}
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">{content.funfact_title1}</p>
                          </div>

                          {/* Fun Fact 2 */}
                          <div className="counter-boxarea text-center">
                            <h3 className="text-3xl font-bold text-indigo-700">
                              <span className="counter">{content.funfact_count2}</span>
                              {content.funfact_count2 >= 1000 ? "K+" : "+"}
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">{content.funfact_title2}</p>
                          </div>

                          {/* Fun Fact 3 */}
                          <div className="counter-boxarea text-center">
                            <h3 className="text-3xl font-bold text-indigo-700">
                              <span className="counter">{content.funfact_count3}</span>
                              {content.funfact_count3 >= 1000 ? "K+" : "+"}
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">{content.funfact_title3}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
                <div className="team1-section-area py-16"style={{ backgroundImage: 'url("")' }}>
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12 heading1">
                                <h5 data-aos="fade-left" data-aos-duration="800">OUR Team</h5><br></br>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-0">
                                    Expertise You Can Trust
                                </h2>
                            </div>
                          

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Team Member 1 */}
                            <div className="team-boxarea" data-aos="zoom-in-up" data-aos-duration="800">
                                <div className="img1 relative">
                                <img src="assets/img/all-images/team/team-img1.png" alt="Erma Hansen" className="w-full rounded-md" />
                                <ul className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-youtube"></i></a></li>
                                </ul>
                                </div>
                                <div className="mt-6 content-area text-center">
                                <a href="#" className="font-semibold text-lg">Dhaval Patel</a>
                                <div className="mt-2 text-sm desig">Management Advisor</div>
                                </div>
                            </div>

                            {/* Team Member 2 */}
                            <div className="team-boxarea" data-aos="zoom-in-up" data-aos-duration="900">
                                <div className="img1 relative">
                                <img src="assets/img/all-images/team/team-img1.png" alt="Ignacio Goldner" className="w-full rounded-md" />
                                <ul className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-youtube"></i></a></li>
                                </ul>
                                </div>
                                <div className="mt-6 content-area text-center">
                                <a href="#" className="font-semibold text-lg">Jayesh Darva</a>
                                <div className="mt-2 text-sm desig">Management Advisor</div>
                                </div>
                            </div>

                            {/* Team Member 3 */}
                            <div className="team-boxarea" data-aos="zoom-in-up" data-aos-duration="1000">
                                <div className="img1 relative">
                                <img src="assets/img/all-images/team/team-img1.png" alt="Jamie Veum" className="w-full rounded-md" />
                                <ul className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-youtube"></i></a></li>
                                </ul>
                                </div>
                                <div className="mt-6 content-area text-center">
                                <a href="#" className="font-semibold text-lg">Maulik Nakum</a>
                                <div className="mt-2 text-sm desig">Founder & CEO</div>
                                </div>
                            </div>

                            {/* Team Member 4 */}
                            <div className="team-boxarea" data-aos="zoom-in-up" data-aos-duration="1100">
                                <div className="img1 relative">
                                <img src="assets/img/all-images/team/team-img1.png" alt="Cesar Schuster" className="w-full rounded-md" />
                                <ul className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                                    <li><a href="#"><i className="fa-brands fa-youtube"></i></a></li>
                                </ul>
                                </div>
                                <div className="mt-6 content-area text-center">
                                <a href="#" className="font-semibold text-lg">Jugal Prajapati</a>
                                <div className="mt-2 text-sm desig">Debt Management</div>
                                </div>
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