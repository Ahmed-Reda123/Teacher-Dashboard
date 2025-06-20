import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllCourses, getOneCourse } from "../../redux/Apis/course";
import axios from "axios";
import toast from "react-hot-toast";

const AddExam = () => {
  const dispatch = useDispatch();
  const { courses, oneCourse, loading } = useSelector((state) => state.course);

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [type, setType] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: new Date().toISOString().slice(0, 16),
  });

  // Get all courses on mount
  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  // Fetch course details when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      dispatch(getOneCourse({ id: selectedCourseId }));
      setType("");
      setSelectedId(null);
    }
  }, [dispatch, selectedCourseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      type,
      courseId: selectedCourseId,
      partId: type === "PART" ? selectedId : undefined,
      lessonId: type === "LESSON" ? selectedId : undefined,
    };

    if (!payload.partId) delete payload.partId;
    if (!payload.lessonId) delete payload.lessonId;
      try {
        
        const token = localStorage.getItem("token");
        const response = await axios.post(`${import.meta.env.VITE_BASEURL}/api/exams`,payload,{
          headers : {
            Authorization : `Bearer ${token}`
          }
        })
          toast.success("تم الاضافة بنجاح")

      } catch (error) {
        toast.error("حدث خطأ")
      }
  };

  const renderTypeDropdown = () => {
    if (!selectedCourseId || !oneCourse?.data) return null;

    return (
      <select
        className="border p-2 rounded w-full"
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          setSelectedId(null);
        }}
      >
        <option value="">اختر نوع الاختبار</option>
        <option value="COURSE">اختبار على دورة كاملة</option>
        <option value="PART">اختبار على جزء</option>
        <option value="LESSON">اختبار على درس</option>
      </select>
    );
  };

  const renderEntityDropdown = () => {
    if (!oneCourse?.data || !type) return null;

    const course = oneCourse.data;

    if (type === "COURSE") {
      return (
        <select
          className="border p-2 rounded w-full"
          value={course.id}
          onChange={() => setSelectedId(course.id)}
        >
          <option value={course.id}>{course.name}</option>
        </select>
      );
    }

    if (type === "PART") {
      return (
        <select
          className="border p-2 rounded w-full"
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          <option value="">Select a part</option>
          {course.Part?.map((part) => (
            <option key={part.id} value={part.id}>
              {part.name}
            </option>
          ))}
        </select>
      );
    }

    if (type === "LESSON") {
      const lessons =
        course.Part?.flatMap((part) => part.Lesson || []) || [];
      return (
        <select
          className="border p-2 rounded w-full"
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          <option value="">اختر درس</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </select>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">اضافة اختبار</h2>

        {/* Course Selector */}
        <select
          className="border p-2 rounded w-full"
          value={selectedCourseId || ""}
          onChange={(e) => setSelectedCourseId(Number(e.target.value))}
        >
          <option value="">اختر دورة</option>
          {courses?.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        {renderTypeDropdown()}
        {renderEntityDropdown()}

        <input
          type="text"
          placeholder="اسم الاختبار"
          className="border p-2 rounded w-full"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <textarea
          placeholder="وصف"
          className="border p-2 rounded w-full"
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <input
          type="datetime-local"
          className="border p-2 rounded w-full"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-main text-white py-2 px-4 rounded "
          disabled={loading || !selectedId}
        >
          {loading ? "يتم التحميل" : "أضافة الاختبار"}
        </button>
      </form>
    </div>
  );
};

export default AddExam;
