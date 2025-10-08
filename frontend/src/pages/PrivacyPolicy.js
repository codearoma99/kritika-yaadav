import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
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
                      <h2 className="text-4xl md:text-5xl font-bold text-white mobile_ft">Privacy Policy</h2>
                       <div className="my-6 mobile_mb-0"></div>
                      <a
                        href="/"
                        className=" text-lg inline-flex items-center gap-2 hover:text-white text-white"
                      >
                        Home <i className="fa-solid fa-angle-right"></i> <span className="">Privacy Policy</span>
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
              At Kritika Yadav, we respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you access our website, courses, membership programs, and related services.
            </p>
          </div>

          <div className="space-y-12">
            {[{
              icon: 'fa-circle-info',
              title: '1. Information We Collect',
              content: (
                <ul className="mt-4 space-y-3 text-gray-700 list-inside list-disc">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, billing details, and login credentials when you register or purchase a course.</li>
                  <li><strong>Non-Personal Information:</strong> Browser type, device information, IP address, and usage data collected through cookies and analytics tools.</li>
                  <li><strong>Payment Information:</strong> Processed securely through third-party payment gateways. We do not store your full credit/debit card details.</li>
                </ul>
              )
            }, {
              icon: 'fa-database',
              title: '2. How We Use Your Information',
              content: (
                <ul className="mt-4 space-y-3 text-gray-700 list-inside list-disc">
                  <li>To provide and improve our courses, stock screeners, calculators, and services.</li>
                  <li>To communicate updates, newsletters, and promotional offers (with your consent).</li>
                  <li>To process payments, memberships, and support requests.</li>
                  <li>To comply with legal and regulatory requirements.</li>
                </ul>
              )
            }, {
              icon: 'fa-share-nodes',
              title: '3. Sharing of Information',
              content: (
                <>
                  <p className="mt-4 text-gray-700">
                    We do not sell, rent, or trade your information. We may share data with:
                  </p>
                  <ul className="mt-3 space-y-3 text-gray-700 list-inside list-disc">
                    <li>Trusted service providers (payment processors, hosting providers, analytics tools).</li>
                    <li>Legal authorities, if required by law or to protect rights and safety.</li>
                  </ul>
                </>
              )
            }, {
              icon: 'fa-cookie',
              title: '4. Cookies & Tracking',
              content: (
                <p className="mt-4 text-gray-700">
                  We use cookies and similar technologies to enhance your browsing experience and analyze usage trends.
                  You may disable cookies in your browser settings, but some features may not function properly.
                </p>
              )
            }, {
              icon: 'fa-shield-alt',
              title: '5. Data Security',
              content: (
                <p className="mt-4 text-gray-700">
                  We use industry-standard encryption and security practices to protect your information.
                  However, no online platform can guarantee 100% security.
                </p>
              )
            }, {
              icon: 'fa-user-check',
              title: '6. Your Rights',
              content: (
                <ul className="mt-4 space-y-3 text-gray-700 list-inside list-disc">
                  <li>Access, correct, or delete your personal data.</li>
                  <li>Opt-out of marketing communications.</li>
                  <li>Request data portability in compliance with applicable laws.</li>
                </ul>
              )
            }, {
              icon: 'fa-link',
              title: '7. Third-Party Links',
              content: (
                <p className="mt-4 text-gray-700">
                  Our website may include links to third-party sites. We are not responsible for their privacy practices.
                </p>
              )
            }, {
              icon: 'fa-sync-alt',
              title: '8. Updates to Policy',
              content: (
                <p className="mt-4 text-gray-700">
                  We may update this Privacy Policy periodically. Please review this page for the latest version.
                </p>
              )
            }, {
              icon: 'fa-envelope',
              title: '9. Contact Us',
              content: (
                <>
                  <p className="mt-4 text-gray-700">If you have any questions, please contact us:</p>
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
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
