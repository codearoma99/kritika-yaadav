import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link } from 'react-router-dom';

const PackagePurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/purchase');
        const data = await res.json();
        if (res.ok) {
          setPurchases(data.purchases || []);
          setFiltered(data.purchases || []);
        } else {
          console.error('Failed to fetch purchases');
          setPurchases([]);
          setFiltered([]);
        }
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setPurchases([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      purchases.filter((p) => {
        return (
          (p.user_name?.toLowerCase() || '').includes(lower) ||
          (p.user_mobile || '').includes(lower) ||
          (p.package_title?.toLowerCase() || '').includes(lower) ||
          (p.transaction_id?.toLowerCase() || '').includes(lower)
        );
      })
    );
  }, [search, purchases]);

  const totalRevenue = purchases.reduce(
    (acc, p) => acc + parseFloat(p.amount || 0),
    0
  );
  const uniqueUsers = new Set(purchases.map((p) => p.user_id)).size;

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      // Prepare CSV headers
      const headers = ['Sl No', 'Customer Name', 'Phone Number', 'Package Name', 'Amount (₹)', 'Transaction ID', 'Purchase Date'];

      // Prepare rows with proper data sanitization
      const rows = filtered.map((purchase, index) => {
        // Safely handle each field with fallbacks
        const serialNo = (index + 1).toString();
        const userName = purchase.user_name ? `"${purchase.user_name.toString().replace(/"/g, '""')}"` : '"N/A"';
        const userMobile = purchase.user_mobile ? `"${purchase.user_mobile.toString().replace(/"/g, '""')}"` : '"N/A"';
        const packageTitle = purchase.package_title ? `"${purchase.package_title.toString().replace(/"/g, '""')}"` : '"N/A"';
        const amount = purchase.amount ? `"₹${parseFloat(purchase.amount).toFixed(2)}"` : '"₹0.00"';
        const transactionId = purchase.transaction_id ? `"${purchase.transaction_id.toString().replace(/"/g, '""')}"` : '"N/A"';
        const date = purchase.created_at ? `"${new Date(purchase.created_at).toLocaleDateString('en-IN')}"` : '"N/A"';

        return [serialNo, userName, userMobile, packageTitle, amount, transactionId, date];
      });

      // Combine headers and rows
      const csvArray = [headers, ...rows];
      
      // Convert to CSV string
      const csvString = csvArray.map(row => row.join(',')).join('\n');
      
      // Create Blob for better compatibility
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `package_purchases_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL object
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV file. Please try again.');
    }
  };

  // Alternative CSV export method using simple approach
  const handleExportCSVAlternative = () => {
    if (filtered.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      // Create CSV content
      let csvContent = 'Sl No,Customer Name,Phone Number,Package Name,Amount (₹),Transaction ID,Purchase Date\n';
      
      filtered.forEach((purchase, index) => {
        const row = [
          index + 1,
          purchase.user_name || 'N/A',
          purchase.user_mobile || 'N/A',
          purchase.package_title || 'N/A',
          `₹${parseFloat(purchase.amount || 0).toFixed(2)}`,
          purchase.transaction_id || 'N/A',
          purchase.created_at ? new Date(purchase.created_at).toLocaleDateString('en-IN') : 'N/A'
        ];
        
        // Escape commas and quotes in fields
        const escapedRow = row.map(field => {
          const stringField = String(field);
          if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
          }
          return stringField;
        });
        
        csvContent += escapedRow.join(',') + '\n';
      });

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `package_purchases_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error in CSV export:', error);
      alert('Error exporting CSV file. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Package Purchases</h1>
              <p className="text-sm text-gray-500 mt-1">View and manage all package transactions</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Link
                to="/admin/packages/packages-list"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
              >
                View Packages
              </Link>
              <Link
                to="/admin/create-packages"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
              >
                Create New Package
              </Link>
              <button
                onClick={handleExportCSVAlternative}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <SummaryCard title="Total Purchases" value={purchases.length} iconColor="indigo" />
            <SummaryCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} iconColor="green" />
            <SummaryCard title="Unique Users" value={uniqueUsers} iconColor="blue" />
            <SummaryCard
              title="Latest Transaction"
              value={purchases[0]?.transaction_id || 'N/A'}
              iconColor="purple"
              truncate
            />
          </div>

          {/* Debug Info - Remove in production */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p>Debug: {filtered.length} records found for export</p>
            <p>Total purchases: {purchases.length}</p>
          </div>

          {/* Search */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search by Name, Phone, Package, or Transaction ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading purchases...</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <TableHeader>#</TableHeader>
                      <TableHeader>Name</TableHeader>
                      <TableHeader>Phone</TableHeader>
                      <TableHeader>Package</TableHeader>
                      <TableHeader>Amount (₹)</TableHeader>
                      <TableHeader>Transaction ID</TableHeader>
                      <TableHeader>Date</TableHeader>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.length > 0 ? (
                      filtered.map((p, index) => (
                        <tr
                          key={p.id || index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {p.user_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {p.user_mobile || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {p.package_title || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{parseFloat(p.amount || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {p.transaction_id || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          No purchases found. Try adjusting your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const SummaryCard = ({ title, value, iconColor, truncate = false }) => {
  const bg = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  }[iconColor];
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${bg}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div className="ml-4">
          <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
          <p
            className={`text-xl font-bold text-gray-800 ${
              truncate ? 'truncate max-w-[120px]' : ''
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackagePurchaseList;