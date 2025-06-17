// components/Courses/Course.jsx
import React from "react";
import useCourses from "./CoursesComponent/useCourses";
import Loading from "../../Components/Loading/Loading";
import CourseDialog from "./CoursesComponent/CourseDialog";
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
    handleToggleCourse,
    togglingId
  } = useCourses();

  return (
    <div>
      {error && <p>Error: {error}</p>}

      <div className="mt-15 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-main">الدورات</h1>
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
          <CoursesTable courses={courses} handleToggleCourse={handleToggleCourse} togglingId={togglingId}/>
        )}
      </div>
    </div>
  );
};

export default Course;
