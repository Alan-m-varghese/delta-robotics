import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Simulated authenticated user
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dr_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Simulated enrolled courses list
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = localStorage.getItem('dr_enrolled_courses');
    return saved ? JSON.parse(saved) : ['intro-to-ros', 'computer-vision']; // Default mock enrollments
  });

  // Simulated lesson completion progress (percentage)
  const [courseProgress, setCourseProgress] = useState(() => {
    const saved = localStorage.getItem('dr_course_progress');
    return saved ? JSON.parse(saved) : {
      'intro-to-ros': 65,
      'computer-vision': 30
    };
  });

  // Simulated dashboard activity stats
  const [stats, setStats] = useState({
    hours: 142,
    projects: 12,
    certificates: 3,
    streak: 5
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('dr_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dr_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('dr_enrolled_courses', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    localStorage.setItem('dr_course_progress', JSON.stringify(courseProgress));
  }, [courseProgress]);

  const login = (email, role) => {
    const name = email.split('@')[0];
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const loggedUser = {
      name: capitalized,
      email,
      role: role || 'student'
    };
    setUser(loggedUser);
    return true;
  };

  const signup = (firstName, lastName, email, institution) => {
    const loggedUser = {
      name: `${firstName} ${lastName}`,
      email,
      role: 'student',
      institution
    };
    setUser(loggedUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dr_user');
  };

  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      setCourseProgress({
        ...courseProgress,
        [courseId]: 0 // Start progress at 0%
      });
    }
  };

  const updateProgress = (courseId, percentage) => {
    setCourseProgress({
      ...courseProgress,
      [courseId]: percentage
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      enrolledCourses,
      courseProgress,
      stats,
      login,
      signup,
      logout,
      enrollInCourse,
      updateProgress
    }}>
      {children}
    </AuthContext.Provider>
  );
};
