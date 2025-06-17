import React, { useEffect } from "react";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherMaterial } from "../../redux/Apis/Material";

export default function TeacherDashboard() {
  const { teacherMaterials, loading, error } = useSelector(state => state.material);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getTeacherMaterial());
  },[dispatch])
  const firstMaterial = teacherMaterials?.[0];

  const cardData = [
    {
      title: "اسم المقرر",
      value: firstMaterial?.Material?.name || "لا يوجد مقرر",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      bg: "bg-blue-100",
    },
    {
      title: "عدد الامتحانات المنشأة",
      value: 0, // Replace with real count if available
      icon: <FileText className="h-8 w-8 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      title: "عدد الأسئلة المضافة",
      value: 0, // Replace with real count if available
      icon: <HelpCircle className="h-8 w-8 text-yellow-500" />,
      bg: "bg-yellow-100",
    },
    {
      title: "عدد المستخدمين المشتركين",
      value: 0, // Replace with real count if available
      icon: <Users className="h-8 w-8 text-purple-500" />,
      bg: "bg-purple-100",
    },
  ];

  return (
    <div dir="rtl" className="flex items-center justify-center py-20">
      <div className="w-full px-4 md:px-8">
        {loading ? (
          <p className="text-center text-gray-600">جاري التحميل...</p>
        ) : error ? (
          <p className="text-center text-red-600">خطأ: {error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4">
            {cardData.map((card, idx) => (
              <div
                key={idx}
                className="w-11/12 rounded-3xl shadow-md transform transition-all duration-500 ease-in-out hover:scale-105 cursor-pointer group"
              >
                <div className="transition-colors duration-500 ease-in-out">
                  <div className="p-6 flex flex-col items-start gap-4">
                    <div>{card.icon}</div>
                    <h2 className="text-gray-700">{card.title}</h2>
                    <h6 className="font-semibold text-gray-900">{card.value}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
