import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../redux/Apis/course";
import CoursesTable from "./CoursesProvider/CoursesTable";

const Course = () => {
  const dispatch = useDispatch();

  const { courses, loading, error } = useSelector((state) => state.course);
  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="flex my-24">
        
      <CoursesTable courses={courses} />
      </div>
    </div>
  );
};

export default Course;
