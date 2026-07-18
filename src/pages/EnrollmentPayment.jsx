import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';
import { COURSES_DB } from '../data/courses';

export default function EnrollmentPayment() {
  const { enrollInCourse, courses, user, loading } = useContext(AuthContext);
  const { showToast, showModal } = useContext(UIContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      showToast('🔒 Please log in to enroll and submit payment details.');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  // Selected course details
  const [selectedCourseId, setSelectedCourseId] = useState('autonomous-systems');
  const [studentInfo, setStudentInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Sync course selection with URL query param on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseId = params.get('course');
    if (courseId) {
      setSelectedCourseId(courseId);
    }
  }, [location]);

  const activeCourse = courses.find(c => c.id === selectedCourseId || c.localSlug === selectedCourseId);

  if (!activeCourse) {
    return (
      <div className="pt-32 text-center text-on-surface-variant bg-background min-h-screen flex flex-col items-center justify-center p-md">
        <span className="material-symbols-outlined text-6xl text-primary mb-md">warning</span>
        <h2 className="font-headline-lg text-headline-lg mb-sm text-on-surface">Invalid Course</h2>
        <p className="font-body-lg text-body-lg max-w-md mb-lg">
          The selected course could not be found or is not yet available in the database.
        </p>
        <Link 
          to="/courses" 
          className="bg-primary-container text-on-primary font-bold px-lg py-md rounded-lg hover:bg-primary transition-all font-label-md uppercase tracking-wide"
        >
          View Course Catalog
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setStudentInfo({
      ...studentInfo,
      [e.target.id]: e.target.value
    });
  };

  const handleDropdownChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
      showToast('📎 File attached successfully.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
      showToast('📎 File attached successfully.');
    }
  };

  const handleCompleteEnrollment = () => {
    const { firstName, lastName, email, phone } = studentInfo;
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      showToast('⚠️ Please enter student information.');
      return;
    }

    showModal(
      'Confirm Payment Submission',
      `You are submitting transaction proof for "${activeCourse.title}". Registration will be activated once our payment node verifies the receipt.`,
      'SUBMIT PROOF',
      async () => {
        setIsEnrolling(true);
        const result = await enrollInCourse(activeCourse.id);
        setIsEnrolling(false);
        if (result.success) {
          showToast(`🎉 Registration receipt uploaded! "${activeCourse.title}" is now active on your dashboard.`);
          navigate('/dashboard');
        } else {
          showToast(`❌ Enrollment failed: ${result.error}`);
        }
      }
    );
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md text-body-md transition-colors duration-200">
      
      {/* TopAppBar (Transactional - Hidden Navigation Shell for focus) */}
      <header className="bg-surface border-b border-secondary-container w-full top-0 sticky z-50 transition-colors duration-200">
        <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-primary">Delta Robotics</div>
          <div className="flex items-center gap-md">
            <Link className="text-secondary hover:text-primary transition-colors flex items-center gap-xs" to="/courses">
              <span className="material-symbols-outlined text-[20px]">close</span>
              <span className="hidden md:inline font-label-md text-label-md">Cancel Enrollment</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg md:py-xl">
        {/* Hero Section */}
        <div className="mb-lg max-w-3xl">
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-base tracking-tight">Enroll in Your Future</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Complete your registration for the upcoming cohort. Follow the secure payment process below to secure your spot.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          
          {/* Left Column: Enrollment Form */}
          <div className="lg:col-span-7 flex flex-col gap-md">
            <div className="bg-surface-container-lowest border border-secondary-container rounded-xl p-md md:p-lg shadow-sm">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md border-b border-secondary-container pb-sm">
                Student Information
              </h2>
              <form className="space-y-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-sm md:gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="firstName">First Name</label>
                    <input 
                      className="rounded-lg border-outline-variant bg-surface-container-lowest focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface h-12 px-sm transition-colors border outline-none" 
                      id="firstName" 
                      placeholder="Ada" 
                      type="text"
                      value={studentInfo.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="lastName">Last Name</label>
                    <input 
                      className="rounded-lg border-outline-variant bg-surface-container-lowest focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface h-12 px-sm transition-colors border outline-none" 
                      id="lastName" 
                      placeholder="Lovelace" 
                      type="text"
                      value={studentInfo.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">Email Address</label>
                  <input 
                    className="rounded-lg border-outline-variant bg-surface-container-lowest focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface h-12 px-sm transition-colors border outline-none" 
                    id="email" 
                    placeholder="ada@example.com" 
                    type="email"
                    value={studentInfo.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="phone">Phone Number</label>
                  <input 
                    className="rounded-lg border-outline-variant bg-surface-container-lowest focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface h-12 px-sm transition-colors border outline-none" 
                    id="phone" 
                    placeholder="+1 (555) 000-0000" 
                    type="tel"
                    value={studentInfo.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-xs pt-sm border-t border-secondary-container">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="course">Course Selection</label>
                  <select 
                    className="rounded-lg border-outline-variant bg-surface-container-lowest focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface h-12 px-sm transition-colors border outline-none" 
                    id="course"
                    value={selectedCourseId}
                    onChange={handleDropdownChange}
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.price})
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Payment & Proof */}
          <div className="lg:col-span-5 flex flex-col gap-md">
            {/* Payment Card */}
            <div className="bg-surface-container-lowest border border-secondary-container rounded-xl p-md md:p-lg shadow-sm flex flex-col items-center text-center">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-xs w-full text-left">Payment Details</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md w-full text-left pb-sm border-b border-secondary-container">
                Scan the QR code below to complete your payment via your preferred banking app.
              </p>
              <div className="bg-surface-container-low p-sm rounded-lg mb-md border border-secondary-container">
                <img alt="QR Code for payment" className="w-48 h-48 object-contain rounded" src="/assets/asset_ccc105af95.png" />
              </div>
              <div className="flex justify-between w-full bg-surface-bright p-sm rounded-lg border border-secondary-container mb-sm">
                <span className="font-label-md text-label-md text-on-surface-variant">Amount to Pay:</span>
                <span className="font-headline-md text-headline-md text-primary-container font-bold">
                  {activeCourse.price}
                </span>
              </div>
            </div>

            {/* Proof of Payment Card */}
            <div className="bg-surface-container-lowest border border-secondary-container rounded-xl p-md md:p-lg shadow-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Proof of Payment</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md text-sm">
                Once paid, please upload a screenshot of your transaction confirmation for verification.
              </p>

              {/* Upload Drop Zone */}
              <div 
                className={`border-2 border-dashed rounded-lg p-md flex flex-col items-center justify-center bg-surface-container-lowest cursor-pointer mb-md transition-all ${
                  uploadedFile 
                    ? 'border-primary-container bg-primary-fixed/10'
                    : isDragOver
                      ? 'border-primary-container bg-surface-container-high'
                      : 'border-outline-variant hover:border-primary-container'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('proof-upload').click()}
              >
                <input 
                  accept="image/*,.pdf" 
                  className="hidden" 
                  id="proof-upload" 
                  type="file"
                  onChange={handleFileChange}
                />
                {uploadedFile ? (
                  <>
                    <span className="material-symbols-outlined text-[48px] text-primary-container mb-sm">task</span>
                    <span className="font-label-md text-label-md text-on-surface-variant text-center max-w-[200px] truncate">
                      {uploadedFile.name}
                    </span>
                    <span className="text-xs text-primary mt-1 hover:underline">Change file</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[48px] text-tertiary-container mb-sm">cloud_upload</span>
                    <span className="font-label-md text-label-md text-on-surface-variant text-center">
                      Drag and drop file here<br />or click to browse
                    </span>
                  </>
                )}
              </div>

              <button 
                className={`w-full py-3 rounded-lg font-headline-md text-[18px] font-bold transition-all uppercase flex justify-center items-center gap-xs ${
                  uploadedFile && !isEnrolling
                    ? 'bg-primary-container text-on-primary hover:bg-primary shadow-md active:scale-95 cursor-pointer'
                    : 'bg-primary-container text-on-primary opacity-50 cursor-not-allowed'
                }`}
                disabled={!uploadedFile || isEnrolling}
                onClick={handleCompleteEnrollment}
              >
                {isEnrolling ? (
                  <>
                    Processing... <span className="material-symbols-outlined text-xl animate-spin">autorenew</span>
                  </>
                ) : (
                  "Complete Enrollment"
                )}
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-secondary-container w-full mt-auto">
        <div className="py-lg px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="font-headline-md text-headline-md font-extrabold text-primary">Delta Robotics</div>
          <div className="font-body-md text-body-md text-on-secondary-container text-center">
            © 2024 RoboEdu International. Engineering the future of robotics education.
          </div>
          <div className="flex gap-md flex-wrap justify-center">
            <a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-all hover:underline" href="#privacy">Privacy</a>
            <a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-all hover:underline" href="#terms">Terms</a>
            <a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-all hover:underline" href="#help">Help</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
