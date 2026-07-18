import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, API_BASE } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';
import { COURSES_DB } from '../data/courses';

export default function Dashboard() {
  const { user, enrolledCourses, enrollmentStatuses, courseProgress, stats, logout, courses, loading } = useContext(AuthContext);
  const { showToast } = useContext(UIContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      showToast('🔒 Please log in to view your dashboard.');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [user, loading, navigate]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('dr_access_token');
        if (!token) return;
        const response = await fetch(`${API_BASE}/announcements/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };
    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  // If user is not logged in, we use fallback mock data or prompt
  const userName = user ? user.name : 'Alex';
  const userRole = user ? user.role.toLowerCase() : 'student';

  // Map enrolled course IDs to actual course database details
  const myCourses = enrolledCourses.map(id => {
    const course = courses.find(c => c.id === id || c.localSlug === id);
    if (course) {
      return {
        ...course,
        enrollmentStatus: enrollmentStatuses[id] || 'pending_payment'
      };
    }
    return null;
  }).filter(Boolean);

  const myAnnouncements = announcements.filter(a => enrolledCourses.includes(a.course));

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
              to={enrolledCourses.length > 0 ? `/learning-portal?course=${enrolledCourses[0]}` : '/learning-portal'} 
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-primary-fixed hover:text-on-primary-fixed-variant rounded-lg transition-transform duration-150 active:translate-x-1"
            >
              <span className="material-symbols-outlined">model_training</span> 
              Classroom
            </Link>
             <Link 
              to={enrolledCourses.length > 0 ? `/learning-portal?course=${enrolledCourses[0]}` : '/learning-portal'} 
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-primary-fixed hover:text-on-primary-fixed-variant rounded-lg transition-transform duration-150 active:translate-x-1"
             >
               <span className="material-symbols-outlined">folder_open</span> 
               Resources
             </Link>
          </div>
        </div>

        <div className="px-sm flex flex-col gap-xs font-label-md text-label-md">
          <Link 
            to={enrolledCourses.length > 0 ? `/learning-portal?course=${enrolledCourses[0]}` : '/learning-portal'} 
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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-md pt-4 md:pt-0">
          <div>
            <h1 className="font-headline-xl text-headline-xl md:text-headline-xl text-on-surface mb-2">
              Welcome back, {userName}.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {userRole === 'student'
                ? "Your robotics learning journey is looking solid today."
                : "Staff Management Console. Review approvals and manage laboratory inventory."
              }
            </p>
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

        {/* Render student vs staff panels */}
        {userRole === 'student' ? (
          /* Layout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-lg items-stretch">
            
            {/* My Classroom (Span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-md">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">My Classroom</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md flex-grow">
                {myCourses.map((course) => {
                  const progressVal = courseProgress[course.id] !== undefined ? courseProgress[course.id] : 0;
                  const isActive = course.enrollmentStatus === 'active';
                  return (
                    <div 
                      key={course.id}
                      onClick={() => {
                        if (isActive) {
                          navigate(`/learning-portal?course=${course.id}`);
                        } else {
                          showToast('🔒 Payment verification pending. Class starts once approved.');
                        }
                      }}
                      className={`bg-surface-container-lowest border border-secondary-container rounded-xl overflow-hidden flex flex-col h-full relative ${
                        isActive ? 'cursor-pointer hover:shadow-md transition-shadow' : 'opacity-70'
                      }`}
                    >
                      <div className="h-40 relative block">
                        <img className="w-full h-full object-cover" src={`/${course.image}`} alt={course.title} />
                        <div className={`absolute top-sm right-sm font-label-md text-label-md px-3 py-1 rounded-full border backdrop-blur-sm bg-white/90 ${
                          isActive ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
                        }`}>
                          {isActive ? 'Active' : 'Verification Pending'}
                        </div>
                      </div>
                      
                      <div className="p-md flex flex-col flex-grow">
                        <span className="text-secondary font-label-md text-[10px] font-bold uppercase tracking-widest">{course.badge}</span>
                        <h3 className="font-headline-sm text-headline-md font-bold text-on-surface mt-xs line-clamp-1">{course.title}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant flex-grow mt-xs line-clamp-2">{course.description}</p>
                        
                        {isActive && (
                          <div className="mt-md pt-sm border-t border-secondary-container">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-label-md text-xs text-secondary">Course Progress</span>
                              <span className="font-label-md text-xs text-on-surface font-semibold">{progressVal}%</span>
                            </div>
                            <div className="w-full bg-surface-container rounded-full h-2">
                              <div className="bg-primary-container h-2 rounded-full" style={{ width: `${progressVal}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Enroll explore card */}
                <div 
                  onClick={() => navigate('/courses')}
                  className="bg-surface-container-lowest border-dashed border-2 border-surface-variant rounded-xl p-md flex flex-col justify-center items-center text-center hover:bg-surface-container-low transition-colors cursor-pointer min-h-[250px]"
                >
                  <span className="material-symbols-outlined text-4xl text-secondary mb-2">add_circle</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Enroll in New Course</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Browse our curriculum catalog to unlock more certifications.</p>
                </div>
              </div>
            </div>

            {/* Latest Announcements (Span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-md">
              <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[24px]">campaign</span>
                Announcements
              </h2>
              <div className="bg-surface-container-lowest border border-secondary-container rounded-xl p-md md:p-lg shadow-sm flex flex-col flex-grow min-h-[300px]">
                <div className="overflow-y-auto flex-grow flex flex-col gap-sm pr-1 max-h-[380px]">
                  {myAnnouncements.length > 0 ? (
                    myAnnouncements.map((ann) => (
                      <div key={ann.id} className="p-sm bg-surface-container-low rounded-lg border-l-4 border-primary-container flex flex-col gap-xs">
                        <div className="font-body-md text-sm font-semibold text-on-surface">{ann.title}</div>
                        <div className="font-body-md text-xs text-on-surface-variant line-clamp-3">{ann.content}</div>
                        <div className="font-label-md text-[10px] text-secondary mt-1">
                          {new Date(ann.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-on-surface-variant p-md">
                      <span className="material-symbols-outlined text-4xl mb-sm text-secondary">notifications_off</span>
                      <p className="font-body-md text-xs">No announcements yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Staff Layout Grid */
          <div className="flex flex-col gap-md">
            <SystemAdministrationPanel />
            <InventoryPanel />
          </div>
        )}

      </main>

    </div>
  );
}

function InventoryPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const token = localStorage.getItem('dr_access_token');
        const response = await fetch(`${API_BASE}/inventory/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setItems(data);
        } else {
          setError(data.detail || 'Failed to fetch inventory.');
        }
      } catch (err) {
        setError('Network error fetching inventory.');
      } finally {
        setLoading(false);
      }
    };
    fetchInventoryData();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-container-lowest border border-secondary-container rounded-xl p-lg shadow-sm mb-lg mt-md">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Inventory Control Panel</h2>
        <p className="text-secondary font-body-md text-body-md">Loading stock details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-container-lowest border border-secondary-container rounded-xl p-lg shadow-sm mb-lg mt-md">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Inventory Control Panel</h2>
        <p className="text-red-500 font-body-md text-body-md">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-secondary-container rounded-xl p-lg shadow-sm mb-lg mt-md">
      <div className="flex justify-between items-center mb-md">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Inventory Control Panel</h2>
          <p className="text-xs text-on-surface-variant font-body-md mt-1">Real-time hardware stock levels for Delta Labs</p>
        </div>
        <span className="material-symbols-outlined text-primary text-3xl">precision_manufacturing</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-body-md text-sm text-on-surface-variant">
          <thead>
            <tr className="border-b border-secondary-container text-secondary font-semibold uppercase tracking-wider text-xs">
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Storage Location</th>
              <th className="py-3 px-4 text-center">Stock Quantity</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-secondary-container/50 hover:bg-surface-container-low/50 transition-colors">
                <td className="py-4 px-4 font-semibold text-on-surface">{item.name}</td>
                <td className="py-4 px-4">{item.category_name}</td>
                <td className="py-4 px-4">{item.location || 'Store Room'}</td>
                <td className="py-4 px-4 text-center font-mono">{item.quantity} {item.unit || 'pcs'}</td>
                <td className="py-4 px-4 text-right">
                  {item.is_low_stock ? (
                    <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 font-bold px-3 py-1 rounded-full text-xs border border-red-500/20">
                      <span className="material-symbols-outlined text-xs">warning</span> LOW STOCK
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 font-bold px-3 py-1 rounded-full text-xs border border-green-500/20">
                      <span className="material-symbols-outlined text-xs">check_circle</span> OK
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-secondary">No inventory items registered in the database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemAdministrationPanel() {
  const adminUrl = "https://delta-backend-ohze.onrender.com/admin/";
  return (
    <div className="bg-surface-container-lowest border border-secondary-container rounded-xl p-lg shadow-sm mb-lg">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-xs flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[28px]">admin_panel_settings</span>
        System Administration
      </h2>
      <p className="text-xs text-on-surface-variant font-body-md mb-md">Manage user accounts, courses, and verify student tuition payments.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary-container text-[24px]">payments</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Enrollment approvals</h3>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant flex-grow">
            Student tuition payments are managed within the secure backend database. To activate pending registrations:
          </p>
          <ul className="list-disc pl-5 font-body-md text-xs text-on-surface-variant space-y-1 mb-xs">
            <li>Log in to the Django Admin Console.</li>
            <li>Go to the <b>Enrollments</b> section.</li>
            <li>Select the student's pending request.</li>
            <li>Change the status to <b>Active</b> and save.</li>
          </ul>
          <a 
            href={adminUrl} 
            target="_blank" 
            rel="noreferrer"
            className="bg-primary-container text-on-primary font-bold py-2 px-4 rounded-lg text-center hover:bg-primary transition-colors text-xs uppercase inline-block self-start"
          >
            Open Django Admin
          </a>
        </div>

        <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary-container text-[24px]">auto_stories</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Course catalog &amp; materials</h3>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant flex-grow">
            Database records for courses, syllabus chapters, and materials are controlled directly through Django models:
          </p>
          <ul className="list-disc pl-5 font-body-md text-xs text-on-surface-variant space-y-1 mb-xs">
            <li>Create new courses and set pricing levels.</li>
            <li>Upload lecture PDFs, slides, and video links.</li>
            <li>Publish site-wide announcements.</li>
          </ul>
          <a 
            href={adminUrl} 
            target="_blank" 
            rel="noreferrer"
            className="bg-secondary text-white font-bold py-2 px-4 rounded-lg text-center hover:bg-on-surface transition-colors text-xs uppercase inline-block self-start"
          >
            Manage Databases
          </a>
        </div>
      </div>
    </div>
  );
}
