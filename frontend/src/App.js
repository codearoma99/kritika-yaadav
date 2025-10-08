import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CoursesPage from './pages/CoursesPage';
import BlogPage from './pages/BlogPage';
import CourseDetails from './components/CourseDetails';
import CourseInfo from './pages/CourseInfo';
import CourseDetail from './pages/CourseDetails';
import FAQPage from './pages/FAQPage';
import EBookPage from './pages/EBookPage';
import StockScreener from './pages/StockScreener';
import BlogDetails from './pages/BlogDetails';
import HistoryPage from './pages/HistoryPage';
import CartPage from './pages/CartPage';
import PackageDetails from './pages/PackageDetails';
import LoanEmi from './pages/LoanEMI';
import SIP from './pages/SIP';
import GoalCalculator from './pages/GoalCalculator';
import Membership from './pages/Membership';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';




// Admin Panel Components
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersList from './pages/admin/UsersList';
import CoursesList from './pages/admin/CoursesList';
import CreateCourse from './pages/admin/CreateCourse';
import EBooksList from './pages/admin/EBooksList';
import CourseEnrollments from './pages/admin/CourseEnrollments';
import PaymentList from './pages/admin/PaymentList';
import TestimonialsList from './pages/admin/TestimonialsList';
import Coupons from './pages/admin/Coupons';
import Settings from './pages/admin/Settings';
import CreateEbook from './pages/admin/CreateEbook';
import CreateCourseModules from './pages/admin/CreateCourseModules';
import TestimonialsCreate from './pages/admin/TestimonialsCreate';
import LoginPage from './pages/admin/LoginPage';
import CreateUser from './pages/admin/CreateUser';
import EditCourse from './pages/admin/EditCourse';
import UserLoginPage from './pages/LoginPage';
import UserRegisterPage from './pages/RegisterPage';
import CalculatorPage from './pages/CalculatorPage';
import EditEbook from './pages/admin/EditEbook';
import EditModules from './pages/admin/EditModules';
import CreatePackages from './pages/admin/CreatePackages';
import PackageIncludes from './pages/admin/PackageIncludes';
import PackageFAQ from './pages/admin/PackageFAQ';
import PackagePurchaseList from './pages/admin/PackagePurchaseList';
import PackagesList from './pages/admin/PackagesList';
import EditPackage from './pages/admin/EditPackage';
import TaxesPage from './pages/admin/TaxesPage';
import CreateBlogs from './pages/admin/CreateBlogs';
import BlogsList from './pages/admin/BlogsList';
import EditBlogs from './pages/admin/EditBlogs';
import ContentPage from './pages/admin/ContentPage';
import ScreenerContentForm from './pages/admin/ScreenerContentForm';
import AdminFAQPage from './pages/admin/FAQPage';
import Logout from './pages/admin/Logout';

// import ServicesPage from './pages/ServicesPage';
// import other pages...

function App() {
  //   useEffect(() => {
  //   // Disable right-click
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };

  //   // Disable F12 and other dev tools keys
  //   const handleKeyDown = (e) => {
  //     // F12 or Ctrl+Shift+I or Ctrl+Shift+J or Ctrl+U
  //     if (
  //       e.key === 'F12' ||
  //       (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
  //       (e.ctrlKey && e.key === 'U')
  //     ) {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu);
  //   document.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/courses/course-details" element={<CourseDetails />} />
        <Route path="/course-detail" element={<CourseDetail />} />
        <Route path="/course-info" element={<CourseInfo />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/stock-screener" element={<StockScreener />} />
        <Route path="/blog-details/:id" element={<BlogDetails />} />
        <Route path="/ebook" element={<EBookPage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/calculators" element={<CalculatorPage />} />
        <Route path="/package-details/:id" element={<PackageDetails />} />
        <Route path="/calculators/loan-emi" element={<LoanEmi />} />
        <Route path="/calculators/sip" element={<SIP />} />
        <Route path="/calculators/goal" element={<GoalCalculator />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />


        {/* Admin panel routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/courses" element={<CoursesList />} />
        <Route path="/admin/courses/create-course" element={<CreateCourse />} />
        <Route path="/admin/courses/edit-course/:id" element={<EditCourse />} />
        <Route path="/admin/ebooks" element={<EBooksList />} />
        <Route path="/admin/enrollment" element={<CourseEnrollments />} />
        <Route path="/admin/payments" element={<PaymentList />} />
        <Route path="/admin/testimonials" element={<TestimonialsList />} />
        <Route path="/admin/create-testimonials" element={<TestimonialsCreate />} />
        <Route path="/admin/coupons" element={<Coupons />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/users/create-user" element={<CreateUser />} />
        <Route path="/admin/ebooks/create-ebook" element={<CreateEbook />} />
        <Route path="/admin/ebooks/edit-ebook/:id" element={<EditEbook />} />
        <Route path="/admin/courses/create-course-modules/:id" element={<CreateCourseModules />} />
        <Route path="/admin/courses/edit-course-modules/:id" element={<EditModules />} />
        <Route path="/admin/create-packages" element={<CreatePackages />} />
        <Route path="/admin/packages/package-includes/:id" element={<PackageIncludes />} />
        <Route path="/admin/packages/package-faqs/:id" element={<PackageFAQ />} />
        <Route path="/admin/packages/purchase-list" element={<PackagePurchaseList />} />
        <Route path="/admin/packages/packages-list" element={<PackagesList />} />
        <Route path="/admin/packages/edit-package/:id" element={<EditPackage />} />
        <Route path="/admin/taxes" element={<TaxesPage />} />
        <Route path="/admin/create-blogs" element={<CreateBlogs />} />
        <Route path="/admin/blogs-list" element={<BlogsList />} />
        <Route path="/admin/edit-blog/:id" element={<EditBlogs />} />
        <Route path="/admin/content" element={<ContentPage />} />
        <Route path="/admin/screener-content" element={<ScreenerContentForm />} />
        <Route path="/admin/faq" element={<AdminFAQPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/logout" element={<Logout />} />
              
        {/* <Route path="/services" element={<ServicesPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
