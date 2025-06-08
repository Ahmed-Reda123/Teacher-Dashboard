import React, { useState } from "react";
import Login from "./Modules/Auth/Login";
import TeacherDashboard from "./Modules/Dashboard/Dashboard";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar, { Main } from "./Components/Sidebar";
import Course from "./Modules/Courses/Courses";
import { Toaster } from "react-hot-toast";
import OneCourse from "./Modules/Courses/OneCourse";
import AddPart from "./Modules/Parts/AddPart";
import PrivateRoute from "./Components/protectedRoutes";
import AddLesson from "./Modules/Lesson/AddLesson";
function App() {
   const [open, setOpen] = useState(false);
  const location = useLocation();

  // Routes that should NOT have the sidebar
  const noSidebarRoutes = ["/login"];
  const isSidebarVisible = !noSidebarRoutes.includes(location.pathname);
  return (
    <>
      <Toaster />
     {isSidebarVisible && (
        <Sidebar open={open} setOpen={setOpen} />
      )}
      <Main
        open={open}
        sx={{ flexGrow: 1, paddingY: 8, width: "100%", overflowX: "auto" }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><TeacherDashboard /></PrivateRoute>} />
          <Route path="/course" element={<PrivateRoute><Course /></PrivateRoute>} />
          <Route path="/course/:id" element={<PrivateRoute><OneCourse /></PrivateRoute>} />
          <Route path="/addpart/:id" element={<PrivateRoute><AddPart /></PrivateRoute>} />
          <Route path="/addlesson/:id" element={<PrivateRoute><AddLesson /></PrivateRoute>} />
        </Routes>
      </Main>
    </>
  );
}

export default App;
