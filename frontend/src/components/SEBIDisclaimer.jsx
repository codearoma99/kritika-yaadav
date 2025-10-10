import React from "react";

const SEBIDisclaimer = () => {
  return (
    <section className="py-12 bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 mobile_ft">
              SEBI compliant disclaimer
            </h2>
            <p className="text-lg text-gray-600">
              Important disclaimer & risk disclosure
            </p>
          </div>

          {/* SEBI Notice */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">SEBI registration & compliance notice</h3>
                <p className="text-gray-700">
                  This website and its content are for educational and informational purposes only. Ms. Kritika Yadav is a Certified Financial Planner (CFP®) and provides general financial education.
                </p>
              </div>
            </div>
          </div>

          {/* Risk Warning */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Risk warning
            </h3>
            <ul className="space-y-3 list-disc pl-5 text-gray-700">
              <li>All investments in securities markets carry inherent risks</li>
              <li>Past performance does not guarantee future results</li>
              <li>Stock prices can fluctuate significantly and may result in losses</li>
              <li>Investors should carefully consider their risk tolerance before investing</li>
              <li>Diversification does not guarantee profits or protect against losses</li>
            </ul>
          </div>

          {/* No Personalized Advice */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">No personalized investment advice</h3>
            <p className="text-gray-700 mb-4">
              The content provided on this platform, including courses and e-books, constitutes general educational material and should not be construed as personalized investment advice. Each individual's financial situation is unique.
            </p>
            <p className="text-gray-700 font-medium mb-2">Investors should:</p>
            <ul className="space-y-2 list-disc pl-5 text-gray-700">
              <li>Conduct their own research and due diligence</li>
              <li>Consult with qualified financial advisors for personalized advice</li>
              <li>Read all offer documents carefully before investing</li>
              <li>Understand the risks associated with their investments</li>
            </ul>
          </div>

          {/* Compliance & IP */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">SEBI guidelines compliance</h3>
              <p className="text-gray-700">
                We adhere to all applicable SEBI guidelines and regulations regarding financial education and investment advisory services. This platform does not guarantee returns or provide assured investment outcomes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Intellectual property notice</h3>
              <p className="text-gray-700">
                All content, courses, e-books, and materials on this platform are proprietary to Kritika Yadav and Market Maestroo Pvt. Ltd. Unauthorized reproduction or distribution is strictly prohibited.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Contact for queries</h3>
            <p className="text-gray-700 mb-4">
              For any clarifications regarding our services or disclaimers, please contact our support team through the official channels provided on this website.
            </p>
            <button className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
              Contact support
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEBIDisclaimer;