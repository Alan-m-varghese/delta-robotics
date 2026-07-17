import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { COURSES_DB } from '../data/courses';
import { AuthContext } from '../context/AuthContext';

export default function CourseDetails() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseId = params.get('course') || 'autonomous-systems';
    const data = COURSES_DB[courseId];
    if (data) {
      setCourse(data);
      document.title = `${data.title} | Delta Robotics Academy`;
    } else {
      // Fallback if course not found
      navigate('/courses');
    }
  }, [location, navigate]);

  if (!course) {
    return (
      <div className="pt-32 text-center text-on-surface-variant">
        <p>Loading course details...</p>
      </div>
    );
  }

  // Icons used for "What's Included" items
  const includedIcons = [
    "workspace_premium",
    "all_inclusive",
    "person_play",
    "terminal"
  ];

  return (
    <div className="pt-20 bg-background text-on-background min-h-screen">
      
      {/* Hero Section */}
      <section className="w-full bg-inverse-surface text-inverse-on-surface relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div 
            className="bg-cover bg-center w-full h-full" 
            style={{ backgroundImage: `url('/${course.image}')` }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface via-inverse-surface/90 to-transparent z-10"></div>
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl relative z-20">
          <div className="max-w-3xl">
            <div className="flex gap-2 mb-sm">
              <span className="bg-primary-container/20 text-primary-fixed-dim font-label-md text-label-md px-3 py-1 rounded-full border border-primary-container/30">
                {course.level} Level
              </span>
              <span className="bg-surface-container/20 text-surface-variant font-label-md text-label-md px-3 py-1 rounded-full border border-surface-container/30">
                {course.category}
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-secondary mb-md">
              {course.title}
            </h1>
            <p className="font-body-lg text-body-lg text-surface-variant mb-lg">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed-dim">star</span>
                <span className="font-body-md text-body-md font-bold text-on-secondary">
                  {course.rating}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-surface-variant">group</span>
                <span className="font-body-md text-body-md text-surface-variant">
                  {course.students} Students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-surface-variant">schedule</span>
                <span className="font-body-md text-body-md text-surface-variant">
                  {course.duration} (Self-paced)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl relative">
          
          {/* Left Column: Course Content */}
          <div className="lg:col-span-8 space-y-xl relative">
            <div className={!user ? 'filter blur-[4px] select-none pointer-events-none' : 'space-y-xl'}>
              {/* Overview */}
              <section>
                <h2 className="font-headline-lg text-headline-lg mb-md text-on-background">Course Overview</h2>
                <p className="font-body-lg text-body-lg text-secondary mb-md">
                  {course.overview1}
                </p>
                <p className="font-body-lg text-body-lg text-secondary">
                  {course.overview2}
                </p>
              </section>

              {/* What You'll Learn */}
              <section className="bg-surface-container-lowest border border-secondary-container rounded-xl p-lg">
                <h3 className="font-headline-md text-headline-md mb-md text-on-background">What You Will Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {course.learn.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="material-symbols-outlined text-primary-container mt-1">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {!user && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-md text-center z-20">
                <div className="bg-surface dark:bg-inverse-surface border border-outline-variant p-lg rounded-2xl max-w-md shadow-2xl flex flex-col items-center gap-md">
                  <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container animate-pulse">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-on-surface dark:text-white font-bold mb-2">Curriculum Details Locked</h4>
                    <p className="font-body-md text-sm text-on-surface-variant dark:text-surface-variant leading-relaxed">
                      Please log in or register for a Delta Robotics Academy account to view the full curriculum overview, syllabus breakdown, and certification requirements.
                    </p>
                  </div>
                  <div className="flex gap-sm w-full pt-2">
                    <Link 
                      to="/login" 
                      className="flex-grow bg-primary-container text-white py-3 rounded-lg font-label-md text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors text-center shadow-sm"
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="flex-grow border border-primary-container text-primary-container dark:text-inverse-primary py-3 rounded-lg font-label-md text-sm font-bold uppercase tracking-wider hover:bg-primary-container/10 transition-colors text-center"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Sticky Enrollment Card */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-[100px] bg-surface-container-lowest border border-secondary-container rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-lg flex flex-col gap-md">
              <div className="text-center mb-sm">
                <span className="font-headline-lg text-headline-lg font-bold text-on-background block mb-1">
                  {course.price}
                </span>
                <span className="font-body-md text-body-md text-secondary">One-time payment</span>
              </div>
              {user ? (
                <Link 
                  to={`/enrollment-payment?course=${course.id}`} 
                  className="w-full bg-primary-container text-on-primary font-headline-md text-label-md font-bold py-4 rounded-lg hover:bg-primary transition-colors shadow-sm text-center block"
                >
                  Enroll Now
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="w-full bg-secondary text-white font-headline-md text-label-md font-bold py-4 rounded-lg hover:bg-on-surface transition-colors shadow-sm text-center block"
                >
                  Sign In to Enroll
                </Link>
              )}
              <p className="text-center font-label-md text-label-md text-secondary mb-md">30-day money-back guarantee</p>
              <hr className="border-secondary-container" />
              <div>
                <h4 className="font-headline-md text-body-lg font-bold text-on-background mb-4">What's included</h4>
                <ul className="space-y-3">
                  {course.included.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">
                        {includedIcons[idx % includedIcons.length]}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
