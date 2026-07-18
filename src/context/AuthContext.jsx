import React, { createContext, useState, useEffect } from 'react';
import { COURSES_DB } from '../data/courses';

export const AuthContext = createContext();

export const API_BASE = '/api';

// Helper function to map backend course records to frontend structures
export const mapBackendCourse = (backendCourse) => {
  const localKeys = Object.keys(COURSES_DB);
  
  // Find a key in the static database that matches the backend course title
  const matchedKey = localKeys.find(key => {
    const localCourse = COURSES_DB[key];
    return localCourse.title.toLowerCase().includes(backendCourse.title.toLowerCase()) ||
           backendCourse.title.toLowerCase().includes(localCourse.title.toLowerCase());
  }) || localKeys.find(key => {
    const localCourse = COURSES_DB[key];
    return localCourse.description.toLowerCase().slice(0, 20) === backendCourse.description.toLowerCase().slice(0, 20);
  });

  const localData = matchedKey ? COURSES_DB[matchedKey] : {};

  return {
    ...localData,
    id: backendCourse.id, // Primary key is the backend UUID
    localSlug: matchedKey, // Reference slug for lookup
    title: backendCourse.title,
    description: backendCourse.description,
    price: backendCourse.price ? `$${parseFloat(backendCourse.price).toLocaleString()}` : localData.price,
    priceNumber: backendCourse.price ? parseFloat(backendCourse.price) : localData.priceNumber,
    level: backendCourse.level || localData.level || 'Beginner',
    image: localData.image || 'assets/asset_41da951b75.png',
    badge: localData.badge || 'NEW',
    category: localData.category || 'Software',
    rating: localData.rating || '4.8 (20 reviews)',
    students: localData.students || '100+',
    duration: localData.duration || '8 Weeks',
    overview1: localData.overview1 || backendCourse.description,
    overview2: localData.overview2 || '',
    learn: localData.learn || ['Hands-on robotics labs', 'Expert mentoring'],
    included: localData.included || ['Certificate of completion', 'Lifetime access'],
    is_published: backendCourse.is_published,
    backend_raw: backendCourse
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollmentStatuses, setEnrollmentStatuses] = useState({});
  const [courses, setCourses] = useState(() => {
    const cached = localStorage.getItem('dr_cached_courses');
    return cached ? JSON.parse(cached) : [];
  });
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // Simulated lesson completion progress (percentage)
  const [courseProgress, setCourseProgress] = useState(() => {
    const saved = localStorage.getItem('dr_course_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Simulated dashboard activity stats
  const [stats, setStats] = useState({
    hours: 0,
    projects: 0,
    certificates: 0,
    streak: 0
  });

  useEffect(() => {
    localStorage.setItem('dr_course_progress', JSON.stringify(courseProgress));
  }, [courseProgress]);

  // Fetch courses list from the backend
  const fetchCourses = async (token) => {
    setCoursesLoading(true);
    try {
      const headers = {};
      const authToken = token || localStorage.getItem('dr_access_token');
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      const response = await fetch(`${API_BASE}/courses/`, {
        method: 'GET',
        headers
      });
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map(mapBackendCourse);
        setCourses(mapped);
        localStorage.setItem('dr_cached_courses', JSON.stringify(mapped));
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Fetch courses error:', err);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Fetch student course enrollments
  const fetchEnrollments = async (token) => {
    try {
      const authToken = token || localStorage.getItem('dr_access_token');
      if (!authToken) return;

      const response = await fetch(`${API_BASE}/my-enrollments/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const enrolledIds = data.map(e => e.course);
        setEnrolledCourses(enrolledIds);

        const statuses = {};
        data.forEach(e => {
          statuses[e.course] = e.status;
        });
        setEnrollmentStatuses(statuses);
      }
    } catch (err) {
      console.error('Fetch enrollments error:', err);
    }
  };

  // Auto restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('dr_access_token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE}/accounts/verify-token/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success) {
            const loggedUser = {
              id: data.user.id,
              name: data.user.username || data.user.email.split('@')[0],
              email: data.user.email,
              role: data.user.role || 'student'
            };
            setUser(loggedUser);
            await fetchEnrollments(token);
            await fetchCourses(token);
          } else {
            await handleTokenRefresh();
          }
        } catch (error) {
          console.error('Session restore error:', error);
          await handleTokenRefresh();
        }
      } else {
        await fetchCourses(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem('dr_refresh_token');
    if (refreshToken) {
      try {
        const response = await fetch(`${API_BASE}/accounts/refresh-token/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refresh_token: refreshToken })
        });
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('dr_access_token', data.access_token);
          if (data.refresh_token) {
            localStorage.setItem('dr_refresh_token', data.refresh_token);
          }
          const verifyResponse = await fetch(`${API_BASE}/accounts/verify-token/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${data.access_token}`
            }
          });
          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            const loggedUser = {
              id: verifyData.user.id,
              name: verifyData.user.username || verifyData.user.email.split('@')[0],
              email: verifyData.user.email,
              role: verifyData.user.role || 'student'
            };
            setUser(loggedUser);
            await fetchEnrollments(data.access_token);
            await fetchCourses(data.access_token);
            return;
          }
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
      }
    }
    logoutCleanup();
  };

  const logoutCleanup = () => {
    setUser(null);
    setEnrolledCourses([]);
    localStorage.removeItem('dr_access_token');
    localStorage.removeItem('dr_refresh_token');
    fetchCourses(null);
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok || !data.success) {
        let errMsg = data.message || data.error || data.detail;
        if (!errMsg && typeof data === 'object') {
          const errors = [];
          for (const key in data) {
            if (key === 'success') continue;
            if (Array.isArray(data[key])) {
              errors.push(`${key}: ${data[key].join(', ')}`);
            } else if (typeof data[key] === 'string') {
              errors.push(`${key}: ${data[key]}`);
            } else {
              errors.push(`${key}: ${JSON.stringify(data[key])}`);
            }
          }
          if (errors.length > 0) {
            errMsg = errors.join(' | ');
          }
        }
        throw new Error(errMsg || `Login failed (Status: ${response.status})`);
      }

      localStorage.setItem('dr_access_token', data.access_token);
      localStorage.setItem('dr_refresh_token', data.refresh_token);

      const loggedUser = {
        id: data.user.id,
        name: data.user.username || data.user.email.split('@')[0],
        email: data.user.email,
        role: data.user.role || 'student'
      };
      setUser(loggedUser);

      await fetchEnrollments(data.access_token);
      await fetchCourses(data.access_token);

      return { success: true };
    } catch (error) {
      console.error('Login API error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/accounts/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok || !data.success) {
        let errMsg = data.message || data.error || data.detail;
        if (!errMsg && typeof data === 'object') {
          const errors = [];
          for (const key in data) {
            if (key === 'success') continue;
            if (Array.isArray(data[key])) {
              errors.push(`${key}: ${data[key].join(', ')}`);
            } else if (typeof data[key] === 'string') {
              errors.push(`${key}: ${data[key]}`);
            } else {
              errors.push(`${key}: ${JSON.stringify(data[key])}`);
            }
          }
          if (errors.length > 0) {
            errMsg = errors.join(' | ');
          }
        }
        throw new Error(errMsg || `Registration failed (Status: ${response.status})`);
      }

      localStorage.setItem('dr_access_token', data.access_token);
      localStorage.setItem('dr_refresh_token', data.refresh_token);

      const loggedUser = {
        id: data.user.id,
        name: data.user.username || data.user.email.split('@')[0],
        email: data.user.email,
        role: data.user.role || 'student'
      };
      setUser(loggedUser);

      await fetchEnrollments(data.access_token);
      await fetchCourses(data.access_token);

      return { success: true };
    } catch (error) {
      console.error('Registration API error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('dr_access_token');
    if (token) {
      try {
        await fetch(`${API_BASE}/accounts/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error('Logout API call failed:', err);
      }
    }
    logoutCleanup();
  };

  const enrollInCourse = async (courseIdOrSlug) => {
    try {
      const token = localStorage.getItem('dr_access_token');
      if (!token) throw new Error('You must be logged in to enroll');

      let uuid = courseIdOrSlug;
      const matched = courses.find(c => c.localSlug === courseIdOrSlug);
      if (matched) {
        uuid = matched.id;
      }

      const response = await fetch(`${API_BASE}/courses/${uuid}/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Enrollment failed');
      }

      if (!enrolledCourses.includes(uuid)) {
        setEnrolledCourses([...enrolledCourses, uuid]);
        setCourseProgress(prev => ({
          ...prev,
          [uuid]: 0
        }));
      }
      return { success: true };
    } catch (err) {
      console.error('Enroll API error:', err);
      return { success: false, error: err.message };
    }
  };

  const updateProgress = (courseId, percentage) => {
    setCourseProgress(prev => ({
      ...prev,
      [courseId]: percentage
    }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      enrolledCourses,
      enrollmentStatuses,
      courseProgress,
      stats,
      courses,
      coursesLoading,
      loading,
      login,
      signup,
      logout,
      enrollInCourse,
      updateProgress,
      fetchCourses,
      fetchEnrollments
    }}>
      {children}
    </AuthContext.Provider>
  );
};
