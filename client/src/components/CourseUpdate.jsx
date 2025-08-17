import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext.jsx";
import ValidationErrors from "./ValidationErrors.jsx";

/**
 * CourseUpdate Component
 * 
 * Form component that allows authenticated users to update existing courses.
 * This component fetches the current course data, validates user ownership,
 * and provides form submission with error handling. Only course owners can
 * update their courses. Authentication is handled by PrivateRoute wrapper.
 */
const CourseUpdate = () => {
  // Get authenticated user data from UserContext
  const { user } = useContext(UserContext);
  
  // STATE MANAGEMENT
  const [course, setCourse] = useState(null);                    // Current course data
  const [formData, setFormData] = useState({                     // Form input values
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: ''
  });
  const [errors, setErrors] = useState([]);                      // Validation errors
  const [loading, setLoading] = useState(true);                  // Loading state for initial fetch
  const [submitting, setSubmitting] = useState(false);           // Loading state for form submission
  
  // ROUTING AND NAVIGATION
  const { id } = useParams();                                    // Course ID from URL parameters
  const navigate = useNavigate();                                // Navigation function

  /**
   * useEffect hook to fetch course data when component mounts or course ID changes
   * Since authentication is handled by PrivateRoute, we can directly fetch course data
   */
  useEffect(() => {
    // Fetch course data if course ID is available
    if (id) {
      fetchCourse();
    }
  }, [id]);

  /**
   * Fetches course data from the API and populates the form
   * Validates that the current user owns the course before allowing updates
   */
  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${id}`, {
        headers: {
          'Authorization': `Basic ${user.credentials}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          navigate('/notfound');
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
      setCourse(data.course);
      
      // Check if the current user owns this course
      if (data.course.userId !== user.id) {
        navigate('/forbidden');
        return;
      }
      
      // Populate form with current course data
      setFormData({
        title: data.course.title || '',
        description: data.course.description || '',
        estimatedTime: data.course.estimatedTime || '',
        materialsNeeded: data.course.materialsNeeded || ''
      });
      setErrors([]);
    } catch (err) {
      console.error('Error fetching course:', err);
      setErrors([err.message || 'Failed to load course. Please try again later.']);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles input field changes
   * Updates the corresponding field in formData state
   * @param {Event} e - The change event from the input field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles form submission
   * Sends PUT request to update the course via API
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${user.credentials}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Course updated successfully, redirect to course detail
        navigate(`/courses/${id}`);
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
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else if (errorData.message) {
          setErrors([errorData.message]);
        } else {
          setErrors(['Failed to update course. Please try again.']);
        }
      }
    } catch (err) {
      console.error('Error updating course:', err);
      setErrors(['Failed to update course. Please try again.']);
    } finally {
      setSubmitting(false);
    }
  };

  // LOADING STATE - Show loading message while fetching course data
  if (loading) {
    return (
      <main>
        <div className="wrap">
          <h2>Update Course</h2>
          <div>Loading course...</div>
        </div>
      </main>
    );
  }

  // ERROR STATE - Display loading errors only
  if (errors.length > 0 && !course) {
    return (
      <main>
        <div className="wrap">
          <h2>Update Course</h2>
          <div className="error-message">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
          <button onClick={() => navigate('/')}>Return to List</button>
        </div>
      </main>
    );
  }

  // NOT FOUND STATE - Redirect to notfound page if course doesn't exist
  if (!course) {
    navigate('/notfound');
    return null;
  }

  // MAIN RENDER - Display update form
  return (
    <main>
      <div className="wrap">
        <h2>Update Course</h2>
        
        {/* Display validation errors if any exist */}
        {errors.length > 0 && (
          <ValidationErrors errors={errors} />
        )}

        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            {/* Left column - Course title, description, and instructor */}
            <div>
              <label htmlFor="title">Course Title</label>
              <input 
                id="title" 
                name="title" 
                type="text" 
                value={formData.title}
                onChange={handleChange}
              />

              <p>By {course.User.firstName} {course.User.lastName}</p>

              <label htmlFor="description">Course Description</label>
              <textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            
            {/* Right column - Estimated time and materials needed */}
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input 
                id="estimatedTime" 
                name="estimatedTime" 
                type="text" 
                value={formData.estimatedTime}
                onChange={handleChange}
                placeholder="e.g., 14 hours"
              />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea 
                id="materialsNeeded" 
                name="materialsNeeded"
                value={formData.materialsNeeded}
                onChange={handleChange}
                placeholder="Enter each material on a new line"
              ></textarea>
            </div>
          </div>
          
          {/* Form action buttons */}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Updating Course...' : 'Update Course'}
          </button>
          <button 
            className="button button-secondary" 
            type="button" 
            onClick={() => navigate(`/courses/${id}`)}
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
};

export default CourseUpdate;