import React from "react";
import { Routes, Route } from "react-router-dom";
import "../reset.css";
import "../global.css";

// COMPONENTS
import Header from "./Header";
import Courses from "./Courses";
import CourseDetail from "./CourseDetail";
import CourseCreate from "./CourseCreate";
import CourseUpdate from "./CourseUpdate";
import UserSignIn from "./UserSignIn";
import UserSignUp from "./UserSignUp";
import UserSignOut from "./UserSignOut";
import PrivateRoute from "./PrivateRoute";
import NotFound from "./NotFound";
import Forbidden from "./Forbidden";
import UnhandledError from "./UnhandledError";

/**
 * App Component
 * 
 * Main application component that serves as the root component and handles routing.
 * This component renders the Header component and sets up all application routes
 * using React Router. It includes both public routes (accessible to all users)
 * and protected routes (requiring authentication). Protected routes use PrivateRoute
 * for smart redirecting to intended destinations after authentication.
 */
const App = () => {
  return (
    <>
      {/* Header component displayed on all pages */}
      <Header />

      {/* Main routing configuration */}
      <Routes>
        {/* Public routes - accessible to all users */}
        <Route path="/signin" element={<UserSignIn />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/signout" element={<UserSignOut />} />
        
        {/* Protected routes - require user authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/courses/create" element={<CourseCreate />} />
          <Route path="/courses/:id/update" element={<CourseUpdate />} />
        </Route>

        {/* Error routes */}
        <Route path="/error" element={<UnhandledError />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/forbidden" element={<Forbidden />} />
        
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;