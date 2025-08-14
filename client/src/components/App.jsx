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
  
const App = () => {

  // STATE

  // HELPER FUNCTIONS
  

  // JSX
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/create" element={<CourseCreate />} />
        <Route path="/courses/:id/update" element={<CourseUpdate />} />
        <Route path="/signin" element={<UserSignIn />} />
        <Route path="/signup" element={<UserSignUp />} />
      </Routes>
    </>
  );
};

export default App;