import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext.jsx";

const CourseDetail = () => {
  const { user } = useContext(UserContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Check if user is authenticated, redirect to signin if not
  useEffect(() => {
    if (!user || !user.credentials) {
      navigate('/signin');
      return;
    }
    
    if (id) {
      fetchCourse();
    }
  }, [user, navigate, id]);

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
          throw new Error('Course not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCourse(data.course);
      setError(null);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.message || 'Failed to load course. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
          const errorData = await response.json();
          alert(errorData.message || 'Failed to delete course');
        }
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Failed to delete course');
      }
    }
  };

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

  if (!course) {
    return (
      <main>
        <div className="wrap">
          <h2>Course Detail</h2>
          <div>Course not found</div>
          <button onClick={() => navigate('/')}>Return to List</button>
        </div>
      </main>
    );
  }

  return (
    <div>
      <div className="actions--bar">
        <div className="wrap">
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

      <main>
        <div className="wrap">
          <h2>Course Detail</h2>
          <form>
            <div className="main--flex">
              <div>
                <h3 className="course--detail--title">COURSE</h3>
                <h4 className="course--name">{course.title}</h4>
                <p>By {course.User.firstName} {course.User.lastName}</p>

                <p>{course.description}</p>
              </div>
              <div>
                <h3 className="course--detail--title">ESTIMATED TIME</h3>
                <p>{course.estimatedTime}</p>

                <h3 className="course--detail--title">MATERIALS NEEDED</h3>
                {course.materialsNeeded ? (
                  <ul className="course--detail--list">
                    {course.materialsNeeded.split('\n').map((material, index) => (
                      <li key={index}>{material.trim()}</li>
                    ))}
                  </ul>
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
