import React from 'react';
import '../../assets/css/admin.css';

const HeaderAdmin = () => {
  const toggleSidebar = () => {
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
      sidebar.style.left = '278px'; // Push it temporarily
    }
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars text-2xl"></i>
        </button>
        <h1 className="text-xl font-semibold text-indigo-600">Admin Panel</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Admin</span>
        <img src="https://i.pravatar.cc/40" alt="Admin" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  );
};

export default HeaderAdmin;
