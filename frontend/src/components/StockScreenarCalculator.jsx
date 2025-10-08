import { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

export default function StockViewerSection() {
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // New state to hold live price info
  const [livePriceData, setLivePriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);

  const endpoint = 'https://sheetdb.io/api/v1/ojr62jcf9wshw';

  // Replace with your backend URL
  const backendBaseUrl = 'http://localhost:5000/api/angelbroking';

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
      }
    };

    fetchData();
  }, []);


  // Login user check 
  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setIsLoggedIn(true);
          setUserData(user);
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      }
    }, []);


  // Fetch live price from backend whenever selected stock changes
  useEffect(() => {
    if (!selected) return;

    const fetchLivePrice = async () => {
      setPriceLoading(true);
      setPriceError(null);

      try {
        // Step 1: Get access token
        const tokenRes = await fetch(`${backendBaseUrl}/generate-token`);
        const tokenData = await tokenRes.json();

        if (!tokenData.accessToken) {
          throw new Error("No access token");
        }

        // Step 2: Fetch market feed
        // Assuming your backend accepts exchange and symbol as query params
        const marketRes = await fetch(
          `${backendBaseUrl}/market-feed?accessToken=${tokenData.accessToken}&exchange=NSE&symbol=${selected.Ticker}`
        );
        const marketData = await marketRes.json();

        setLivePriceData(marketData);
      } catch (error) {
        console.error("Failed to fetch live price:", error);
        setPriceError("Failed to fetch live price");
        setLivePriceData(null);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchLivePrice();
  }, [selected]);

  const options = stocks.map((stock) => ({
    value: stock.Ticker,
    label: `${stock.Ticker} - ${stock["Stock Name"]}`,
  }));

  const handleChange = (selectedOption) => {
    const stock = stocks.find(s => s.Ticker === selectedOption.value);
    setSelected(stock);
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
        
          {isLoggedIn ? (
            loading ? (
              <div className="text-center text-lg text-gray-600">Loading stock data...</div>
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
                    <div className="text-3xl font-bold text-white">
                      ₹{Number(selected["LTP"]).toLocaleString()}
                      <span className={`ml-3 text-sm px-2 py-1 rounded-full ${getValuationColor(selected["VALUATION"])}`}>
                        {selected["VALUATION"]}
                      </span>
                    </div>
                  </div>
                </div>

                <InfoGrid data={selected} />

                {/* Live Price Section */}
                <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 max-w-md mx-auto text-center d-none">
                  <h3 className="text-xl font-semibold mb-4">Live Market Price</h3>

                  {priceLoading && <p className="text-gray-600">Fetching live price...</p>}

                  {priceError && <p className="text-red-600">{priceError}</p>}

                  {livePriceData && !priceLoading && !priceError && (
                    <div>
                      <p className="text-4xl font-bold text-gray-900">
                        ₹{Number(livePriceData.last_price || livePriceData.ltp || livePriceData.LTP).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        As of {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  )}

                  {!livePriceData && !priceLoading && !priceError && (
                    <p className="text-gray-500">No live data available</p>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="text-center text-lg text-gray-600">
              <p>Login to access the stock analysis feature.</p>
              <br />
              <Link
                to="/login"
                className="px-4 py-2 mt-5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
              >
                Login
              </Link>
            </div>
          )}
      </div>
    </section>
  );
}

function InfoGrid({ data }) {
  const excludeKeys = ["Ticker", "Stock Name", "AVG ROE TEST", "ROCE TEST", "LTP", "VALUATION"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(data).map(([key, value], index) => {
        if (excludeKeys.includes(key)) return null;

        // RATING → Star icons
        if (key === "Kritika RATING") {
          return (
            <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-black">Kritika Ratings</span>
                <div className="text-black-500 text-lg flex items-center">
                  {renderStars(value)}
                </div>
              </div>
            </div>
          );
        }

        // FUNDAMENTALS → Background color badge
        if (key === "FUNDAMENTALS") {
          return (
            <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-black">{key}</span>
                <span className={`px-2 py-1 rounded-full text-sm ${getFundamentalsColor(value)}`}>
                  {value}
                </span>
              </div>
            </div>
          );
        }

        return (
          <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-black">{key}</span>
              <span className={`px-2 py-1 rounded-full text-sm ${getConditionalBgColor(key, value)}`}>
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
  if (!value) return '-';

  if (key === "LTP") {
    return `₹${Number(value).toLocaleString()}`;
  }

  return value;
}

// Background color rules for P/E, ROE, ROCE
function getConditionalBgColor(key, value) {
  const num = parseFloat(value);

  if (key === "P/E Ratio") {
    return num <= 15 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  if (key === "Avg ROE" || key === "Avg ROCE") {
    return num >= 12 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  return 'bg-gray-100 text-gray-800';
}

// Background color for VALUATION tag
function getValuationColor(valuation) {
  switch (valuation?.toUpperCase()) {
    case 'OVERVALUED': return 'bg-red-100 text-red-800';
    case 'UNDERVALUED': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// Background color for FUNDAMENTALS
function getFundamentalsColor(fundamentals) {
  switch (fundamentals?.toUpperCase()) {
    case 'EXCELLENT':
      return 'bg-green-100 text-green-800';
    case 'STRONG':
      return 'bg-blue-100 text-blue-800';
    case 'BELOW AVERAGE':
      return 'bg-yellow-100 text-yellow-800';
    case 'POOR':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Render stars based on '*' count
function renderStars(value) {
  const count = typeof value === 'string' ? value.split('*').length - 1 : 0;

  return (
    <>
      {Array(count).fill().map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStar} className="text-black-500 mr-1" />
      ))}
    </>
  );
}

