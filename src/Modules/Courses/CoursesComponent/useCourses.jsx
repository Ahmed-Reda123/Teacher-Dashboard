// components/Courses/useCourses.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../../redux/Apis/course";
import axios from "axios";
import toast from "react-hot-toast";
import { getAllMaterials } from "../../../redux/Apis/materials";

const useCourses = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.course);
  const {
    materials,
    loading: materialLoading,
    error: materialError,
  } = useSelector((state) => state.material);

  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    term: "",
    price: "",
    year: "",
    materialId: 0,
    active: false,
  });

  useEffect(() => {
    dispatch(getAllCourses());
    dispatch(getAllMaterials());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddCourse = async () => {
    const toastId = toast.loading("جاري التحميل");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/courses/teacher`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("تم بنجاح", { id: toastId });
      setShowDialog(false);
      dispatch(getAllCourses());
    } catch (error) {
      toast.error(error.message || "حدث خطأ", { id: toastId });
      console.error(error);
    }
  };

  return {
    courses,
    materials,
    materialLoading,
    materialError,
    loading,
    error,
    showDialog,
    setShowDialog,
    formData,
    setFormData,
    handleInputChange,
    handleAddCourse,
  };
};

export default useCourses;
