import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const AdminSidebar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const location = useLocation();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <Link 
          to="/admin" 
          className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
        >
          <i className="fas fa-tachometer-alt nav-icon"></i>
          <span>Dashboard</span>
        </Link>

        <Link 
          to="/admin/users" 
          className={`nav-link ${location.pathname.startsWith('/admin/users') ? 'active' : ''}`}
        >
          <i className="fas fa-users nav-icon"></i>
          <span>Users</span>
        </Link>

        <Link 
          to="/admin/courses" 
          className={`nav-link ${location.pathname.startsWith('/admin/courses') ? 'active' : ''}`}
        >
          <i className="fas fa-book-open nav-icon"></i>
          <span>Courses</span>
        </Link>

        <Link 
          to="/admin/ebooks" 
          className={`nav-link ${location.pathname.startsWith('/admin/ebooks') ? 'active' : ''}`}
        >
          <i className="fas fa-book nav-icon"></i>
          <span>E-Books</span>
        </Link>

        <Link 
          to="/admin/enrollment" 
          className={`nav-link ${location.pathname.startsWith('/admin/enrollment') ? 'active' : ''}`}
        >
          <i className="fas fa-user-graduate nav-icon"></i>
          <span>Course Enrollment</span>
        </Link>

        <Link 
          to="/admin/payments" 
          className={`nav-link ${location.pathname.startsWith('/admin/payments') ? 'active' : ''}`}
        >
          <i className="fas fa-credit-card nav-icon"></i>
          <span>Payment List</span>
        </Link>

        <Link 
          to="/admin/testimonials" 
          className={`nav-link ${location.pathname.startsWith('/admin/testimonials') ? 'active' : ''}`}
        >
          <i className="fas fa-comment-dots nav-icon"></i>
          <span>Testimonials</span>
        </Link>

        <Link 
          to="/admin/blogs-list" 
          className={`nav-link ${location.pathname.startsWith('/admin/blogs-list') ? 'active' : ''}`}
        >
          <i className="fas fa-blog nav-icon"></i>
          <span>Blogs</span>
        </Link>

        <Link 
          to="/admin/coupons" 
          className={`nav-link ${location.pathname.startsWith('/admin/coupons') ? 'active' : ''}`}
        >
          <i className="fas fa-tag nav-icon"></i>
          <span>Coupon Codes</span>
        </Link>

        <Link 
          to="/admin/packages/purchase-list" 
          className={`nav-link ${location.pathname.startsWith('/admin/packages/purchase-list') ? 'active' : ''}`}
        >
          <i className="fas fa-box-open nav-icon"></i> {/* icon can be changed as needed */}
          <span>Package Purchases</span>
        </Link>


        <Link 
          to="/admin/taxes" 
          className={`nav-link ${location.pathname.startsWith('/admin/taxes') ? 'active' : ''}`}
        >
          <i className="fas fa-file-invoice-dollar nav-icon"></i>
          <span>Taxes</span>
        </Link>



        {/* <Link 
          to="/admin/reports" 
          className={`nav-link ${location.pathname.startsWith('/admin/reports') ? 'active' : ''}`}
        >
          <i className="fas fa-chart-bar nav-icon"></i>
          <span>Reports</span>
        </Link> */}
        {/* <Link 
          to="/admin/settings" 
          className={`nav-link ${location.pathname.startsWith('/admin/settings') ? 'active' : ''}`}
        >
          <i className="fas fa-cog nav-icon"></i>
          <span>Settings</span>
        </Link> */}
        <Link 
          to="/admin/content" 
          className={`nav-link ${location.pathname.startsWith('/admin/content') ? 'active' : ''}`}
        >
          <i className="fas fa-file-alt nav-icon"></i>
          <span>Content</span>
        </Link>
        <Link 
            to="/admin/screener-content" 
            className={`nav-link ${location.pathname.startsWith('/admin/screener-content') ? 'active' : ''}`}
          >
            <i className="fas fa-chart-line nav-icon"></i>
            <span>Screener Content</span>
          </Link>

          <Link 
            to="/admin/faq" 
            className={`nav-link ${location.pathname.startsWith('/admin/faq') ? 'active' : ''}`}
          >
            <i className="fas fa-question-circle nav-icon"></i>
            <span>FAQ</span>
          </Link>

        <Link
          to="/admin/logout" 
          className={`nav-link ${location.pathname.startsWith('/admin/logout') ? 'active' : ''}`}
        >
          <i className="fas fa-sign-out-alt nav-icon"></i>
          <span>Logout</span>
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

// Add this to your CSS file or styled-components
const styles = `
  .admin-sidebar {
    width: 260px;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    color: white;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .sidebar-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    background: linear-gradient(to right, #818cf8, #a5b4fc);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sidebar-nav {
    padding: 1rem 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.8rem 1.5rem;
    margin: 0.25rem 1rem;
    color: #cbd5e1;
    text-decoration: none;
    border-radius: 0.375rem;
    transition: all 0.3s ease;
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #e2e8f0;
    transform: translateX(5px);
  }

  .nav-link.active {
    background: linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 100%);
    color: #ffffffff;
    border-left: 3px solid #ffffffff;
    
  }

  .nav-link.active .nav-icon {
    color: #818cf8;
  }

  .nav-icon {
    margin-right: 0.75rem;
    width: 20px;
    text-align: center;
    color: #ffffffff;
    transition: all 0.3s ease;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .admin-sidebar {
      transform: translateX(-100%);
      width: 280px;
    }

    .admin-sidebar.open {
      transform: translateX(0);
    }
  }
`;

// Add the styles to the head (you might want to use a CSS-in-JS solution instead)
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}