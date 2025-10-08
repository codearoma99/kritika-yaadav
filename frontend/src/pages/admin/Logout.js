// src/pages/admin/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear admin session
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLoggedIn');

    // Redirect to login page
    navigate('/admin/login');
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
