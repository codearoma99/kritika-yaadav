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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GoalCalculator = () => {
  // State for input values controlled by progress bars
  const [goalAmount, setGoalAmount] = useState(1500000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(12);
  
  // State for calculation results
  const [monthlyInvestment, setMonthlyInvestment] = useState(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [yearlyData, setYearlyData] = useState([]);
  
  // Calculate SIP correctly
  const calculateSIP = () => {
    const monthlyRate = returnRate / 100 / 12;
    const months = years * 12;
    
    // Correct formula: P = FV * r / [(1+r)^n - 1]
    const futureValue = goalAmount;
    const monthlyInvestment = 
      futureValue * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPaid = monthlyInvestment * months;
    const multiplierValue = futureValue / totalPaid;
    
    setMonthlyInvestment(monthlyInvestment);
    setTotalAmountPaid(totalPaid);
    setMultiplier(multiplierValue);
    
    // Calculate yearly breakdown
    const yearlyBreakdown = [];
    
    for (let year = 1; year <= years; year++) {
      const monthsInYear = year * 12;
      const totalInvested = monthlyInvestment * monthsInYear;
      
      // Calculate future value for this year: FV = P * [((1+r)^n - 1) / r] * (1+r)
      const totalValue = monthlyInvestment * 
        ((Math.pow(1 + monthlyRate, monthsInYear) - 1) / monthlyRate) * 
        (1 + monthlyRate);
      
      yearlyBreakdown.push({
        year,
        totalValue,
        returnRate: returnRate,
        monthlyInvestment,
        totalInvested,
        gain: totalValue - totalInvested
      });
    }
    
    setYearlyData(yearlyBreakdown);
    
    return {
      monthlyInvestment,
      totalAmountPaid: totalPaid,
      multiplier: multiplierValue,
      yearlyBreakdown
    };
  };
  
  // Calculate on initial load and when inputs change
  useEffect(() => {
    calculateSIP();
  }, [goalAmount, years, returnRate]);
  
  // Prepare data for the chart - Stacked bar chart
  const chartData = {
    labels: yearlyData.map(data => `Year ${data.year}`),
    datasets: [
      {
        label: 'Your Total SIP Invested (₹)',
        data: yearlyData.map(data => data.totalInvested),
        backgroundColor: 'rgba(101, 116, 205, 0.8)',
        borderColor: 'rgba(101, 116, 205, 1)',
        borderWidth: 1,
      },
      {
        label: 'Gain On Your Investment (₹)',
        data: yearlyData.map(data => data.gain),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Investment Growth Over Years',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₹${context.raw.toLocaleString()}`;
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
            return '₹' + value.toLocaleString();
          }
        }
      }
    }
  };
  
  // Calculate progress percentage for the progress bar
  const progressPercentage = (goalAmount > 0 && totalAmountPaid > 0) 
    ? Math.min(100, (totalAmountPaid / goalAmount) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">MAESTROO MYSTICAL TOOL</h1>
          <p className="text-lg text-indigo-600 italic mb-4">
            USE THIS CALCULATOR TO DEFINE YOUR MONTHLY INVESTMENT TO ACHIEVE YOUR GOAL
          </p>
          <h2 className="text-2xl font-semibold text-indigo-700">SIP NEED CALCULATOR</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Controls Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AMOUNT REQUIRED FOR FULFILLMENT OF DREAM (₹)
                  </label>
                  <span className="text-sm font-medium text-indigo-600">₹{goalAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="5000000"
                  step="100000"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹1L</span>
                  <span>₹50L</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NUMBER OF YEARS
                  </label>
                  <span className="text-sm font-medium text-indigo-600">{years} years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>30</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RETURN EXPECTED PA (%)
                  </label>
                  <span className="text-sm font-medium text-indigo-600">{returnRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>
            
          
          </div>
          
          {/* Chart Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Investment Growth Visualization</h3>
            {yearlyData.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-4">Adjust sliders to see data visualization</p>
                </div>
              </div>
            )}
          </div>
        </div>
          {/* Results Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-700 text-center mb-4">
                YOU NEED INVESTMENT PER MONTH OF
              </h3>
              <div className="text-3xl font-bold text-indigo-700 text-center mb-6">
                ₹{monthlyInvestment.toFixed(0)}
              </div>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">Progress Towards Goal</span>
                  <span className="text-sm font-medium text-gray-600">{progressPercentage.toFixed(2)}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-700 font-medium">AMOUNT ACTUALLY PAID</p>
                  <p className="text-lg font-semibold text-indigo-900">₹{totalAmountPaid.toFixed(0)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 font-medium">MONEY MULTIPLIED BY</p>
                  <p className="text-lg font-semibold text-purple-900">{multiplier.toFixed(2)} TIMES</p>
                </div>
              </div>
            </div>
        
        {/* Yearly Breakdown Table */}
        {yearlyData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Yearly Investment Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal Achievement Year</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount You Get (₹)</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate on Investment ROI</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount You Invest in SIP mode (₹)</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Total SIP Invested (₹)</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain On Your Investment (₹)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {yearlyData.map(data => (
                    <tr key={data.year} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.year}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{goalAmount.toLocaleString()}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{returnRate}%</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹{data.monthlyInvestment.toFixed(0)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹{data.totalInvested.toFixed(0)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹{data.gain.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCalculator;