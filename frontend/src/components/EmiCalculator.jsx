import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Calculator = () => {
  // State for input values
  const [loanAmount, setLoanAmount] = useState(1500000);
  const [interestRate, setInterestRate] = useState(6.8);
  const [loanTerm, setLoanTerm] = useState(20);
  const [repaymentMode, setRepaymentMode] = useState(12);
  
  // State for calculation results
  const [emi, setEmi] = useState(11450);
  const [totalRepayment, setTotalRepayment] = useState(2748022);
  const [totalInterest, setTotalInterest] = useState(1248022);
  const [amortizationData, setAmortizationData] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Calculate EMI on component mount and when inputs change
  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTerm, repaymentMode]);

  // Calculate EMI function
  const calculateEMI = () => {
    const principal = loanAmount;
    const annualInterestRate = interestRate;
    const tenureInYears = loanTerm;
    
    // Monthly interest rate
    const monthlyInterestRate = (annualInterestRate / 12) / 100;
    
    // Total number of payments
    const numberOfPayments = tenureInYears * 12;
    
    // EMI calculation formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emiValue = principal * monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, numberOfPayments) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    setEmi(emiValue);
    
    // Calculate total repayment and interest
    const totalRepaymentValue = emiValue * numberOfPayments;
    setTotalRepayment(totalRepaymentValue);
    setTotalInterest(totalRepaymentValue - principal);
  };

  // Generate complete amortization schedule
  const generateAmortizationSchedule = () => {
    const principal = loanAmount;
    const annualRate = interestRate;
    const numberOfPayments = loanTerm * 12;
    const emiValue = emi;
    
    const monthlyRate = (annualRate / 12) / 100;
    let balance = principal;
    const schedule = [];
    
    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emiValue - interestPayment;
      const prevBalance = balance;
      balance -= principalPayment;
      
      // Ensure balance doesn't go negative
      if (balance < 0) {
        balance = 0;
      }
      
      schedule.push({
        month,
        beginningBalance: prevBalance,
        emi: emiValue,
        interestPaid: interestPayment,
        principalPaid: principalPayment,
        remainingBalance: balance
      });
    }
    
    setAmortizationData(schedule);
    setShowResults(true);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Data for pie chart
  const pieChartData = {
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        data: [loanAmount, totalInterest],
        backgroundColor: ['#4C51BF', '#ED8936'],
        hoverBackgroundColor: ['#667EEA', '#F6AD55'],
        borderWidth: 0,
      },
    ],
  };

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Pagination for amortization table
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = amortizationData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(amortizationData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Reset to first page when loan term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [loanTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center text-indigo-800 mb-2">Loan EMI Calculator</h1>
          <p className="text-center text-gray-600 mb-8">Plan your loan repayment with our easy-to-use calculator</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-semibold text-indigo-800 mb-4">Loan Details</h2>
                
                <div className="mb-5">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Loan Amount (₹)
                    </label>
                    <span className="text-lg font-semibold text-indigo-700">{formatCurrency(loanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="100000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹1 Lakh</span>
                    <span>₹1 Cr</span>
                  </div>
                </div>
                
                <div className="mb-5">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Interest Rate (%)
                    </label>
                    <span className="text-lg font-semibold text-indigo-700">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                </div>
                
                <div className="mb-5">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Loan Term (Years)
                    </label>
                    <span className="text-lg font-semibold text-indigo-700">{loanTerm} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
                
                <div className="mb-5">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Repayment Mode (Years)
                    </label>
                    <span className="text-lg font-semibold text-indigo-700">{repaymentMode} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={repaymentMode}
                    onChange={(e) => setRepaymentMode(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
                <button
                  onClick={generateAmortizationSchedule}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Show Amortization Schedule
                </button>
              </div>
            </div>
            
            {/* Results Section - Always visible */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Payment Breakdown</h2>
                <div className="h-64 d-flex justify-center">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly EMI</span>
                    <span className="text-2xl font-bold text-indigo-700">{formatCurrency(emi)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Interest Payable</span>
                    <span className="text-xl font-semibold text-orange-600">{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Payment</span>
                    <span className="text-xl font-semibold text-green-600">{formatCurrency(totalRepayment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Principal Amount</span>
                    <span className="text-xl font-semibold text-blue-600">{formatCurrency(loanAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Amortization Table - Only visible after clicking the button */}
          {showResults && amortizationData.length > 0 && (
            <div className="mt-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Amortization Schedule</h2>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label className="mr-2 text-sm text-gray-600">Show</label>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="60">60 months</option>
                      <option value={amortizationData.length}>All</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-600">Page</span>
                    <select
                      value={currentPage}
                      onChange={(e) => paginate(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                    >
                      {Array.from({ length: totalPages }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <span className="ml-2 text-sm text-gray-600">of {totalPages}</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto rounded-xl shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Beginning Balance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">EMI</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Interest Paid</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Principal Paid</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((data, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">{data.month}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatCurrency(data.beginningBalance)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatCurrency(data.emi)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{formatCurrency(data.interestPaid)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">{formatCurrency(data.principalPaid)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatCurrency(data.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, amortizationData.length)} of {amortizationData.length} entries
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;