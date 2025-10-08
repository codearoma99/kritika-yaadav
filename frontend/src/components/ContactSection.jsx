import React from 'react';

const ContactSection = () => {
  return (
    <div className="contact2-section-area py-16">
      <div className="contact-overlay"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-5/12 w-full">
            
          </div>

          <div className="lg:w-1/12 hidden lg:block"></div>

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
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
