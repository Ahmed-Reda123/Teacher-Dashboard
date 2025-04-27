import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { BookOpen, FileText, HelpCircle, Layout, Users } from "lucide-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const cardData = [
  {
    title: "اسم المقرر",
    value: "الفيزياء",
    icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    bg: "bg-blue-100",
  },
  {
    title: "عدد الامتحانات المنشأة",
    value: 5,
    icon: <FileText className="h-8 w-8 text-green-500" />,
    bg: "bg-green-100",
  },
  {
    title: "عدد الأسئلة المضافة",
    value: 150,
    icon: <HelpCircle className="h-8 w-8 text-yellow-500" />,
    bg: "bg-yellow-100",
  },
  {
    title: "عدد المستخدمين المشتركين",
    value: 320,
    icon: <Users className="h-8 w-8 text-purple-500" />,
    bg: "bg-purple-100",
  },
];

export default function TeacherDashboard() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      dir="rtl"
      className="flex items-center justify-center py-20"
    >
      <div className="w-full  px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4" >
          {cardData.map((card, idx) => (
            <div
              key={idx}
              className="w-11/12  rounded-3xl shadow-md transform transition-all duration-500 ease-in-out hover:scale-105 cursor-pointer group"
              
            >
              <div className="transition-colors  duration-500 ease-in-out">
                <div className="p-6 flex flex-col items-start gap-4 transition-colors duration-500 ease-in-out">
                  <div className="transition-colors duration-500 ease-in-out">
                    {card.icon}
                  </div>
                  <h2
                    
                    className="text-gray-700 transition-colors duration-500 ease-in-out"
                  >
                    {card.title}
                  </h2>
                  <h6
                    
                    className="font-semibold text-gray-900 transition-colors duration-500 ease-in-out"
                  >
                    {card.value}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
