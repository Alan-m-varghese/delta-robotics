import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, API_BASE } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';

export default function LearningPortal() {
  const { user, courseProgress, logout, courses, loading, enrollmentStatuses } = useContext(AuthContext);
  const { showToast } = useContext(UIContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('Overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseId = params.get('course');
    if (courseId && courses && courses.length > 0) {
      const match = courses.find(c => c.id === courseId || c.localSlug === courseId);
      if (match) {
        setActiveCourse(match);
      }
    }
  }, [location, courses]);

  const displayCourse = activeCourse || (courses && courses.length > 0 ? courses[0] : null);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!displayCourse) return;
      setMaterialsLoading(true);
      try {
        const token = localStorage.getItem('dr_access_token');
        const response = await fetch(`${API_BASE}/courses/${displayCourse.id}/materials/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMaterials(data);
        }
      } catch (err) {
        console.error('Error fetching materials:', err);
      } finally {
        setMaterialsLoading(false);
      }
    };
    fetchMaterials();
  }, [displayCourse]);

  useEffect(() => {
    if (!loading && !user) {
      showToast('🔒 Please log in to access the classroom.');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    if (!loading && user && displayCourse) {
      const userRole = user.role ? user.role.toLowerCase() : 'student';
      if (userRole !== 'admin' && userRole !== 'intern') {
        const status = enrollmentStatuses[displayCourse.id];
        if (status !== 'active') {
          showToast('🔒 Classroom locked: Payment verification pending.');
          navigate('/dashboard');
        }
      }
    }
  }, [user, loading, navigate, displayCourse, enrollmentStatuses]);

  const userName = user ? user.name : 'Alex';
  const progressVal = displayCourse && courseProgress[displayCourse.id] !== undefined 
    ? courseProgress[displayCourse.id] 
    : 45;

  const handleLogout = () => {
    logout();
    showToast('🔐 Logged out successfully.');
    navigate('/');
  };

  if (!displayCourse) {
    return (
      <div className="pt-32 bg-background min-h-screen text-center text-on-surface-variant flex flex-col items-center justify-center p-md">
        <span className="material-symbols-outlined text-6xl text-primary mb-md">school</span>
        <h2 className="font-headline-lg text-headline-lg mb-sm text-on-surface">No Classroom Access</h2>
        <p className="font-body-lg text-body-lg max-w-md mb-lg">
          You are not enrolled in any active courses yet. Browse our course catalog to find a program and enroll today.
        </p>
        <Link 
          to="/courses" 
          className="bg-primary-container text-on-primary font-bold px-lg py-md rounded-lg hover:bg-primary transition-all font-label-md uppercase tracking-wide"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md antialiased flex flex-col md:flex-row min-h-screen transition-colors duration-200">
      
      {/* Mobile TopNavBar */}
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
            src="/assets/asset_8be7ae004f.png" 
            alt="Profile Avatar"
          />
        </div>
      </header>

      {/* SideNavBar (Desktop & Mobile Slide-out) */}
      <nav className={`h-screen w-64 fixed left-0 top-0 bg-surface-container dark:bg-surface-container-high flex flex-col py-md z-40 transition-transform duration-300 md:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="px-md mb-lg">
          <div className="flex items-center gap-sm mb-4">
            <img 
              alt="Robotics Course Logo" 
              className="w-12 h-12 rounded-lg object-cover bg-white p-1 border border-secondary-container" 
              src={displayCourse?.image ? `/${displayCourse.image}` : "/assets/asset_0ba516959f.png"} 
            />
            <div>
              <h2 className="font-headline-md text-headline-md text-primary truncate w-40" title={displayCourse?.title || "Intro to ROS 2"}>
                {displayCourse?.title || "Intro to ROS 2"}
              </h2>
              <p className="font-label-md text-label-md text-on-surface-variant truncate w-40 text-xs" title={displayCourse?.category || "Software"}>
                {displayCourse?.category || "Software"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => showToast('📹 Entering simulated Live Classroom...')}
            className="w-full bg-primary-container text-on-primary font-headline-md text-[16px] py-3 rounded font-bold uppercase tracking-wide hover:bg-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              video_camera_front
            </span>
            Join Live Lab
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto px-xs font-label-md text-label-md">
          <li>
            <Link 
              to="/dashboard" 
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-primary-fixed hover:text-on-primary-fixed-variant rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>
          </li>
          <li>
            <a 
              href="#curriculum"
              onClick={(e) => { e.preventDefault(); showToast('📚 Replaced with current course modules.'); }}
              className="bg-primary-container text-on-primary-container font-bold rounded-lg m-2 p-3 flex items-center gap-3 transition-all border border-outline-variant"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              Curriculum
            </a>
          </li>
          <li>
            <a 
              href="#kit" 
              onClick={(e) => { e.preventDefault(); showToast('📦 Hardware package tracker active.'); }}
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-primary-fixed hover:text-on-primary-fixed-variant rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">precision_manufacturing</span>
              Hardware Kit
            </a>
          </li>
          <li>
            <a 
              href="#simulations" 
              onClick={(e) => { e.preventDefault(); showToast('🎮 Opening Web Gazebo environment...'); }}
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-primary-fixed hover:text-on-primary-fixed-variant rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">model_training</span>
              Simulations
            </a>
          </li>
        </ul>

        <div className="px-xs mt-auto pt-4 border-t border-secondary-container font-label-md text-label-md">
          <button 
            onClick={handleLogout}
            className="w-full text-left text-on-surface-variant dark:text-on-secondary-fixed-variant m-2 p-3 flex items-center gap-3 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-red-500">logout</span>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        
        {/* Desktop Header */}
        <header className="hidden md:flex justify-between px-margin-desktop bg-surface dark:bg-inverse-surface border-b border-secondary-container dark:border-secondary h-16 items-center sticky top-0 z-30">
          <div className="flex items-center gap-md">
            <span className="font-headline-md text-headline-md font-bold text-primary-container dark:text-primary-fixed-dim">
              Delta Robotics Classroom
            </span>
          </div>
          <div className="flex-grow flex justify-end items-center gap-md">
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-secondary-container">
              <button 
                onClick={() => showToast('🎓 Member Premium unlocked.')}
                className="text-primary-container font-bold text-sm uppercase tracking-wide hover:text-primary transition-colors"
              >
                Go Pro
              </button>
              <img 
                alt="User profile" 
                className="w-8 h-8 rounded-full border border-secondary-container object-cover" 
                src="/assets/asset_8be7ae004f.png" 
              />
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="flex-grow p-margin-mobile md:p-margin-desktop overflow-y-auto bg-surface-bright">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-gutter">
            
            {/* Left Column: Video & Tabs (Span 8) */}
            <div className="xl:col-span-8 flex flex-col gap-lg">
              
              {/* Video Player Card */}
              <div className="bg-surface rounded-xl border border-secondary-container overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                
                {/* Playback Container */}
                <div 
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="aspect-video w-full bg-inverse-surface relative group cursor-pointer flex items-center justify-center"
                >
                  <div 
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
                      isVideoPlaying ? 'opacity-30 group-hover:opacity-20' : 'opacity-70 group-hover:opacity-50'
                    }`} 
                    style={{ backgroundImage: 'url("/assets/asset_03fb68cbda.png")' }}
                  ></div>

                  {isVideoPlaying ? (
                    <div className="text-white text-center z-10 flex flex-col items-center">
                      <span className="material-symbols-outlined text-6xl animate-pulse">pause_circle</span>
                      <p className="font-label-md text-sm mt-2 opacity-70">Video lecture is active. Click to pause.</p>
                    </div>
                  ) : (
                    <div className="relative z-10 w-20 h-20 bg-primary-container/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-on-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        play_arrow
                      </span>
                    </div>
                  )}

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-white">
                        {isVideoPlaying ? 'pause' : 'play_arrow'}
                      </span>
                      <span className="font-label-md text-xs">12:45 / 45:00</span>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="w-full h-1 bg-white/30 rounded-full relative">
                        <div className="absolute left-0 top-0 h-full bg-primary-container rounded-full w-1/4"></div>
                        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-white">volume_up</span>
                      <span className="material-symbols-outlined text-white">settings</span>
                      <span className="material-symbols-outlined text-white">fullscreen</span>
                    </div>
                  </div>
                </div>

                {/* Video Title Meta */}
                <div className="p-md bg-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded text-xs font-label-md uppercase tracking-wider font-bold">Module 3.2</span>
                        <span className="px-2 py-1 bg-surface-container text-on-surface-variant rounded text-xs font-label-md uppercase tracking-wider">Intermediate</span>
                      </div>
                      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Kinematics and Motion Planning</h1>
                      <p className="font-body-lg text-body-lg text-on-surface-variant">Learn the mathematical foundations required to calculate the position and orientation of robotic end-effectors in 3D space.</p>
                    </div>
                    <button 
                      onClick={() => showToast('👉 Loading next lesson...')}
                      className="bg-primary-container text-on-primary px-6 py-3 rounded-lg font-headline-md text-sm uppercase tracking-wide font-bold hover:bg-primary transition-colors flex items-center gap-2 flex-shrink-0 shadow-sm hover:shadow cursor-pointer"
                    >
                      Next Lesson
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Tabs Section */}
              <div className="bg-white rounded-xl border border-secondary-container p-0 overflow-hidden">
                <div className="flex border-b border-secondary-container px-md bg-surface-bright">
                  {['Overview', 'Materials', 'Transcript', 'Discussion (24)'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.startsWith('Discussion') ? 'Discussion' : tab)}
                      className={`py-4 px-2 border-b-2 font-headline-md text-sm font-bold mr-6 transition-all ${
                        (tab.startsWith('Discussion') ? activeTab === 'Discussion' : activeTab === tab)
                          ? 'border-primary-container text-primary-container'
                          : 'border-transparent text-secondary hover:text-primary-container'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                <div className="p-md">
                  {activeTab === 'Overview' && (
                    <>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Lesson Objectives</h3>
                      <ul className="list-none space-y-3 mb-8">
                        <li className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary-container mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="font-body-md text-on-surface-variant">Understand Forward and Inverse Kinematics.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary-container mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="font-body-md text-on-surface-variant">Apply Denavit-Hartenberg (DH) parameters to model robotic arms.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary-container mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="font-body-md text-on-surface-variant">Implement basic motion planning algorithms in ROS 2 using MoveIt!.</span>
                        </li>
                      </ul>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Code Snippet</h3>
                      <div className="bg-inverse-surface rounded-lg p-4 font-label-md text-sm text-surface overflow-x-auto">
                        <pre><code>{`import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped

class MotionPlanner(Node):
    def __init__(self):
        super().__init__('motion_planner_node')
        self.publisher_ = self.create_publisher(PoseStamped, 'goal_pose', 10)
        # Initialization logic...`}</code></pre>
                      </div>
                    </>
                  )}

                  {activeTab === 'Materials' && (
                    <div className="flex flex-col gap-sm">
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Course Materials</h3>
                      <p className="text-xs text-on-surface-variant font-body-md mb-md">Download supplementary textbooks, lab guides, and slides.</p>
                      
                      {materialsLoading ? (
                        <p className="text-secondary font-body-md text-sm">Loading materials...</p>
                      ) : materials.length > 0 ? (
                        <div className="grid grid-cols-1 gap-sm">
                          {materials.map((mat) => (
                            <a 
                              key={mat.id}
                              href={mat.file}
                              target="_blank"
                              rel="noreferrer"
                              className="p-sm bg-surface-container-low rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center gap-sm">
                                <span className="material-symbols-outlined text-primary text-[24px]">
                                  {mat.material_type === 'pdf' ? 'description' : 'movie'}
                                </span>
                                <div>
                                  <div className="font-body-md text-sm font-semibold text-on-surface">{mat.title}</div>
                                  <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">{mat.material_type} Document</div>
                                </div>
                              </div>
                              <span className="material-symbols-outlined text-secondary">download</span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-on-surface-variant font-body-md text-sm bg-surface-container-low rounded-lg border border-outline-variant p-4">
                          <span className="material-symbols-outlined text-3xl mb-xs text-secondary">drafts</span>
                          <p>No materials uploaded for this course yet.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Transcript' && (
                    <div className="space-y-4 text-on-surface-variant font-body-md text-sm leading-relaxed">
                      <p><span className="font-bold text-primary mr-2">00:15</span> Welcome back. In this lecture, we are diving deep into motion control and kinematics.</p>
                      <p><span className="font-bold text-primary mr-2 font-mono">05:40</span> When programming industrial robot joints, we rely on transformations to compute end-effector space positions. This brings us to Forward Kinematics.</p>
                      <p><span className="font-bold text-primary mr-2 font-mono">15:20</span> In the second half of the lesson, we will implement the subscriber node to listen to goal coordinates.</p>
                    </div>
                  )}

                  {activeTab === 'Discussion' && (
                    <div className="space-y-4">
                      <div className="border-b border-secondary-container pb-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-on-surface">Ada Lovelace</span>
                          <span className="text-xs text-secondary">2 hours ago</span>
                        </div>
                        <p className="font-body-md text-sm text-on-surface-variant">Does this node structure support multi-threaded executors in ROS2? I noticed latency in the simulation.</p>
                      </div>
                      <div className="border-b border-secondary-container pb-sm pl-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-primary">Instructor Support</span>
                          <span className="text-xs text-secondary">1 hour ago</span>
                        </div>
                        <p className="font-body-md text-sm text-on-surface-variant">Yes! You can configure a MultiThreadedExecutor inside the main loop instead of the standard rclpy.spin().</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Progress & Accordion Modules (Span 4) */}
            <div className="xl:col-span-4 flex flex-col gap-md">
              
              {/* Circular Progress Card */}
              <div className="bg-white rounded-xl border border-secondary-container p-md flex flex-col items-center shadow-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 w-full text-left">Your Progress</h3>
                <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#e5e2e1" strokeWidth="10" />
                    {/* Dynamic stroke dashoffset based on progress */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      fill="transparent" 
                      r="40" 
                      stroke="#ff6b00" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * progressVal) / 100} 
                      strokeLinecap="round" 
                      strokeWidth="10" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-headline-xl text-headline-xl text-on-surface">{progressVal}%</span>
                    <span className="font-label-md text-xs text-on-surface-variant">Completed</span>
                  </div>
                </div>
                <p className="font-body-md text-sm text-on-surface-variant text-center mt-2">12 of 28 lessons finished</p>
              </div>

              {/* Course Content Modules Accordion */}
              <div className="bg-white rounded-xl border border-secondary-container overflow-hidden shadow-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-secondary-container bg-surface-bright flex justify-between items-center sticky top-0 z-10">
                  <h3 className="font-headline-md text-lg text-on-surface font-bold">Course Content</h3>
                </div>
                
                <div className="overflow-y-auto flex-1">
                  {displayCourse?.backend_raw?.materials && displayCourse.backend_raw.materials.length > 0 ? (
                    <div className="border-b border-secondary-container">
                      <div className="w-full p-4 flex justify-between items-center bg-primary-fixed/20 text-left border-l-4 border-primary-container">
                        <div>
                          <h4 className="font-headline-md text-sm text-on-surface font-bold">Course Lessons</h4>
                          <p className="font-label-md text-xs text-primary mt-1">{displayCourse.backend_raw.materials.length} Lessons</p>
                        </div>
                      </div>
                      <div className="bg-white">
                        {displayCourse.backend_raw.materials.map((m, idx) => (
                          <a 
                            key={m.id}
                            href="#video"
                            onClick={(e) => { 
                              e.preventDefault(); 
                              showToast(`📺 Loading lesson: ${m.title}`);
                            }}
                            className="flex items-center gap-3 p-3 pl-6 hover:bg-surface-container-low transition-colors border-b border-surface-variant group relative"
                          >
                            <span className="material-symbols-outlined text-primary-container text-[20px]">play_circle</span>
                            <div className="flex-1">
                              <p className="font-body-md text-sm text-on-surface font-semibold group-hover:text-primary-container transition-colors">
                                {idx + 1}. {m.title}
                              </p>
                              <p className="font-label-md text-[10px] text-primary-container mt-0.5">{m.type.toUpperCase()}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-lg text-center text-on-surface-variant font-body-md text-body-md">
                      <span className="material-symbols-outlined text-3xl mb-sm block text-secondary">import_contacts</span>
                      No curriculum lessons uploaded for this course yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Downloads list */}
              <div className="bg-white rounded-xl border border-secondary-container p-md shadow-sm">
                <h3 className="font-headline-md text-lg text-on-surface font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">folder_special</span>
                  Downloads
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="#download-slides" 
                      onClick={(e) => { e.preventDefault(); showToast('📥 Downloading Lecture Slides (PDF)...'); }}
                      className="flex items-center p-3 rounded-lg border border-secondary-container hover:border-primary-container hover:bg-primary-fixed/10 transition-all group"
                    >
                      <div className="bg-surface-container p-2 rounded mr-3 group-hover:bg-primary-container group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-sm font-semibold text-on-surface group-hover:text-primary-container transition-colors">Lecture Slides (PDF)</p>
                        <p className="font-label-md text-xs text-on-surface-variant">2.4 MB</p>
                      </div>
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary-container">download</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#download-code" 
                      onClick={(e) => { e.preventDefault(); showToast('📥 Downloading ROS2 Starter Workspace (.zip)...'); }}
                      className="flex items-center p-3 rounded-lg border border-secondary-container hover:border-primary-container hover:bg-primary-fixed/10 transition-all group"
                    >
                      <div className="bg-surface-container p-2 rounded mr-3 group-hover:bg-primary-container group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">code</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-sm font-semibold text-on-surface group-hover:text-primary-container transition-colors">Starter Workspace (.zip)</p>
                        <p className="font-label-md text-xs text-on-surface-variant">15.1 MB</p>
                      </div>
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary-container">download</span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-lg border-t border-secondary bg-inverse-surface mt-auto z-10 flex flex-col md:flex-row justify-between items-center px-margin-desktop gap-base">
          <div className="font-headline-md text-headline-md text-white">Delta Robotics</div>
          <div className="text-primary-fixed-dim font-body-md text-body-md text-center">
            © 2024 RoboAcademy. All rights reserved. Built for the next generation of engineers.
          </div>
          <nav className="flex gap-4">
            <a className="text-secondary-fixed-dim font-body-md text-body-md hover:text-primary-fixed transition-colors" href="#terms" onClick={(e) => { e.preventDefault(); showToast('Terms of Service dialog'); }}>Terms</a>
            <a className="text-secondary-fixed-dim font-body-md text-body-md hover:text-primary-fixed transition-colors" href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Privacy Policy dialog'); }}>Privacy</a>
          </nav>
        </footer>

      </main>

    </div>
  );
}
