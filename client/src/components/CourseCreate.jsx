import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Course created successfully, redirect to courses list
        navigate('/');
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors(['Failed to create course. Please try again.']);
        }
      }
    } catch (err) {
      console.error('Error creating course:', err);
      setErrors(['Failed to create course. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main>
        <div className="wrap">
          <h2>Create Course</h2>
          
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
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Creating Course...' : 'Create Course'}
            </button>
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