import { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
   Filler,  // Import Filler plugin
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler );

export default function StockViewerSection() {
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [screenerUsage, setScreenerUsage] = useState(null);
  const [limitReached, setLimitReached] = useState(false);

  const [candleData, setCandleData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);

  const endpoint = 'https://sheetdb.io/api/v1/ojr62jcf9wshw';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(endpoint);
        const data = await res.json();

        const cleanedData = data.map((stock) => ({
          ...stock,
          Ticker: stock.Ticker.replace('NSE:', ''),
        }));

        setStocks(cleanedData);
        setSelected(cleanedData[0]);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Login user check and track screener request
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserData(user);
        
        // Track screener request when user is logged in
        trackScreenerRequest(user.id);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const trackScreenerRequest = async (userId) => {
    try {
      const response = await fetch('https://app.kritikayadav.in/api/screener/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      
      if (data.success) {
        setScreenerUsage(data);
        setLimitReached(data.limitReached);
      }
    } catch (error) {
      console.error('Error tracking screener request:', error);
    }
  };

  const getScreenerUsage = async (userId) => {
    try {
      const response = await fetch(`https://app.kritikayadav.in/api/screener/usage?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setScreenerUsage(data);
        setLimitReached(data.limitReached);
      }
    } catch (error) {
      console.error('Error getting screener usage:', error);
    }
  };

  // Automatically fetch chart data when selected stock changes
  useEffect(() => {
    if (selected && selected["Token Number"] && !limitReached) {
      fetchCandleData(selected["Token Number"]);
    }
  }, [selected, limitReached]);

  const options = stocks.map((stock) => ({
    value: stock.Ticker,
    label: `${stock.Ticker} - ${stock["Stock Name"]}`,
  }));

  const handleChange = (selectedOption) => {
    if (limitReached) {
      alert('Daily screener limit reached. Please try again tomorrow.');
      return;
    }

    const stock = stocks.find((s) => s.Ticker === selectedOption.value);
    setSelected(stock);
    // Reset chart when stock changes - new data will be fetched automatically by useEffect
    setCandleData([]);
    setChartError(null);
  };

  // Simplified Candle Data Fetching
  const fetchCandleData = async (token) => {
    if (limitReached) return;
    
    setChartError(null);
    setChartLoading(true);
    
    try {
      // For demo purposes, we'll use mock data instead of the actual API
      // In production, this should be handled by your backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock candle data
      const mockCandleData = generateMockCandleData();
      setCandleData(mockCandleData);
      
    } catch (err) {
      console.error('Error fetching candle data:', err);
      setChartError('Failed to load chart data. Please try again later.');
    } finally {
      setChartLoading(false);
    }
  };

  // Generate realistic mock data for demonstration
  const generateMockCandleData = () => {
    const basePrice = selected ? parseFloat(selected["LTP"]) : 1000;
    const data = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Random price fluctuation ±5%
      const fluctuation = (Math.random() - 0.5) * 0.1;
      const closePrice = basePrice * (1 + fluctuation);
      
      data.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        close: closePrice,
      });
    }
    
    return data;
  };

  // Manual refresh function
  const refreshChartData = () => {
    if (limitReached) {
      alert('Daily screener limit reached. Please try again tomorrow.');
      return;
    }

    if (selected && selected["Token Number"]) {
      fetchCandleData(selected["Token Number"]);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Instant Stock Analysis</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powered by Kritika's proprietary valuation methodology
          </p>
        </div>

        {/* Screener Usage Display */}
        {isLoggedIn && screenerUsage && (
          <div className="mb-6 text-center d-none">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              limitReached 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {limitReached ? (
                <>
                  <span className="mr-2">⚠️</span>
                  Daily screener limit reached (2000/2000)
                </>
              ) : (
                <>
                  <span className="mr-2">📊</span>
                  Screener usage: {screenerUsage.currentCount}/2000 today
                  {screenerUsage.remaining && (
                    <span className="ml-2">({screenerUsage.remaining} remaining)</span>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {isLoggedIn ? (
          loading ? (
            <div className="text-center text-lg text-gray-600">Loading stock data...</div>
          ) : limitReached ? (
            <div className="text-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Daily Limit Reached
                </h3>
                <p className="text-yellow-700 mb-4">
                  You've reached your daily limit of 2000 screener requests. 
                  Please try again tomorrow.
                </p>
                
                <hr className="my-4" />
                <a href="/membership" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition">
                  Upgrade Membership for Premium Screener
                </a>
              
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto bg-black p-8 rounded-2xl shadow-xl">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">Select Stock</label>
                  <Select
                    options={options}
                    onChange={handleChange}
                    defaultValue={options[0]}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-white mb-1">Current Price</div>
                  <div className="text-3xl font-bold text-white d-flex items-center">
                    ₹{selected ? Number(selected["LTP"]).toLocaleString() : '0'}
                    {/* Change and Change % Display */}
                    {selected && (selected["CHANGE"] || selected["CHANGE %"]) && (
                      <div className=" bg-white d-flex rounded-xl border border-gray-200 ms-2">
                        <div className="d-flex space-x-4 pt-0 ms-2 me-2">
                          {selected["CHANGE"] && (
                            <div className="r">
                              <span className="text-gray-700 font-medium"></span>
                              <span className={`text-lg d-block h-100 font-semibold ${getChangeColor(selected["CHANGE"])}`}>
                                {selected["CHANGE"]}
                              </span>
                            </div>
                          )}
                          {selected["CHANGE %"] && (
                            <div className="r">
                              <span className="text-gray-700 font-medium d-none"></span>
                              <span className={`text-lg d-block h-100 font-semibold ${getChangeColor(selected["CHANGE %"])}`}>(
                                {selected["CHANGE %"]})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {selected && (
                      <span
                        className={`ml-3 text-sm px-2 py-1 rounded-full ${getValuationColor(
                          selected["VALUATION"]
                        )}`}
                      >
                        {selected["VALUATION"]}
                      </span>
                    )}
                  </div>
                </div>

                
              </div>

              

              {selected && <InfoGrid data={selected} />}

              <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-center sm:text-left">
                    Price Chart - {selected?.Ticker}
                  </h3>
                  
                  {/* <button
                    onClick={refreshChartData}
                    disabled={chartLoading || limitReached}
                    className="mt-2 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed text-sm font-medium flex items-center"
                  >
                    {chartLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Refreshing...
                      </>
                    ) : (
                      'Refresh Data'
                    )}
                  </button> */}
                </div>

                <style jsx>{`
                  canvas {
                    height: 500px !important;
                  }
                `}</style>
                {chartError && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm">{chartError}</p>
                  </div>
                )}

                {chartLoading && (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading chart data for {selected?.Ticker}...</p>
                    </div>
                  </div>
                )}

                {!chartLoading && candleData.length > 0 && (
                  <div className="h-auto">
                    <Line
                    className=''
                      data={{
                        labels: candleData.map((d) => d.date),
                        datasets: [
                          {
                            label: "Closing Price",
                            data: candleData.map((d) => d.close),
                            borderColor: "rgba(75, 209, 97, 1)",
                            backgroundColor: (context) => {
                              const chart = context.chart;
                              const { ctx, chartArea } = chart;
                              
                              if (!chartArea) return null;
                              
                              const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                              gradient.addColorStop(0, "rgba(75, 209, 97, 0.24)");
                              gradient.addColorStop(1, "rgba(75, 209, 97, 0.85)");
                              
                              return gradient;
                            },
                            tension: 0.4,
                            fill: true,
                            pointRadius: 3,
                            pointBackgroundColor: "rgba(75, 209, 97, 1)",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          title: {
                            display: true,
                            text: "",
                            font: {
                              size: 18,
                            },
                            color: "#333",
                            padding: {
                              top: 10,
                              bottom: 30,
                            },
                          },
                          legend: {
                            display: true,
                            position: "top",
                            labels: {
                              color: "#333",
                            },
                          },
                          tooltip: {
                            mode: "index",
                            intersect: false,
                            callbacks: {
                              label: function (context) {
                                return `Price: ₹${context.parsed.y.toFixed(2)}`;
                              },
                            },
                          },
                        },
                        interaction: {
                          mode: "nearest",
                          intersect: false,
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: "Date",
                              color: "#333",
                            },
                            grid: {
                              display: false,
                            },
                            ticks: {
                              color: "#333",
                            },
                          },
                          y: {
                            beginAtZero: false,
                            title: {
                              display: true,
                              text: "Price (₹)",
                              color: "#333",
                            },
                            grid: {
                              color: "rgba(0, 0, 0, 0.1)",
                            },
                            ticks: {
                              color: "#333",
                            },
                          },
                        },
                      }}
                    />
                    <div className="text-center py-8 text-red-500 d-none">
                    <p>Error 500: Unable to retrieve the requested record.</p>
                  </div>

                  </div>
                  
                )}

                {!chartLoading && candleData.length === 0 && !chartError && (
                  <div className="text-center py-8 text-red-500">
                    <p>Error 500: Unable to retrieve the requested record.</p>
                  </div>
                )}
              </div>

              {/* Stock Info */}
              {selected && (
                <div className="mt-6 grid w-100 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 d-none">
                    <div className="text-sm text-blue-600 font-medium">Stock Name</div>
                    <div className="text-lg font-semibold text-blue-800">{selected["Stock Name"]}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 d-none">
                    <div className="text-sm text-green-600 font-medium">Valuation</div>
                    <div className={`text-lg font-semibold ${getValuationTextColor(selected["VALUATION"])}`}>
                      {selected["VALUATION"]}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 d-none">
                    <div className="text-sm text-purple-600 font-medium">Fundamentals</div>
                    <div className="text-lg font-semibold text-purple-800">{selected["FUNDAMENTALS"]}</div>
                  </div>
                  <a href={`/membership`} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white text-center  px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                    Purchase Membership
                  </a>
                </div>
                
              )}              
            </div>
          )
        ) : (
          <div className="text-center text-lg text-gray-600">
            <p>Login to access the stock analysis feature.</p>
            <br />
            <Link
              to="/login"
              className="inline-flex px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
            >
              Login to View Stocks
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}


// -------------------- Helper Components ---------------------

function InfoGrid({ data }) {
  const excludeKeys = ["Ticker", "Stock Name", "AVG ROE TEST", "ROCE TEST", "LTP", "VALUATION", "Token Number", "CHANGE", "CHANGE %"];
  
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(data).map(([key, value], index) => {
        if (excludeKeys.includes(key)) return null;
        
        if (key === "Kritika RATING") {
          return (
            <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Kritika Ratings</span>
                <div className="text-black-500 text-lg flex items-center">
                  {renderStars(value)}
                </div>
              </div>
            </div>
          );
        }

        if (key === "FUNDAMENTALS") {
          return (
            <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{key}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFundamentalsColor(value)}`}>
                  {value}
                </span>
              </div>
            </div>
          );
        }

        return (
          <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">{key}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionalBgColor(key, value)}`}>
                {formatValue(key, value)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatValue(key, value) {
  if (!value && value !== 0) return "-";
  if (key === "LTP") return `₹${Number(value).toLocaleString()}`;
  if (typeof value === 'number' || !isNaN(value)) {
    // Format numeric values
    const num = parseFloat(value);
    if (key.includes('Ratio') || key.includes('ROE') || key.includes('ROCE') || key.includes('Growth')) {
      return `${num.toFixed(2)}%`;
    }
    return num.toFixed(2);
  }
  return value;
}

function getConditionalBgColor(key, value) {
  const num = parseFloat(value);
  if (isNaN(num)) return "bg-gray-100 text-gray-800";
  
  if (key === "P/E Ratio") {
    return num <= 15 ? "bg-green-100 text-green-800" : 
           num <= 25 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  }
  if (key === "Avg ROE" || key === "Avg ROCE") {
    return num >= 15 ? "bg-green-100 text-green-800" : 
           num >= 8 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  }
  if (key.includes("Growth")) {
    return num >= 10 ? "bg-green-100 text-green-800" : 
           num >= 5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  }
  return "bg-gray-100 text-gray-800";
}

function getValuationColor(valuation) {
  if (!valuation) return "bg-gray-100 text-gray-800";
  
  switch (valuation.toUpperCase()) {
    case "OVERVALUED":
      return "bg-red-100 text-red-800";
    case "UNDERVALUED":
      return "bg-green-100 text-green-800";
    case "FAIRLY VALUED":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getValuationTextColor(valuation) {
  if (!valuation) return "text-gray-800";
  
  switch (valuation.toUpperCase()) {
    case "OVERVALUED":
      return "text-red-800";
    case "UNDERVALUED":
      return "text-green-800";
    case "FAIRLY VALUED":
      return "text-blue-800";
    default:
      return "text-gray-800";
  }
}

function getFundamentalsColor(fundamentals) {
  if (!fundamentals) return "bg-gray-100 text-gray-800";
  
  switch (fundamentals.toUpperCase()) {
    case "EXCELLENT":
      return "bg-green-100 text-green-800";
    case "STRONG":
      return "bg-blue-100 text-blue-800";
    case "GOOD":
      return "bg-green-50 text-green-700";
    case "AVERAGE":
      return "bg-yellow-100 text-yellow-800";
    case "BELOW AVERAGE":
      return "bg-orange-100 text-orange-800";
    case "POOR":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getChangeColor(value) {
  if (!value) return "text-gray-800";
  
  // Check if value contains ▲ (up arrow) for positive change
  if (value.includes('▲')) {
    return "text-green-600";
  }
  // Check if value contains ▼ (down arrow) for negative change
  if (value.includes('▼')) {
    return "text-red-600";
  }
  
  return "text-gray-800";
}

function renderStars(value) {
  if (!value) return null;
  
  const count = typeof value === "string" ? value.split("*").length - 1 : 0;
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <FontAwesomeIcon 
          key={i} 
          icon={faStar} 
          className={i < count ? "text-black-500" : "text-gray-400"} 
        />
      ))}
    </>
  );
}