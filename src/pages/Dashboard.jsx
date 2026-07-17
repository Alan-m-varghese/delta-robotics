import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';
import { COURSES_DB } from '../data/courses';

export default function Dashboard() {
  const { user, enrolledCourses, courseProgress, stats, logout } = useContext(AuthContext);
  const { showToast } = useContext(UIContext);
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is not logged in, we use fallback mock data or prompt
  const userName = user ? user.name : 'Alex';
  const userRole = user ? user.role : 'Student';

  // Map enrolled course IDs to actual course database details
  const myCourses = enrolledCourses.map(id => {
    // Return standard DB course or custom fallback if not exists
    return COURSES_DB[id] || {
      id,
      title: id === 'computer-vision-basics' || id === 'computer-vision' ? 'Computer Vision Basics' : 'Intro to ROS 2',
      image: id === 'computer-vision-basics' || id === 'computer-vision' ? 'assets/asset_81bee4ec19.png' : 'assets/asset_f7e3c0693f.png',
      category: 'Software',
      duration: '12 Weeks'
    };
  });

  const handleLogout = () => {
    logout();
    showToast('🔐 Logged out successfully.');
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background antialiased transition-colors duration-200">
      
      {/* TopNavBar (Mobile Only) */}
      <header className="md:hidden sticky top-0 z-50 w-full flex justify-between px-margin-mobile bg-surface dark:bg-inverse-surface border-b border-secondary-container dark:border-secondary h-16 items-center">
        <div className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary-container dark:text-primary-fixed-dim">
          Delta Robotics
        </div>
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-on-surface hover:bg-primary-container/10 rounded-lg"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
          <img 
            className="w-8 h-8 rounded-full object-cover" 
            src="/assets/asset_23af6258a0.png" 
            alt="Profile Avatar"
          />
        </div>
      </header>

      {/* SideNavBar (Desktop & Mobile Slide-out) */}
      <nav className={`h-screen w-64 fixed left-0 top-0 bg-surface-container dark:bg-surface-container-high py-md flex flex-col justify-between z-40 transition-transform duration-300 md:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          <div className="px-md mb-lg">
            <Link to="/" className="font-headline-md text-headline-md font-bold text-primary-container dark:text-primary-fixed-dim mb-2 block">
              Delta Robotics
            </Link>
            <div className="font-label-md text-label-md text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider text-xs">
              {userRole} Portal
            </div>
            <div className="font-label-md text-label-md text-on-surface-variant text-xs mt-1">
              Active Session: Ready
            </div>
          </div>
          <div className="px-sm flex flex-col gap-xs font-label-md text-label-md">
            <Link 
              to="/dashboard" 
              className="bg-primary-container text-on-primary font-bold rounded-lg m-2 p-3 flex items-center gap-3 transition-all hover:bg-primary"
            >
              <span className="material-symbols-outlined">dashboard</span> 
              Overview
            </Link>
            <Link 
              to="/courses" 
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-primary-fixed hover:text-on-primary-fixed-variant rounded-lg transition-transform duration-150 active:translate-x-1"
            >
              <span className="material-symbols-outlined">menu_book</span> 
              Catalog
            </Link>
            <Link 
              to="/learning-portal" 
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-primary-fixed hover:text-on-primary-fixed-variant rounded-lg transition-transform duration-150 active:translate-x-1"
            >
              <span className="material-symbols-outlined">model_training</span> 
              Classroom
            </Link>
            <a 
              href="#help" 
              onClick={(e) => { e.preventDefault(); showToast('ℹ️ Documentation folder offline.'); }}
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-primary-fixed hover:text-on-primary-fixed-variant rounded-lg transition-transform duration-150 active:translate-x-1"
            >
              <span className="material-symbols-outlined">folder_open</span> 
              Resources
            </a>
          </div>
        </div>

        <div className="px-sm flex flex-col gap-xs font-label-md text-label-md">
          <Link 
            to="/learning-portal" 
            className="bg-primary-container text-on-primary font-bold rounded-lg m-2 p-3 text-center hover:bg-primary transition-colors block"
          >
            Join Live Lab
          </Link>
          <button 
            onClick={handleLogout}
            className="text-left text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-red-500">logout</span> 
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop bg-background min-h-screen w-full transition-colors duration-200">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-md pt-4 md:pt-0">
          <div>
            <h1 className="font-headline-xl text-headline-xl md:text-headline-xl text-on-surface mb-2">
              Welcome back, {userName}.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Your robotics learning journey is looking solid today.</p>
          </div>
          <div className="hidden md:flex items-center gap-md">
            <div className="relative cursor-pointer" onClick={() => showToast('🔔 No new announcements.')}>
              <span className="material-symbols-outlined text-secondary hover:text-primary-container">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary-container rounded-full"></span>
            </div>
            <img 
              className="w-10 h-10 rounded-full object-cover elevation-1" 
              src="/assets/asset_67f8ecd0d5.png" 
              alt="User profile"
            />
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-lg">
          
          {/* Learning Stats (Span 8) */}
          <div className="md:col-span-8 bg-surface-container-lowest border border-secondary-container rounded-xl p-md md:p-lg transition-all shadow-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Learning Activity</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              <div>
                <div className="font-label-md text-label-md text-secondary uppercase tracking-wider">Hours</div>
                <div className="font-headline-lg text-headline-lg text-primary-container mt-1">{stats.hours}</div>
              </div>
              <div>
                <div className="font-label-md text-label-md text-secondary uppercase tracking-wider">Projects</div>
                <div className="font-headline-lg text-headline-lg text-on-surface mt-1">{stats.projects}</div>
              </div>
              <div>
                <div className="font-label-md text-label-md text-secondary uppercase tracking-wider">Certificates</div>
                <div className="font-headline-lg text-headline-lg text-on-surface mt-1">{stats.certificates}</div>
              </div>
              <div>
                <div className="font-label-md text-label-md text-secondary uppercase tracking-wider">Streak</div>
                <div className="font-headline-lg text-headline-lg text-primary-container mt-1 flex items-baseline gap-1">
                  {stats.streak} 
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_fire_department
                  </span>
                </div>
              </div>
            </div>
            {/* Fake chart block */}
            <div className="mt-lg w-full h-32 bg-surface-container rounded-lg relative overflow-hidden flex items-end px-4 gap-2">
              <div className="w-full bg-primary-container rounded-t-sm h-1/4 opacity-40"></div>
              <div className="w-full bg-primary-container rounded-t-sm h-2/4 opacity-60"></div>
              <div className="w-full bg-primary-container rounded-t-sm h-1/3 opacity-40"></div>
              <div className="w-full bg-primary-container rounded-t-sm h-3/4 opacity-80"></div>
              <div className="w-full bg-primary-container rounded-t-sm h-full"></div>
              <div className="w-full bg-primary-container rounded-t-sm h-2/3 opacity-60"></div>
              <div className="w-full bg-primary-container rounded-t-sm h-1/2 opacity-40"></div>
            </div>
          </div>

          {/* Calendar Widget (Span 4) */}
          <div className="md:col-span-4 bg-surface-container-lowest border border-secondary-container rounded-xl p-md shadow-sm">
            <div className="flex justify-between items-center mb-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">Upcoming</h2>
              <span className="material-symbols-outlined text-secondary">calendar_today</span>
            </div>
            <div className="flex flex-col gap-sm">
              <div className="p-sm bg-surface-container-low rounded-lg border-l-4 border-primary-container">
                <div className="font-label-md text-label-md text-primary-container mb-1">Today, 2:00 PM</div>
                <div className="font-body-md text-body-md font-semibold text-on-surface">Advanced Kinematics Lab</div>
                <div className="font-label-md text-label-md text-secondary mt-1">Live Session • Room 4B</div>
              </div>
              <div className="p-sm bg-surface-container-low rounded-lg border border-surface-variant">
                <div className="font-label-md text-label-md text-secondary mb-1">Tomorrow, 10:00 AM</div>
                <div className="font-body-md text-body-md font-semibold text-on-surface">Project Submission</div>
                <div className="font-label-md text-label-md text-secondary mt-1">Autonomous Navigation</div>
              </div>
            </div>
          </div>

        </div>

        {/* My Courses Section */}
        <div className="mb-lg">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">My Courses</h2>
            <Link to="/courses" className="font-label-md text-label-md text-primary-container hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            
            {myCourses.map((course) => {
              const progressVal = courseProgress[course.id] !== undefined ? courseProgress[course.id] : 0;
              return (
                <div 
                  key={course.id} 
                  className="bg-surface-container-lowest border border-secondary-container rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div 
                    className="bg-cover bg-center w-full h-40" 
                    style={{ backgroundImage: `url('/${course.image}')` }}
                  ></div>
                  <div className="p-md flex-1 flex flex-col">
                    <div className="flex gap-2 mb-3">
                      <span className="bg-primary-fixed px-2 py-1 rounded-sm font-label-md text-[10px] text-on-primary-fixed uppercase font-bold">
                        {progressVal === 100 ? 'Completed' : 'In Progress'}
                      </span>
                      <span className="bg-surface-variant px-2 py-1 rounded-sm font-label-md text-[10px] text-on-surface-variant uppercase font-bold">
                        {course.category}
                      </span>
                    </div>
                    <Link to="/learning-portal" className="hover:text-primary transition-colors">
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{course.title}</h3>
                    </Link>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-md flex-1 text-sm">
                      {course.description || 'Access code modules, simulate kinematics arms, and configure hardware nodes.'}
                    </p>
                    <div className="mt-auto">
                      <div className="flex justify-between font-label-md text-label-md text-sm mb-1 text-on-surface-variant">
                        <span>{progressVal}% Complete</span>
                        <span>{progressVal === 100 ? 'Done' : 'Mod 3/5'}</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div className="bg-primary-container h-full rounded-full" style={{ width: `${progressVal}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Enroll explore card */}
            <div 
              onClick={() => navigate('/courses')}
              className="bg-surface-container-lowest border-dashed border-2 border-surface-variant rounded-xl p-md flex flex-col justify-center items-center text-center hover:bg-surface-container-low transition-colors cursor-pointer min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary-container text-3xl">explore</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Enroll in New Courses</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md text-sm max-w-[200px]">
                Expand your skills with advanced robotics and AI programs.
              </p>
              <button className="bg-primary-container text-on-primary font-bold rounded-lg px-6 py-2 hover:bg-primary transition-colors font-label-md uppercase">
                Browse Catalog
              </button>
            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
