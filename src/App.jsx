import React from "react";
import Login from "./Modules/Auth/Login";
import TeacherDashboard from "./Modules/Dashboard/Dashboard";
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
