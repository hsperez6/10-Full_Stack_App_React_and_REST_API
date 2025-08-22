import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import UserContext from '../context/UserContext.jsx';

/**
 * CourseDetail Component
 *
 * Displays detailed information about a specific course including title, description,
 * estimated time, materials needed, and instructor information. This component
 * handles course fetching and provides update/delete functionality for course owners.
 * Authentication is handled by PrivateRoute wrapper.
 */
const CourseDetail = () => {
  // Get authenticated user data from UserContext
  const { user } = useContext(UserContext);

  // STATE MANAGEMENT
  const [course, setCourse] = useState(null);        // Current course data
  const [loading, setLoading] = useState(true);      // Loading state indicator
  const [error, setError] = useState(null);          // Error state for error handling

  // ROUTING AND NAVIGATION
  const { id } = useParams();                        // Course ID from URL parameters
  const navigate = useNavigate();                    // Navigation function

  /**
   * useEffect hook to fetch course data when component mounts or course ID changes
   * Since authentication is handled by PrivateRoute, we can directly fetch course data
   */
  useEffect(() => {
    // Fetch course data if course ID is available
    if (id) {
      fetchCourse();
    }
  }, [id, fetchCourse]);

  /**
   * useEffect hook to handle redirects when course data is not available
   * Redirects to /notfound if course fetch completed but no course was returned
   */
  useEffect(() => {
    // If loading is false and no course was returned, redirect to notfound
    if (!loading && !course && !error) {
      navigate('/notfound');
    }
  }, [loading, course, error, navigate]);

  /**
   * Fetches course data from the API
   * Handles authentication headers and error responses
   */
  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/courses/${id}`, {
        headers: {
          'Authorization': `Basic ${user.credentials}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Course not found, set course to null to trigger redirect
          setCourse(null);
          setLoading(false);
          return;
        }
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

      // Check if the API actually returned course data
      if (!data.course) {
        setCourse(null);
        setLoading(false);
        return;
      }

      setCourse(data.course);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load course. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id, user.credentials, navigate]);

  /**
   * Handles course deletion with user confirmation
   * Sends DELETE request to API and redirects to courses list on success
   */
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`/api/courses/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${user.credentials}`
          },
        });

        if (response.ok) {
          navigate('/');
        } else {
          if (response.status === 403) {
            navigate('/forbidden');
            return;
          }
          if (response.status === 500) {
            navigate('/error');
            return;
          }
          const errorData = await response.json();
          setError(errorData.message || 'Failed to delete course');
        }
      } catch (_err) {
        setError('Failed to delete course');
      }
    }
  };

  // LOADING STATE - Show loading message while fetching course data
  if (loading) {
    return (
      <main>
        <div className="wrap">
          <h2>Course Detail</h2>
          <div>Loading course...</div>
        </div>
      </main>
    );
  }

  // ERROR STATE - Display error message with retry option
  if (error) {
    return (
      <main>
        <div className="wrap">
          <h2>Course Detail</h2>
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/')}>Return to List</button>
        </div>
      </main>
    );
  }

  // If no course data is available, show loading or wait for redirect
  if (!course) {
    return (
      <main>
        <div className="wrap">
          <h2>Course Detail</h2>
          <div>Loading course...</div>
        </div>
      </main>
    );
  }

  // MAIN RENDER - Display course details and action buttons
  return (
    <div>
      {/* Action bar with update/delete buttons for course owners */}
      <div className="actions--bar">
        <div className="wrap">
          {/* Only show update/delete buttons if user owns the course */}
          {user && course && user.id === course.userId && (
            <>
              <Link className="button" to={`/courses/${id}/update`}>
                Update Course
              </Link>
              <button className="button" onClick={handleDelete}>
                Delete Course
              </button>
            </>
          )}
          <Link className="button button-secondary" to="/">
            Return to List
          </Link>
        </div>
      </div>

      {/* Main content area displaying course information */}
      <main>
        <div className="wrap">
          <h2>Course Detail</h2>
          <form>
            <div className="main--flex">
              {/* Left column - Course title, description, and instructor */}
              <div>
                <h3 className="course--detail--title">COURSE</h3>
                <h4 className="course--name">{course.title}</h4>
                <p>By {course.User.firstName} {course.User.lastName}</p>

                <div className="course--description">
                  <ReactMarkdown>{course.description}</ReactMarkdown>
                </div>
              </div>

              {/* Right column - Estimated time and materials needed */}
              <div>
                <h3 className="course--detail--title">ESTIMATED TIME</h3>
                <p>{course.estimatedTime}</p>

                <h3 className="course--detail--title">MATERIALS NEEDED</h3>
                {/* Display materials as markdown if available, otherwise show "No materials listed" */}
                {course.materialsNeeded ? (
                  <div className="course--materials">
                    <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
                  </div>
                ) : (
                  <p>No materials listed</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
