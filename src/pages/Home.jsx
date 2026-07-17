import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UIContext } from '../context/UIContext';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { showModal, showToast } = useContext(UIContext);
  const { enrollInCourse } = useContext(AuthContext);
  const location = useLocation();

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Handle smooth scroll on direct hash access
  useEffect(() => {
    if (location.hash) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        const timer = setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('⚠️ Please fill out all contact form fields.');
      return;
    }
    showToast('🚀 Message sent! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  const triggerEnrollModal = (courseTitle, price, courseId) => {
    showModal(
      `Enroll in ${courseTitle}`,
      `You are registering for our ${courseTitle} certification program. Total tuition is ${price}. Would you like to confirm registration?`,
      'CONFIRM ENROLLMENT',
      () => {
        enrollInCourse(courseId);
        showToast(`🎉 Enrolled successfully in ${courseTitle}! Welcome aboard.`);
      }
    );
  };

  const triggerBootcampModal = () => {
    showModal(
      'Join Weekend Bootcamp',
      'Learn from expert mentors in our state-of-the-art labs. Weekend build sessions run Saturday & Sunday 9am - 5pm. Confirm to receive schedule details.',
      'GET SCHEDULE',
      () => {
        showToast('📩 Schedule details sent to your registered email.');
      }
    );
  };

  const scrollToCourses = () => {
    const coursesElem = document.getElementById('courses');
    if (coursesElem) {
      const headerOffset = 80;
      const elementPosition = coursesElem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pt-20">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl md:py-[120px] grid md:grid-cols-2 gap-lg items-center relative overflow-visible">
        <div className="flex flex-col gap-md relative z-20">
          <div className="bg-surface-variant/50 w-fit px-2 py-1 rounded text-xs font-label-md font-bold text-on-surface-variant flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-primary-container rounded-sm"></span>SYSTEM ONLINE: V4.0.2
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-xl md:text-[56px] md:leading-[64px] text-on-surface">
            Building the <span className="text-primary-container font-extrabold">Next<br />Generation</span> of Robotics<br />Engineers.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            Bridging the gap between theory and hardware. Master autonomous systems, neural computation, and industrial IoT through our elite certification programs.
          </p>
          <div className="flex flex-wrap gap-sm pt-sm">
            <button 
              onClick={scrollToCourses}
              className="bg-primary-container text-white px-lg py-md rounded font-label-md text-label-md font-bold uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2"
            >
              EXPLORE COURSES <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button 
              onClick={triggerBootcampModal}
              className="border border-primary-container text-primary-container px-lg py-md rounded font-label-md text-label-md font-bold uppercase tracking-widest hover:bg-primary-container/10 transition-all flex items-center gap-2"
            >
              JOIN WORKSHOP <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
            </button>
          </div>
        </div>

        {/* Hero Shapes Graphic */}
        <div className="relative w-full aspect-square md:aspect-square min-h-[400px] md:min-h-[600px] flex flex-col items-center justify-center overflow-visible z-10">
          {/* Geometric Background Shapes */}
          <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center z-0">
            <div className="absolute w-full h-full max-w-[500px] max-h-[500px] flex items-center justify-center">
              {/* Triangle 1 */}
              <div className="absolute w-[80%] h-[80%] animate-float-up">
                <svg className="w-full h-full text-surface-variant opacity-60 transform rotate-[15deg] -translate-y-4" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon fill="currentColor" points="50,0 0,100 100,100"></polygon>
                </svg>
              </div>
              {/* Triangle 2 */}
              <div className="absolute w-[70%] h-[70%] animate-float-down">
                <svg className="w-full h-full text-surface-dim opacity-70 transform -rotate-[10deg] translate-x-8 translate-y-8" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon fill="currentColor" points="50,0 0,100 100,100"></polygon>
                </svg>
              </div>
              {/* Triangle 3 */}
              <div className="absolute w-[90%] h-[90%] animate-drift">
                <svg className="w-full h-full text-outline opacity-40 transform rotate-[30deg] translate-y-4" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon fill="none" points="50,0 0,100 100,100" stroke="currentColor" strokeWidth="1"></polygon>
                </svg>
              </div>
              {/* Small floating triangle */}
              <div className="absolute top-[10%] left-[10%] w-10 h-10 animate-float-up" style={{ animationDelay: '-2s' }}>
                <svg className="w-full h-full text-tertiary opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon fill="currentColor" points="50,0 0,100 100,100"></polygon>
                </svg>
              </div>
              {/* Corner Brackets */}
              <div className="absolute top-[20%] right-[15%] w-8 h-8 border-t-2 border-r-2 border-outline-variant opacity-70 animate-drift" style={{ animationDelay: '-3s' }}></div>
              <div className="absolute bottom-[20%] left-[15%] w-8 h-8 border-b-2 border-l-2 border-outline-variant opacity-70 animate-drift" style={{ animationDelay: '-5s' }}></div>
              {/* Decorative Lines */}
              <div className="absolute top-[45%] left-0 w-16 h-[2px] bg-outline-variant opacity-60 animate-float-down" style={{ animationDelay: '-1s' }}></div>
              <div className="absolute bottom-[10%] right-[10%] w-20 h-[2px] bg-outline-variant opacity-60 animate-float-up" style={{ animationDelay: '-4s' }}></div>
              {/* Brand Colored Small Triangle */}
              <div className="absolute top-[15%] right-[25%] w-6 h-6 animate-logo-float" style={{ animationDelay: '-1.5s' }}>
                <svg className="w-full h-full text-primary-container opacity-80" viewBox="0 0 100 100">
                  <polygon fill="currentColor" points="50,0 0,100 100,100"></polygon>
                </svg>
              </div>
              {/* Brand Dots */}
              <div className="absolute bottom-[30%] right-[20%] w-2 h-2 bg-outline-variant rounded-full opacity-60 animate-logo-float" style={{ animationDelay: '-2.5s' }}></div>
              <div className="absolute top-[40%] left-[20%] w-3 h-3 bg-primary-container rounded-full opacity-70 animate-logo-float" style={{ animationDelay: '-0.5s' }}></div>
              <div className="absolute top-[60%] right-[15%] w-[1px] h-16 bg-outline-variant opacity-40 animate-logo-float" style={{ animationDelay: '-3.5s' }}></div>
              <div className="absolute bottom-[15%] left-[25%] w-4 h-4 border border-primary-container opacity-60 rotate-[45deg] animate-logo-float" style={{ animationDelay: '-4.5s' }}></div>
            </div>
          </div>
          {/* Logo container */}
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center justify-center">
            <img alt="Delta Robotics Logo" className="w-64 h-64 md:w-80 md:h-80 object-contain animate-logo-float relative z-10" src="/assets/img_74c7a10f2f.png" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-surface-container-low py-xl" id="about">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
            <div className="flex flex-col gap-md">
              <h2 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-primary">About Delta Robotics</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                We believe that the best way to learn is by doing. Our mission is to provide accessible, high-quality robotics education that inspires creativity and technical excellence. Through practical workshops and rigorous coursework, we prepare students for the challenges of tomorrow's technological landscape.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm">
              <img alt="Professional robotics workshop for students" className="w-full h-full object-cover" src="/assets/img_90c43d6a15.png" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl" id="courses">
        <div className="flex flex-col gap-lg">
          <div className="flex justify-between items-end">
            <h2 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface">Featured Courses</h2>
            <Link to="/courses" className="hidden md:flex items-center gap-xs text-primary-container font-label-md text-label-md hover:text-primary transition-colors">
              View all <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            
            {/* Course Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <Link to="/course-details?course=autonomous-systems" className="h-48 bg-surface-container relative block">
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary-container z-10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("/assets/bg_b52662a685.png")' }}></div>
              </Link>
              <div className="p-md flex flex-col gap-sm flex-grow">
                <span className="text-primary-container font-label-md text-[10px] font-bold uppercase tracking-widest">HARDCORE</span>
                <Link to="/course-details?course=autonomous-systems" className="hover:text-primary transition-colors">
                  <h3 className="font-headline-sm text-headline-md font-bold text-on-surface">Autonomous Systems</h3>
                </Link>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                  LiDAR integration, SLAM algorithms, and edge computing for mobile robotics.
                </p>
                <div className="flex justify-between items-center mt-auto pt-sm">
                  <span className="text-on-surface-variant text-xs font-label-md">12 Weeks</span>
                  <span className="text-on-surface font-bold text-headline-sm">$1,299</span>
                </div>
                <button 
                  onClick={() => triggerEnrollModal("Autonomous Systems", "$1,299", "autonomous-systems")}
                  className="w-full bg-secondary text-white py-sm rounded font-label-md text-label-md font-bold uppercase tracking-widest hover:bg-on-surface transition-colors mt-sm"
                >
                  ENROLL NOW
                </button>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <Link to="/course-details?course=neural-networks" className="h-48 bg-surface-container relative block">
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary-container z-10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("/assets/bg_a9b0f618bf.png")' }}></div>
              </Link>
              <div className="p-md flex flex-col gap-sm flex-grow">
                <span className="text-primary-container font-label-md text-[10px] font-bold uppercase tracking-widest">EXPERT</span>
                <Link to="/course-details?course=neural-networks" className="hover:text-primary transition-colors">
                  <h3 className="font-headline-sm text-headline-md font-bold text-on-surface">Neural Networks</h3>
                </Link>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                  Deep learning for computer vision and reactive robot control architectures.
                </p>
                <div className="flex justify-between items-center mt-auto pt-sm">
                  <span className="text-on-surface-variant text-xs font-label-md">8 Weeks</span>
                  <span className="text-on-surface font-bold text-headline-sm">$950</span>
                </div>
                <button 
                  onClick={() => triggerEnrollModal("Neural Networks", "$950", "neural-networks")}
                  className="w-full bg-secondary text-white py-sm rounded font-label-md text-label-md font-bold uppercase tracking-widest hover:bg-on-surface transition-colors mt-sm"
                >
                  ENROLL NOW
                </button>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <Link to="/course-details?course=embedded-iot" className="h-48 bg-surface-container relative block">
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary-container z-10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("/assets/bg_a292f11599.png")' }}></div>
              </Link>
              <div className="p-md flex flex-col gap-sm flex-grow">
                <span className="text-primary-container font-label-md text-[10px] font-bold uppercase tracking-widest">INTERMEDIATE</span>
                <Link to="/course-details?course=embedded-iot" className="hover:text-primary transition-colors">
                  <h3 className="font-headline-sm text-headline-md font-bold text-on-surface">Embedded IoT</h3>
                </Link>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                  Custom PCB design, MQTT protocols, and low-latency sensor networks.
                </p>
                <div className="flex justify-between items-center mt-auto pt-sm">
                  <span className="text-on-surface-variant text-xs font-label-md">10 Weeks</span>
                  <span className="text-on-surface font-bold text-headline-sm">$800</span>
                </div>
                <button 
                  onClick={() => triggerEnrollModal("Embedded IoT", "$800", "embedded-iot")}
                  className="w-full bg-secondary text-white py-sm rounded font-label-md text-label-md font-bold uppercase tracking-widest hover:bg-on-surface transition-colors mt-sm"
                >
                  ENROLL NOW
                </button>
              </div>
            </div>

            {/* Course Card 4 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <Link to="/course-details?course=industrial-automation" className="h-48 bg-surface-container relative block">
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary-container z-10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("/assets/bg_c620b7f22a.png")' }}></div>
              </Link>
              <div className="p-md flex flex-col gap-sm flex-grow">
                <span className="text-primary-container font-label-md text-[10px] font-bold uppercase tracking-widest">INDUSTRY</span>
                <Link to="/course-details?course=industrial-automation" className="hover:text-primary transition-colors">
                  <h3 className="font-headline-sm text-headline-md font-bold text-on-surface">Industrial Automation</h3>
                </Link>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                  PLC programming, SCADA integration, and factory floor orchestration.
                </p>
                <div className="flex justify-between items-center mt-auto pt-sm">
                  <span className="text-on-surface-variant text-xs font-label-md">14 Weeks</span>
                  <span className="text-on-surface font-bold text-headline-sm">$1,500</span>
                </div>
                <button 
                  onClick={() => triggerEnrollModal("Industrial Automation", "$1,500", "industrial-automation")}
                  className="w-full bg-secondary text-white py-sm rounded font-label-md text-label-md font-bold uppercase tracking-widest hover:bg-on-surface transition-colors mt-sm"
                >
                  ENROLL NOW
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Workshops Section */}
      <section className="bg-surface-container-low border-y border-outline-variant py-xl" id="workshops">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
          <div className="order-2 md:order-1 relative h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden border border-outline-variant">
            <div className="w-full h-full bg-cover bg-center absolute inset-0" style={{ backgroundImage: 'url("/assets/bg_c620b7f22a.png")' }}></div>
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-md">
            <span className="text-primary-container font-label-md text-label-md font-bold tracking-widest uppercase">Hands-On Learning</span>
            <h2 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface">Weekend Bootcamps &amp; Build Sessions</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Take theory into reality. Our intensive weekend workshops provide guided, hands-on experience building functional robots from scratch. Work with industry-standard tools and collaborate with peers under the guidance of expert instructors.
            </p>
            <ul className="flex flex-col gap-sm mt-sm">
              <li className="flex items-center gap-sm text-on-surface">
                <span className="material-symbols-outlined text-primary-container">check_circle</span>
                <span>All materials and tools provided</span>
              </li>
              <li className="flex items-center gap-sm text-on-surface">
                <span className="material-symbols-outlined text-primary-container">check_circle</span>
                <span>Small group sizes for personalized attention</span>
              </li>
              <li className="flex items-center gap-sm text-on-surface">
                <span className="material-symbols-outlined text-primary-container">check_circle</span>
                <span>Take home your completed project</span>
              </li>
            </ul>
            <div className="mt-md">
              <button 
                onClick={triggerBootcampModal}
                className="bg-secondary text-white px-lg py-md rounded-lg font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-on-surface transition-colors"
              >
                Explore Schedule
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-lg" id="gallery">
        <div className="text-center">
          <h2 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface">Student Gallery</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm max-w-2xl mx-auto">A glimpse into the innovation happening in our labs.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md">
          <div className="col-span-2 row-span-2 rounded-xl overflow-hidden border border-outline-variant h-64 md:h-auto">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="/assets/img_754a9bce26.png" alt="Soldering printed circuit board" />
          </div>
          <div className="rounded-xl overflow-hidden border border-outline-variant h-32 md:h-48">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="/assets/img_dd9d066a57.png" alt="Autonomous drone prototype" />
          </div>
          <div className="rounded-xl overflow-hidden border border-outline-variant h-32 md:h-48">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="/assets/img_1fd9f47ecd.png" alt="Students reviewing CAD models" />
          </div>
          <div className="rounded-xl overflow-hidden border border-outline-variant h-32 md:h-48">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="/assets/img_5d24930ce7.png" alt="Robotic rover navigate simulation terrain" />
          </div>
          <div className="rounded-xl overflow-hidden border border-outline-variant h-32 md:h-48">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="/assets/img_2e8ecbcf3c.png" alt="Robotics competition arena" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-surface-container-low border-t border-outline-variant py-xl" id="contact">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-xl">
          <div className="flex flex-col gap-md">
            <h2 class="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface">Get in Touch</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Have questions about our programs or want to partner with us? Send us a message.</p>
            <div className="flex flex-col gap-sm mt-md">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <span className="font-body-md text-body-md text-on-surface font-semibold">hello@deltarobotics.edu</span>
              </div>
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <span className="font-body-md text-body-md text-on-surface font-semibold">Innovation District, Tech City</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs">Name</label>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors font-body-md text-body-md text-on-surface" 
                  placeholder="Your name" 
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs">Email</label>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors font-body-md text-body-md text-on-surface" 
                  placeholder="you@example.com" 
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs">Message</label>
                <textarea 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors font-body-md text-body-md resize-none text-on-surface" 
                  placeholder="How can we help?" 
                  rows="4"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="bg-primary-container text-white px-lg py-md rounded-lg font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-primary transition-colors mt-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
