// AboutPage.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useContent from '../hooks/useContent'; // adjust path as needed

const ContactPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { content, loading, error } = useContent();

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true,     // animation only happens once
    });
  }, []);
  
   // Don't try to render content until it's loaded
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
                style={{ backgroundImage: "url('assets/img/all-images/posters/br5.png')" }}
                >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-center">
                    <div className="text-center w-full">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h2>
                        <div className="my-6"></div>
                        <a
                        href="/"
                        className=" text-lg inline-flex items-center gap-2 hover:text-white text-white"
                        >
                        Home <i className="fa-solid fa-angle-right"></i> <span className="">Contact Us</span>
                        </a>
                    </div>
                    </div>
                </div>
            </div>

            <div className="contact-inner-area">
              <div className="container">
              <div className="row py-16">
                {/* Call Us Box */}
                <div className="col-lg-4 col-md-6">
                  <div className="contact-bottom-box">
                    <div className="contact-box">
                      <div className="icons">
                        <i className="fas fa-phone-alt"></i>
                      </div>
                      <div className="text">
                        <span>24/7 Service</span>
                        <h4>Call Us Today</h4>
                      </div>
                    </div>
                    <div className="space32"></div>
                    <div className="call">
                      {content.contact_phone1 && (
                        <a href={`tel:${content.contact_phone1}`}>{content.contact_phone1}</a>
                      )}
                      
                      {content.contact_phone2 && (
                        <a href={`tel:${content.contact_phone2}`}>{content.contact_phone2}</a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mail Box */}
                <div className="col-lg-4 col-md-6">
                  <div className="contact-bottom-box">
                    <div className="contact-box">
                      <div className="icons">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="text">
                        <span>Drop Line</span>
                        <h4>Mail Information</h4>
                      </div>
                    </div>
                    <div className="space32"></div>
                    <div className="call">
                      {content.contact_email1 && (
                        <a href={`mailto:${content.contact_email1}`}>{content.contact_email1}</a>
                      )}
                      
                      {content.contact_email2 && (
                        <a href={`mailto:${content.contact_email2}`}>{content.contact_email2}</a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Box */}
                <div className="col-lg-4 col-md-6">
                  <div className="contact-bottom-box">
                    <div className="contact-box">
                      <div className="icons">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="text">
                        <span>Address</span>
                        <h4>Our Location</h4>
                      </div>
                    </div>
                    <div className="space32"></div>
                    <div className="call">
                      <a href="#">{content.contact_address}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              <div className="contact2-section-area py-16 contact-page">
                <div className="contact-overlay"></div>
                <div className="container mx-auto px-4">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-6/12 w-full" data-aos="zoom-in-up" data-aos-duration="1000">
                      <div className="contact-main-boxarea">
                        <h4>Leave A Message</h4>
                        <div className="space12"></div>
                        <div className="flex flex-wrap -mx-2">
                          <div className="w-full lg:w-1/2 px-2">
                            <div className="input-area">
                              <input
                                type="text"
                                placeholder="Full Name*"
                                className="w-full border border-gray-300  rounded"
                              />
                            </div>
                          </div>

                          <div className="w-full lg:w-1/2 px-2">
                            <div className="input-area">
                              <input
                                type="number"
                                placeholder="Phone Number*"
                                className="w-full border border-gray-300  rounded"
                              />
                            </div>
                          </div>

                          <div className="w-full px-2">
                            <div className="input-area">
                              <input
                                type="email"
                                placeholder="Email Address*"
                                className="w-full border border-gray-300  rounded"
                              />
                            </div>
                          </div>

                          <div className="w-full px-2 d-none">
                            <div className="input-area">
                              <select
                                name="country"
                                id="country"
                                className="country-area nice-select w-full border border-gray-300  rounded"
                              >
                                <option value="1" data-display="Service Type">Service Type</option>
                                <option value="">Belgium</option>
                                <option value="">Brazil</option>
                                <option value="">Argentina</option>
                                <option value="">Bangladesh</option>
                                <option value="">Germany</option>
                              </select>
                            </div>
                          </div>

                          <div className="w-full px-2">
                            <div className="input-area">
                              <textarea
                                placeholder="Message"
                                className="w-full border border-gray-300  rounded h-32"
                              ></textarea>
                            </div>
                          </div>

                          <div className="w-full px-2">
                            <div className="input-area">
                              <button type="submit" className="vl-btn3">
                                submit now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/12 hidden lg:block"></div>
                    <div className="lg:w-5/12 w-full"> </div>
                  </div>
                </div>
              </div>

               <div className='col-12 contact-page-gmap'>
                  <div className="maps-area">
                     

                      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3220.8572168615497!2d-115.22619732507985!3d36.170029002970004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8c10888e5a331%3A0xd73410036efd50c8!2s304%20S%20Jones%20Blvd%20%232378%2C%20Las%20Vegas%2C%20NV%2089107%2C%20USA!5e0!3m2!1sen!2sin!4v1758715404616!5m2!1sen!2sin" 
                      width="100%"
                        height="250"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Company Location"></iframe>
                    </div>
                </div>
            </div>

             <Footer />
        </div>
      }
    </>
  );
};

export default ContactPage;