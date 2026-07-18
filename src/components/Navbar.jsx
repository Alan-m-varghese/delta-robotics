import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleNavClick = (e, targetHash) => {
    e.preventDefault();
    setDrawerOpen(false);

    if (location.pathname !== '/') {
      navigate('/' + targetHash);
    } else {
      const targetElement = document.querySelector(targetHash);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const isLinkActive = (path) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/95 dark:bg-inverse-surface/95 backdrop-blur-sm border-b border-outline-variant dark:border-outline transition-colors duration-200">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop h-20">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 font-headline-md text-headline-md font-extrabold tracking-tight text-primary dark:text-inverse-primary">
            <img alt="Delta Robotics Logo" className="h-8 w-8 object-contain" src="/assets/img_74c7a10f2f.png" />
            <span>Delta Robotics</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-gutter items-center">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, '#about')}
              className={`font-label-md text-label-md transition-colors duration-200 rounded-lg px-2 py-1 ${
                location.pathname === '/' && location.hash === '#about'
                  ? 'text-primary dark:text-inverse-primary font-bold border-b-2 border-primary dark:border-inverse-primary'
                  : 'text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-primary-container/10 dark:hover:bg-primary-container/20'
              }`}
            >
              About
            </a>
            <Link
              to="/courses"
              className={`font-label-md text-label-md transition-colors duration-200 rounded-lg px-2 py-1 ${
                isLinkActive('/courses')
                  ? 'text-primary dark:text-inverse-primary font-bold border-b-2 border-primary dark:border-inverse-primary'
                  : 'text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-primary-container/10 dark:hover:bg-primary-container/20'
              }`}
            >
              Courses
            </Link>
            <a
              href="#workshops"
              onClick={(e) => handleNavClick(e, '#workshops')}
              className={`font-label-md text-label-md transition-colors duration-200 rounded-lg px-2 py-1 ${
                location.pathname === '/' && location.hash === '#workshops'
                  ? 'text-primary dark:text-inverse-primary font-bold border-b-2 border-primary dark:border-inverse-primary'
                  : 'text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-primary-container/10 dark:hover:bg-primary-container/20'
              }`}
            >
              Workshops
            </a>
            {/* <a
              href="#gallery"
              onClick={(e) => handleNavClick(e, '#gallery')}
              className={`font-label-md text-label-md transition-colors duration-200 rounded-lg px-2 py-1 ${
                location.pathname === '/' && location.hash === '#gallery'
                  ? 'text-primary dark:text-inverse-primary font-bold border-b-2 border-primary dark:border-inverse-primary'
                  : 'text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-primary-container/10 dark:hover:bg-primary-container/20'
              }`}
            >
              Gallery
            </a>*/}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className={`font-label-md text-label-md transition-colors duration-200 rounded-lg px-2 py-1 ${
                location.pathname === '/' && location.hash === '#contact'
                  ? 'text-primary dark:text-inverse-primary font-bold border-b-2 border-primary dark:border-inverse-primary'
                  : 'text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-primary-container/10 dark:hover:bg-primary-container/20'
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Trailing Action */}
          <div className="flex items-center gap-sm">
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-primary-container/10 dark:hover:bg-primary-container/20 transition-all duration-200 text-on-secondary-container dark:text-secondary-fixed-dim"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined block">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>*/}

            {user ? (
              <>
                {/* <Link
                  to="/dashboard"
                  className="hidden md:block scale-95 active:scale-90 transition-transform duration-150 bg-primary-container text-white px-md py-sm rounded-lg font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-primary text-center"
                >
                  Dashboard
                </Link>*/}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="hidden md:block scale-95 active:scale-90 transition-transform duration-150 border border-primary-container text-primary-container dark:text-inverse-primary px-md py-sm rounded-lg font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-primary-container/10 text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block scale-95 active:scale-90 transition-transform duration-150 bg-primary-container text-white px-md py-sm rounded-lg font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-primary text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden md:block scale-95 active:scale-90 transition-transform duration-150 border border-primary-container text-primary-container dark:text-inverse-primary px-md py-sm rounded-lg font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-primary-container/10 text-center"
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              onClick={toggleDrawer}
              className="md:hidden text-primary p-2 rounded-lg hover:bg-primary-container/10"
              aria-label="Open mobile menu"
            >
              <span className="material-symbols-outlined block">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        onClick={toggleDrawer}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Drawer Content */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 top-0 h-full w-64 bg-surface dark:bg-inverse-surface p-6 shadow-xl flex flex-col gap-6 transform transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-headline-md text-headline-sm font-bold text-primary dark:text-inverse-primary">Menu</span>
            <button
              onClick={toggleDrawer}
              className="text-on-surface dark:text-surface-variant p-2 rounded-lg hover:bg-primary-container/10"
            >
              <span className="material-symbols-outlined block">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-lg">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, '#about')}
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary py-2 border-b border-outline-variant/35"
            >
              About
            </a>
            <Link
              to="/courses"
              onClick={toggleDrawer}
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary py-2 border-b border-outline-variant/35 block"
            >
              Courses
            </Link>
            <a
              href="#workshops"
              onClick={(e) => handleNavClick(e, '#workshops')}
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary py-2 border-b border-outline-variant/35"
            >
              Workshops
            </a>
            <a
              href="#gallery"
              onClick={(e) => handleNavClick(e, '#gallery')}
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary py-2 border-b border-outline-variant/35"
            >
              Gallery
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary py-2 border-b border-outline-variant/35"
            >
              Contact
            </a>
          </nav>

          <div className="flex flex-col gap-2 mt-auto">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={toggleDrawer}
                  className="w-full bg-primary-container text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-primary text-center block"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); toggleDrawer(); }}
                  className="w-full border border-primary-container text-primary-container dark:text-inverse-primary py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-primary-container/10 text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleDrawer}
                  className="w-full bg-primary-container text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-primary text-center block"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleDrawer}
                  className="w-full border border-primary-container text-primary-container dark:text-inverse-primary py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-primary-container/10 text-center block"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
