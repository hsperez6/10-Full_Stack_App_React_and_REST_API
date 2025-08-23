import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import UserContext from '../context/UserContext.jsx';
import ValidationErrors from './ValidationErrors.jsx';

/**
 * CourseCreate Component
 *
 * This component renders a form for authenticated users to create new courses.
 * It includes form validation, error handling, and form submission to the API.
 * The form collects course title, description, estimated time, and materials needed.
 * Authentication is handled by PrivateRoute wrapper.
 */
const CourseCreate = () => {
  // Get authenticated user data from UserContext
  const { user } = useContext(UserContext);

  // STATE
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /**
   * Handle input field changes
   * Updates the corresponding field in formData state
   * @param {Event} e - The change event from the input field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   * Sends POST request to create new course via API
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Send POST request to create new course
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include user credentials for authentication
          Authorization: `Basic ${user.credentials}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Course created successfully, redirect to courses list
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
        // Handle API error responses
        const errorData = await response.json();
        if (errorData.errors) {
          // Set validation errors from API response
          setErrors(errorData.errors);
        } else {
          // Set generic error message if no specific errors provided
          setErrors(['Failed to create course. Please try again.']);
        }
      }
    } catch {
      // Handle network or other errors
      setErrors(['Failed to create course. Please try again.']);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <div>
      <main>
        <div className="wrap">
          <h2>Create Course</h2>
          <ValidationErrors errors={errors} />

          <form onSubmit={handleSubmit}>
            <div className="main--flex">
              <div>
                <label htmlFor="title">Course Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                />

                <p>By {user.firstName} {user.lastName}</p>

                <label htmlFor="description">Course Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
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
            {/* Submit button - disabled during form submission */}
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Creating Course...' : 'Create Course'}
            </button>

            {/* Cancel button - navigates back to courses list */}
            <button
              className="button button-secondary"
              type="button"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CourseCreate;
