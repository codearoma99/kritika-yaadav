import React from 'react';

const HeaderAdmin = () => {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-indigo-600">Admin Panel</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Admin</span>
        <img src="https://i.pravatar.cc/40" alt="Admin" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  );
};

export default HeaderAdmin;
