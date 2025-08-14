import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseUpdate = () => {
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Course not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCourse(data.course);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Course updated successfully, redirect to course detail
        navigate(`/courses/${id}`);
      } else {
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

  if (!course) {
    return (
      <main>
        <div className="wrap">
          <h2>Update Course</h2>
          <div>Course not found</div>
          <button onClick={() => navigate('/')}>Return to List</button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="wrap">
        <h2>Update Course</h2>
        
        {errors.length > 0 && (
          <div className="validation--errors">
            <h3>Validation Errors</h3>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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
                required
              />

              <p>By {course.User.firstName} {course.User.lastName}</p>

              <label htmlFor="description">Course Description</label>
              <textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
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