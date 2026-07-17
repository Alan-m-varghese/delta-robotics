import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

// Pages
import Home from './pages/Home';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import EnrollmentPayment from './pages/EnrollmentPayment';
import LearningPortal from './pages/LearningPortal';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Modal from './components/Modal';
import Toast from './components/Toast';

// Layout wrapper to conditionally render header/footer
function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  // Paths that do NOT use the standard layout
  const isDashboard = path === '/dashboard' || path.startsWith('/dashboard/');
  const isLearningPortal = path === '/learning-portal' || path.startsWith('/learning-portal/');
  const isPayment = path === '/enrollment-payment';

  const showNavbar = !isDashboard && !isLearningPortal && !isPayment;
  const showFooter = !isDashboard && !isLearningPortal && !isPayment;

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/course-details" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/enrollment-payment" element={<EnrollmentPayment />} />
          <Route path="/learning-portal" element={<LearningPortal />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
      <Modal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <AppLayout />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}
