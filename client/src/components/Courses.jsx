import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Courses Component
 *
 * Main component that displays a list of all available courses in a grid layout.
 * This component fetches courses from the API and provides navigation to individual
 * course details and course creation. Authentication is handled by PrivateRoute wrapper.
 */
const Courses = () => {
  // Authentication is handled by PrivateRoute wrapper

  // ROUTING AND NAVIGATION
  const navigate = useNavigate();

  // STATE MANAGEMENT
  const [courses, setCourses] = useState([]);        // Array of course objects
  const [loading, setLoading] = useState(true);      // Loading state indicator
  const [error, setError] = useState(null);          // Error state for error handling

  /**
   * Fetches all courses from the API
   * Updates the courses state and handles any errors that occur
   */
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');

      if (!response.ok) {
        if (response.status === 403) {
          navigate('/forbidden');
          return;
        }
        if (response.status === 500) {
          navigate('/error');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data.courses);
      setError(null);
    } catch {
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * useEffect hook to fetch courses when component mounts
   * Since authentication is handled by PrivateRoute, we can directly fetch courses
   */
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // LOADING STATE - Show loading message while fetching courses
  if (loading) {
    return (
      <div id="root">
        <main>
          <div className="wrap main--grid">
            <div>Loading courses...</div>
          </div>
        </main>
      </div>
    );
  }

  // ERROR STATE - Display error message with retry button
  if (error) {
    return (
      <div id="root">
        <main>
          <div className="wrap main--grid">
            <div className="error-message">{error}</div>
            <button onClick={fetchCourses}>Try Again</button>
          </div>
        </main>
      </div>
    );
  }

  // MAIN RENDER - Display courses grid and add course button
  return (
    <div id="root">
      <main>
        <div className="wrap main--grid">
          {/* Render each course as a clickable link card */}
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="course--module course--link"
            >
              <h2 className="course--label">Course</h2>
              <h3 className="course--title">{course.title}</h3>
            </Link>
          ))}

          {/* Add new course button - links to course creation form */}
          <Link
            to="/courses/create"
            className="course--module course--add--module"
          >
            <span className="course--add--title">
              {/* Plus icon SVG for visual appeal */}
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 13 13"
                className="add"
              >
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
              New Course
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Courses;
