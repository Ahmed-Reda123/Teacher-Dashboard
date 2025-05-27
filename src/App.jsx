import React, { useState } from "react";
import Login from "./Modules/Auth/Login";
import TeacherDashboard from "./Modules/Dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import Sidebar, { Main } from "./Component/Sidebar";
import Course from "./Modules/Courses/Courses";
import { Toaster } from "react-hot-toast";
function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Toaster />
      <Sidebar />
      <Main
        open={open}
        sx={{ flexGrow: 1, p: 3, width: "100%", overflowX: "auto" }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<TeacherDashboard />} />
          <Route path="/course" element={<Course />} />
        </Routes>
      </Main>
    </>
  );
}

export default App;
