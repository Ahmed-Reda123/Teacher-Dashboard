// components/Courses/Course.jsx
import React from "react";
import useCourses from "./useCourses";
import Loading from "../../Component/Loading/Loading";
import CourseDialog from "./CourseDialog";
import CoursesTable from "./CoursesComponent/CoursesTable";

const Course = () => {
  const {
    courses,
    materials,
    materialLoading,
    materialError,
    loading,
    error,
    showDialog,
    setShowDialog,
    formData,
    handleInputChange,
    handleAddCourse,
  } = useCourses();

  return (
    <div>
      {error && <p>Error: {error}</p>}

      <div className="mt-15 text-right">
        <button
          onClick={() => setShowDialog(true)}
          className="bg-main text-white px-4 py-2 rounded cursor-pointer"
        >
          اضف دورة
        </button>
      </div>

      <CourseDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleAddCourse}
        formData={formData}
        onChange={handleInputChange}
        materials={materials}
      />

      <div className="my-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <CoursesTable courses={courses} />
        )}
      </div>
    </div>
  );
};

export default Course;
