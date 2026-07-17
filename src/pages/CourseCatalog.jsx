import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COURSES_DB } from '../data/courses';

export default function CourseCatalog() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL query for category navigation from other pages (if applicable)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      if (cat.toLowerCase() === 'autonomous') setActiveCategory('Autonomous Systems');
      if (cat.toLowerCase() === 'ai') setActiveCategory('AI & ML');
      if (cat.toLowerCase() === 'iot') setActiveCategory('IoT');
    }
  }, [location]);

  // Handle dynamic list filtering
  const filteredCourses = Object.values(COURSES_DB).filter(course => {
    let categoryMatch = false;
    if (activeCategory === 'All Courses') {
      categoryMatch = true;
    } else {
      categoryMatch = course.category === activeCategory;
    }

    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && matchesSearch;
  });

  return (
    <div className="pt-24 bg-background text-on-surface min-h-screen">
      <main className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-lg">
        
        {/* Hero Section */}
        <section className="mb-xl text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
          <div className="order-2 md:order-1">
            <h1 className="font-headline-lg-mobile md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-md">
              Master the Future of <span className="text-primary-container">Robotics</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-2xl">
              Elevate your engineering skills with industry-leading courses in Autonomous Systems, AI, and Embedded Technologies. Start your journey today.
            </p>
            
            {/* Search & Filter Bar */}
            <div className="bg-surface-container-lowest p-sm md:p-md rounded-xl border border-secondary-container shadow-sm flex flex-col md:flex-row gap-sm items-center">
              <div className="flex-grow w-full input-focus flex items-center border border-secondary-container rounded-lg px-3 py-2 bg-background">
                <span className="material-symbols-outlined text-secondary mr-2">search</span>
                <input 
                  className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-body-md font-body-md text-on-surface" 
                  placeholder="Find your next course..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto flex gap-sm overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {['All Courses', 'Autonomous Systems', 'AI & ML', 'IoT'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 font-label-md text-label-md rounded-full border transition-colors ${
                      activeCategory === cat
                        ? 'bg-primary/10 text-primary border-primary/20 font-bold'
                        : 'bg-surface text-secondary border-secondary-container hover:bg-surface-container'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 h-64 md:h-[400px] w-full rounded-xl overflow-hidden relative border border-secondary-container">
            <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: "url('/assets/asset_bf7bb71443.png')" }}></div>
          </div>
        </section>

        {/* Course Grid */}
        <section>
          <div className="flex justify-between items-end mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Available Courses</h2>
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredCourses.map((course) => (
                <article 
                  key={course.id} 
                  className="bg-surface-container-lowest border border-[#E5E7EB] rounded-xl overflow-hidden card-hover transition-all duration-300 flex flex-col h-full"
                >
                  <Link to={`/course-details?course=${course.id}`} className="h-48 relative block">
                    <img className="w-full h-full object-cover" src={`/${course.image}`} alt={course.title} />
                    <div className="absolute top-sm right-sm bg-primary/10 text-primary font-label-md text-label-md px-3 py-1 rounded-full border border-primary/20 backdrop-blur-sm bg-white/90">
                      {course.level}
                    </div>
                  </Link>
                  <div className="p-md flex flex-col flex-grow">
                    <div className="flex items-center gap-sm mb-sm text-secondary font-label-md text-label-md">
                      <span className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px]">schedule</span> 
                        {course.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px]">school</span> 
                        {course.category}
                      </span>
                    </div>
                    <Link to={`/course-details?course=${course.id}`} className="hover:text-primary transition-colors">
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-sm line-clamp-1">{course.title}</h3>
                    </Link>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-md flex-grow line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-md border-t border-secondary-container">
                      <span className="font-headline-md text-[20px] leading-[28px] font-bold text-on-surface">{course.price}</span>
                      <Link 
                        to={`/course-details?course=${course.id}`} 
                        className="bg-primary-container text-on-primary font-label-md text-label-md font-bold px-4 py-2 rounded-lg hover:bg-[#e66000] transition-colors uppercase text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-container rounded-xl border border-secondary-container">
              <span className="material-symbols-outlined text-4xl text-secondary mb-2">search_off</span>
              <p className="font-body-lg text-on-surface-variant">No courses match your query or category filters.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
