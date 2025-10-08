import React, { useState } from "react";

const FundamentalCalculator = () => {
  // Calculator state
  const [valuation, setValuation] = useState({
    earnings: "",
    growthRate: "",
    peRatio: "",
    discountRate: "",
    years: 5,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValuation(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : ""
    }));
  };

  const calculateValuation = () => {
    const { earnings, growthRate, peRatio, discountRate, years } = valuation;
    
    // Simple DCF calculation
    let futureEarnings = earnings * Math.pow(1 + (growthRate/100), years);
    let futureValue = futureEarnings * peRatio;
    let presentValue = futureValue / Math.pow(1 + (discountRate/100), years);
    
    setResult({
      presentValue: presentValue.toFixed(2),
      futureValue: futureValue.toFixed(2),
      intrinsicValue: (presentValue / (earnings * peRatio)).toFixed(2)
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            FUNDAMENTAL ANALYSIS CALCULATOR
          </h2>
          <p className="text-xl text-indigo-600 font-medium mb-6">
            "Crunch the numbers behind your investment decisions"
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calculator Section */}
          <div className="lg:w-1/2">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-indigo-200">
                Valuation Calculator
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Earnings (EPS)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      name="earnings"
                      value={valuation.earnings}
                      onChange={handleChange}
                      className="pl-8 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                      placeholder="5.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Growth Rate (%)
                  </label>
                  <input
                    type="number"
                    name="growthRate"
                    value={valuation.growthRate}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected P/E Ratio
                  </label>
                  <input
                    type="number"
                    name="peRatio"
                    value={valuation.peRatio}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Rate (%)
                  </label>
                  <input
                    type="number"
                    name="discountRate"
                    value={valuation.discountRate}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                    placeholder="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Horizon (Years)
                  </label>
                  <select
                    name="years"
                    value={valuation.years}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                  >
                    {[3, 5, 7, 10].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={calculateValuation}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Calculate Intrinsic Value
                </button>
              </div>
            </div>
          </div>

          {/* Results/Explanation Section */}
          <div className="lg:w-1/2">
            {result ? (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-indigo-200">
                  Valuation Results
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Discounted Future Value</h4>
                    <p className="text-3xl font-bold text-indigo-600">${result.presentValue}</p>
                    <p className="text-sm text-gray-600 mt-1">Present value of future cash flows</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Future Value</h4>
                    <p className="text-3xl font-bold text-green-600">${result.futureValue}</p>
                    <p className="text-sm text-gray-600 mt-1">Projected value in {valuation.years} years</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Intrinsic Value Multiple</h4>
                    <p className="text-3xl font-bold text-purple-600">{result.intrinsicValue}x</p>
                    <p className="text-sm text-gray-600 mt-1">Current price compared to intrinsic value</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Interpretation</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>A multiple {'>'} 1 suggests the stock may be overvalued</li>
                      <li>A multiple {'<'} 1 suggests the stock may be undervalued</li>
                      <li>Compare with industry averages for better context</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-full flex items-center">
                <div className="text-center w-full">
                  <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Calculate Your Valuation</h3>
                  <p className="text-gray-600">Enter the company's financial metrics to estimate its intrinsic value based on fundamental analysis principles.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fundamental Analysis Tips */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Fundamental Analysis Principles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Discounted Cash Flow",
                description: "DCF analysis estimates intrinsic value by forecasting future cash flows and discounting them to present value.",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              },
              {
                title: "P/E Ratio Analysis",
                description: "Compare a company's current P/E ratio with historical values and industry peers to assess valuation.",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              },
              {
                title: "Growth Assessment",
                description: "Evaluate revenue and earnings growth rates relative to industry and economic growth benchmarks.",
                icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FundamentalCalculator;