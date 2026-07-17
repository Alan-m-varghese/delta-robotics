import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const handleHashClick = (e, targetHash) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetHash);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.location.href = '/' + targetHash;
    }
  };

  return (
    <footer className="w-full bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant dark:border-outline flat no shadows transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-7xl mx-auto px-margin-desktop py-xl">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-sm">
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary mb-4 block">
            Delta Robotics
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant max-w-sm">
            Pioneering the next generation of engineers through hands-on robotics education.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant mt-auto pt-md opacity-80 hover:opacity-100 transition-opacity">
            © 2024 Delta Robotics. Pioneering the next generation of engineers through hands-on robotics education.
          </p>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="font-headline-sm text-headline-sm text-primary dark:text-inverse-primary mb-2">Navigation</h4>
          <a 
            className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors hover:translate-x-1 duration-200 block w-fit" 
            href="#about"
            onClick={(e) => handleHashClick(e, '#about')}
          >
            About
          </a>
          <Link 
            className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors hover:translate-x-1 duration-200 block w-fit" 
            to="/courses"
          >
            Courses
          </Link>
        </div>
      </div>
    </footer>
  );
}
