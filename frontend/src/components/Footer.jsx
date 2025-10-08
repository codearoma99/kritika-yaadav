import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


const Footer = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true,     // animation only happens once
    });
  }, []);

  return (
    <div>
     {/* CTA section start ===================== */}

      <div className="cta1-section-area py-16 relative">
                <div className="container mx-auto px-4">
                    <div className="row">
                      <div className="col-lg-6 col-md-12">
                          <div className="cta-header">
                          <h2 className="text-3xl md:text-4xl font-bold text-anime-style-3">
                              Connect with Us for Smarter Investments!
                          </h2>
                       
                          </div>
                      </div>
                      <div className="col-lg-6 col-md-12">
                        <div className="button-col-cta">
                          <p className="cta-phone"><i className="fa-solid fa-phone-volume"></i>+91 9319745996</p>
                          <a
                          href="/contact"
                          className="vl-btn1  rounded-md hover:bg-gray-200 transition"
                          >
                            Start Your Journey
                          </a>
                        </div>
                      </div>
                    </div>

                </div>
      </div>

      {/* CTA section end ===================== */}
      <footer className="vl-footer1-section-area py-16 pb-4">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                  {/* Logo Section */}
                  <div className="md:col-span-1 f-logo">
                    <img src="/assets/img/logo/logo1.png" alt="Logo" className="mb-6 w-75" />
                  </div>

                  {/* Quick Links - LESS WIDTH (col-span-1) */}
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-white footer-list">
                      <li><a href="/about">About Us</a></li>
                      <li><a href="/courses">Courses</a></li>
                      <li><a href="/blogs">Blogs</a></li>
                      <li><a href="/faq">FAQs</a></li>
                      <li><a href="/contact">Contact Us</a></li>
                      <li><a href="/terms-and-conditions">Terms & Conditions</a></li>
                      <li><a href="/privacy-policy">Privacy Policy</a></li>
                    </ul>
                  </div>

                  {/* Courses - MORE WIDTH (col-span-2) */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Recent Courses</h3>
                    <ul className="space-y-2 text-sm text-white footer-list">
                      <li><a href="/course-info?id=18">Identify Multibagger Penny Stocks</a></li>
                      <li><a href="/course-info?id=19">Small Cap Explosion</a></li>
                      <li><a href="/course-info?id=20">IPO gold mine</a></li>
                    </ul>
                  </div>

                  {/* Contact Us */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
                    <ul className="space-y-3 text-sm text-white">
                      <li className="flex items-center space-x-2">
                        <i className="fa-solid fa-phone-volume"></i>
                        <a href="tel:+919319745996">+91 9319745996</a>
                      </li>
                      
                      <li className="flex items-center space-x-2">
                        <i className="fa-solid fa-envelope"></i>
                        <span>contact@kritikayadav.info</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <i className="fa-solid fa-envelope"></i>
                        <span>business@kritikayadav.info</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>304 S. Jones Blvd 2378 Las Vegas, NV 89107</span>
                      </li>
                    </ul>
                    <ul className='d-flex mt-3 social-icons'>
                      <li>
                        <a href="https://www.instagram.com/kritikayadav_cfp/"><i class="fa-brands fa-square-instagram text-white"></i></a>
                      </li>
                      <li>
                        <a href="https://www.facebook.com/CFPKritikaYadav/"><i class="fa-brands fa-square-facebook text-white"></i></a>
                      </li>
                      <li>
                        <a href="https://x.com/kritikayadavcfp"><i class="fa-brands fa-square-twitter text-white"></i></a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Add here given content */}
                {/* Regulatory Disclosures */}
              <div className="mt-12 text-white text-sm space-y-6"> 
                <div>
                  <h3 className="text-base font-semibold uppercase mb-2">SEBI Registered Research Analyst</h3>
                  <p>Market Maestroo Private Limited | SEBI Registration No: <strong>INH000021757</strong></p>
                  <p>Principal Officer: Kritika Yadav | Website: <a href="https://www.kritikayadav.in" className="underline hover:text-yellow-400" target="_blank">www.kritikayadav.in</a></p>
                </div>

                <div>
                  <h3 className="text-base font-semibold uppercase mb-2">Risk Disclosure</h3>
                  <p>Investments in securities market are subject to market risks. Past performance is not indicative of future returns. Please read all related documents carefully before investing and consider your risk tolerance, investment goals, and financial situation.</p>
                </div>

                <div>
                  <h3 className="text-base font-semibold uppercase mb-2">Disclaimer</h3>
                  <p>Information provided is for educational purposes only and should not be construed as investment advice. We do not guarantee returns. The Research Analyst cannot execute trades on behalf of clients. Consult a qualified financial advisor before making investment decisions. Brokerage will not exceed SEBI prescribed limits.</p>
                </div>

                <div>
                  <h3 className="text-base font-semibold uppercase mb-2">Investor Caution</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Do NOT share trading credentials (login ID, passwords, OTPs) with anyone</li>
                    <li>Avoid trading based on tips from unauthorized sources via WhatsApp, Telegram, SMS, or social media</li>
                    <li>Always verify transaction details directly from exchange/depository</li>
                    <li>Trade only through SEBI registered intermediaries</li>
                    <li>We never guarantee or assure returns</li>
                  </ul>
                </div>

                {/* Compliance Documents - Horizontal Links */}
                <div className="pt-4 border-t border-gray-600">
                  <h3 className="text-base font-semibold uppercase mb-3">Compliance Documents</h3>
                  <div className="flex flex-wrap gap-4">
                    <a href="/assets/doc/DISCLOSURES.pdf" className="underline hover:text-yellow-400" target='_blank'>SEBI RA Disclosures</a>
                    <a href="/assets/doc/GRIEVANCEREDRESSALPOLICY.pdf" className="underline hover:text-yellow-400" target='_blank'>Grievance Redressal Policy</a>
                    <a href="/assets/doc/INVESTORCHARTERFORRESEARCHANALYST.pdf" className="underline hover:text-yellow-400" target='_blank'>Investor Charter</a>
                    <a href="/assets/doc/MOSTIMPORTANTTERMSANDCONDITIONS.pdf" className="underline hover:text-yellow-400" target='_blank'>Most Important Terms & Conditions (MITC)</a>
                  </div>
                </div>

                {/* Contact Info (Additional for SEBI) */}
                <div>
                  <h3 className="text-base font-semibold uppercase mb-2">Contact Information</h3>
                  <p>Registered Office: 304 S. Jones Blvd 2378 Las Vegas, NV 89107</p>
                  <p>Email: <a href="mailto:support@marketmaestroo.com" className="underline hover:text-yellow-400">support@marketmaestroo.com</a> | <a href="mailto:compliance@marketmaestroo.com" className="underline hover:text-yellow-400">compliance@marketmaestroo.com</a></p>
                  <p>Phone: +91 9319745996</p>
                  <p>For Grievances: <a href="https://scores.sebi.gov.in" className="underline hover:text-yellow-400" target="_blank" rel="noopener noreferrer">SEBI SCORES Portal</a> | SEBI Helpline: 1800-22-7575</p>
                </div>

              </div>                

                

                {/* Bottom Copyright */}
                <div className="mt-12 border-t border-gray-300 pt-6 text-center">
                  <p className="text-sm text-white">
                    © Copyright 2025 - Market Masetroo. All Right Reserved
                  </p>
                </div>
              </div>
      </footer>

    </div>
  );
};

export default Footer;



