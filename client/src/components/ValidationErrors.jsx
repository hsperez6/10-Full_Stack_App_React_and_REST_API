import React from 'react';

/**
 * ValidationErrors Component
 *
 * Utility component that displays validation error messages in a consistent format.
 * This component conditionally renders error messages only when errors exist,
 * returning null when there are no errors to display. It's used throughout
 * the application to show form validation errors and API error responses.
 *
 * @param {Object} props - Component props
 * @param {Array} props.errors - Array of error messages to display
 * @returns {JSX.Element|null} Error display component or null if no errors
 */
const ValidationErrors = ({ errors }) => {
  // Return null if no errors exist, preventing unnecessary DOM rendering
  if (!errors || errors.length === 0) {
    return null;
  }

  // Render error messages in a structured list format
  return (
    <div className="validation--errors">
      <h3>Validation Errors</h3>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationErrors;
