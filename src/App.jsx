import React from "react";

import Login from "./Components/Login";
import TeacherDashboard from "./Components/Dashboard";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<TeacherDashboard/>}/>
      </Routes>
    </>
  );
  
}

export default App;
