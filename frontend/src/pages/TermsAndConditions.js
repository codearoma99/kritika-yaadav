import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <Header />

             <div
                className="bg-center bg-no-repeat bg-cover py-20"
                style={{ backgroundImage: "url('/assets/img/all-images/posters/br3.png')" }}
              >
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex justify-center">
                    <div className="text-center w-full">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mobile_ft">Terms & Conditions</h2>
                       <div className="my-6 mobile_mb-0"></div>
                      <a
                        href="/"
                        className=" text-lg inline-flex items-center gap-2 hover:text-white text-white"
                      >
                        Home <i className="fa-solid fa-angle-right"></i> <span className="">Terms & Conditions</span>
                      </a>
                    </div>
                  </div>
                </div>
            </div>

      <main className="mx-auto px-4 py-16">
        <div className="bg-white shadow-lg rounded-lg p-10">
          <div className="mb-8 border-b border-gray-200 pb-6">
            <p className="text-gray-500">Effective Date: 16/09/2025</p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Welcome to Kritika Yadav. By accessing and using our website [your URL], courses, and services, you agree to the following Terms & Conditions. Please read them carefully.
            </p>
          </div>

          <div className="space-y-10">
            {[{
              icon: 'fa-file-contract',
              title: '1. Acceptance of Terms',
              content: 'By using our platform, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, you should not use our services.'
            }, {
              icon: 'fa-cogs',
              title: '2. Services Offered',
              content: 'We provide online financial education, stock screening tools, calculators, e-books, and memberships designed to help individuals gain financial knowledge and independence.'
            }, {
              icon: 'fa-user-shield',
              title: '3. User Responsibilities',
              content: (
                <ul className="mt-4 space-y-2 list-disc list-inside text-gray-700">
                  <li>You must provide accurate registration details.</li>
                  <li>You agree not to misuse our platform for unlawful or unauthorized activities.</li>
                  <li>You are responsible for maintaining confidentiality of your account.</li>
                </ul>
              )
            }, {
              icon: 'fa-credit-card',
              title: '4. Payment & Refunds',
              content: (
                <ul className="mt-4 space-y-2 list-disc list-inside text-gray-700">
                  <li>All payments must be made in full at the time of purchase.</li>
                  <li>Refunds are subject to our refund policy [insert link if you have one].</li>
                  <li>Pricing is subject to change without prior notice.</li>
                </ul>
              )
            }, {
              icon: 'fa-lightbulb',
              title: '5. Intellectual Property',
              content: (
                <ul className="mt-4 space-y-2 list-disc list-inside text-gray-700">
                  <li>All course materials, content, and resources are the intellectual property of Kritika Yadav.</li>
                  <li>You may not copy, distribute, or reproduce any content without prior written consent.</li>
                </ul>
              )
            }, {
              icon: 'fa-exclamation-triangle',
              title: '6. Disclaimer',
              content: (
                <ul className="mt-4 space-y-2 list-disc list-inside text-gray-700">
                  <li>The content provided is for educational purposes only and does not constitute financial advice.</li>
                  <li>We are not responsible for investment losses or decisions made based on our content.</li>
                </ul>
              )
            }, {
              icon: 'fa-balance-scale',
              title: '7. Limitation of Liability',
              content: (
                <ul className="mt-4 space-y-2 list-disc list-inside text-gray-700">
                  <li>We are not liable for any direct, indirect, or incidental damages arising from the use of our platform.</li>
                  <li>We do not guarantee uninterrupted, error-free service.</li>
                </ul>
              )
            }, {
              icon: 'fa-power-off',
              title: '8. Termination',
              content: 'We reserve the right to suspend or terminate user accounts that violate these Terms.'
            }, {
              icon: 'fa-gavel',
              title: '9. Governing Law',
              content: 'These Terms & Conditions are governed by the laws of India.'
            }, {
              icon: 'fa-envelope',
              title: '10. Contact Us',
              content: (
                <>
                  <p className="mt-4 text-gray-700">If you have questions about these Terms, please contact us:</p>
                  <div className="mt-4 space-y-3 text-gray-700">
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-envelope text-blue-500"></i>
                      <span>Email: contact@kritikayadav.info</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-phone text-blue-500"></i>
                      <span>Phone: 9319745996</span>
                    </div>
                  </div>
                </>
              )
            }].map((section, idx) => (
              <div key={idx} data-aos="fade-up">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3">
                  <i className={`fa-solid ${section.icon} text-blue-500`}></i>
                  <span>{section.title}</span>
                </h3>
                <div className="mt-3 text-gray-700 leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TermsAndConditions;
