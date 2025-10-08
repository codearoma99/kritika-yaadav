import React from 'react';

const FooterAdmin = () => {
  return (
    <footer className="bg-white text-center py-4 shadow-inner mt-auto">
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MarketMasetroo Admin. All rights reserved.
      </p>
    </footer>
  );
};

export default FooterAdmin;
