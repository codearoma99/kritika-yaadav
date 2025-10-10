import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InvestmentCalculator = () => {
  // SIP Calculator States
  const [sipAmount, setSipAmount] = useState(10000);
  const [sipDuration, setSipDuration] = useState(20);
  const [sipReturnRate, setSipReturnRate] = useState(12);

  // Lumpsum Calculator States
  const [lumpsumAmount, setLumpsumAmount] = useState(500000);
  const [lumpsumReturnRate, setLumpsumReturnRate] = useState(12);
  const [lumpsumDuration, setLumpsumDuration] = useState(10);
  
  // Results States
  const [sipResults, setSipResults] = useState(null);
  const [lumpsumResults, setLumpsumResults] = useState(null);
  const [sipChartData, setSipChartData] = useState(null);
  const [lumpsumChartData, setLumpsumChartData] = useState(null);
  const [activeTab, setActiveTab] = useState('sip');

  // Calculate SIP
  const calculateSIP = () => {
    const monthlyRate = sipReturnRate / 100 / 12;
    const months = sipDuration * 12;
    const totalInvestment = sipAmount * months;
    
    // Future value of SIP formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const futureValue = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const wealthGain = futureValue - totalInvestment;
    
    setSipResults({
      totalInvestment,
      futureValue,
      wealthGain
    });
    
    // Generate chart data
    generateSIPChartData(monthlyRate, months);
  };

  // Generate SIP Chart Data with yearly breakdown
  const generateSIPChartData = (monthlyRate, months) => {
    const labels = [];
    const investmentData = [];
    const profitData = [];
    let currentValue = 0;
    let totalInvestment = 0;
    
    for (let year = 1; year <= sipDuration; year++) {
      labels.push(`Year ${year}`);
      
      // Calculate investment for this year
      const yearlyInvestment = sipAmount * 12;
      totalInvestment += yearlyInvestment;
      
      // Calculate value at the end of this year
      for (let month = 1; month <= 12; month++) {
        currentValue = (currentValue + sipAmount) * (1 + monthlyRate);
      }
      
      investmentData.push(totalInvestment);
      profitData.push(currentValue - totalInvestment);
    }
    
    setSipChartData({
      labels,
      datasets: [
        {
          label: 'Amount Invested',
          data: investmentData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Profit Gained',
          data: profitData,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  // Calculate Lumpsum
  const calculateLumpsum = () => {
    const annualRate = lumpsumReturnRate / 100;
    const futureValue = lumpsumAmount * Math.pow(1 + annualRate, lumpsumDuration);
    const wealthGain = futureValue - lumpsumAmount;
    
    setLumpsumResults({
      futureValue,
      wealthGain
    });
    
    // Generate chart data
    generateLumpsumChartData(annualRate);
  };

  // Generate Lumpsum Chart Data with yearly breakdown
  const generateLumpsumChartData = (annualRate) => {
    const labels = [];
    const investmentData = [];
    const profitData = [];
    
    for (let year = 0; year <= lumpsumDuration; year++) {
      labels.push(`Year ${year}`);
      const value = lumpsumAmount * Math.pow(1 + annualRate, year);
      
      investmentData.push(lumpsumAmount);
      profitData.push(value - lumpsumAmount);
    }
    
    setLumpsumChartData({
      labels,
      datasets: [
        {
          label: 'Amount Invested',
          data: investmentData,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Profit Gained',
          data: profitData,
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate on component mount and when values change
  useEffect(() => {
    calculateSIP();
    calculateLumpsum();
  }, [sipAmount, sipDuration, sipReturnRate, lumpsumAmount, lumpsumDuration, lumpsumReturnRate]);

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Yearly Investment vs Profit',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-2 calc_01">Investment Calculator</h1>
        <p className="text-center text-gray-600 mb-8">Plan your investments with our SIP and Lumpsum calculators</p>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'sip' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('sip')}
            >
              SIP Calculator
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'lumpsum' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('lumpsum')}
            >
              Lumpsum Calculator
            </button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Input Panel */}
          <div className="w-full lg:w-2/5 bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {activeTab === 'sip' ? 'SIP Calculator' : 'Lumpsum Calculator'}
            </h2>
            
            {activeTab === 'sip' ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Investment Amount (₹)
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">₹1,000</span>
                    <span className="text-lg font-semibold text-indigo-700">{formatCurrency(sipAmount)}</span>
                    <span className="text-xs text-gray-500">₹1,00,000</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Duration (Years)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={sipDuration}
                    onChange={(e) => setSipDuration(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">1 Year</span>
                    <span className="text-lg font-semibold text-indigo-700">{sipDuration} Years</span>
                    <span className="text-xs text-gray-500">30 Years</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Annual Return Rate (%)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={sipReturnRate}
                    onChange={(e) => setSipReturnRate(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">1%</span>
                    <span className="text-lg font-semibold text-indigo-700">{sipReturnRate}%</span>
                    <span className="text-xs text-gray-500">30%</span>
                  </div>
                </div>
                
                {sipResults && (
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-3">SIP Calculation Results</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Investment:</span>
                        <span className="font-semibold">{formatCurrency(sipResults.totalInvestment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Final Value:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(sipResults.futureValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wealth Gain:</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(sipResults.wealthGain)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount (₹)
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={lumpsumAmount}
                    onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">₹10,000</span>
                    <span className="text-lg font-semibold text-blue-700">{formatCurrency(lumpsumAmount)}</span>
                    <span className="text-xs text-gray-500">₹1 Cr</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Duration (Years)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={lumpsumDuration}
                    onChange={(e) => setLumpsumDuration(Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">1 Year</span>
                    <span className="text-lg font-semibold text-blue-700">{lumpsumDuration} Years</span>
                    <span className="text-xs text-gray-500">30 Years</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Annual Return Rate (%)
                    </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={lumpsumReturnRate}
                    onChange={(e) => setLumpsumReturnRate(Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">1%</span>
                    <span className="text-lg font-semibold text-blue-700">{lumpsumReturnRate}%</span>
                    <span className="text-xs text-gray-500">30%</span>
                  </div>
                </div>
                
                {lumpsumResults && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Lumpsum Calculation Results</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Initial Investment:</span>
                        <span className="font-semibold">{formatCurrency(lumpsumAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Final Value:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(lumpsumResults.futureValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wealth Gain:</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(lumpsumResults.wealthGain)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Chart Panel */}
          <div className="w-full lg:w-3/5 bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Yearly Investment Analysis</h2>
            
            <div className="h-90 mb-6">
              {activeTab === 'sip' && sipChartData && (
                <Bar data={sipChartData} options={barChartOptions} />
              )}
              {activeTab === 'lumpsum' && lumpsumChartData && (
                <Bar data={lumpsumChartData} options={barChartOptions} />
              )}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg ps-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {activeTab === 'sip' ? 'About SIP Investing' : 'About Lumpsum Investing'}
              </h3>
              {activeTab === 'sip' ? (
                <p className="text-gray-700">
                  SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly. This approach reduces the impact of market volatility through rupee cost averaging and leverages the power of compounding over the long term. It's ideal for investors who want to build wealth gradually with discipline.
                </p>
              ) : (
                <p className="text-gray-700">
                  Lumpsum investing involves investing a large amount at once. This approach can be beneficial when markets are undervalued or expected to rise. It's suitable for investors with a higher risk tolerance and a shorter investment horizon with clear financial goals.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;