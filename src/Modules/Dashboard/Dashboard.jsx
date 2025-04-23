import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { BookOpen, FileText, HelpCircle, Users } from "lucide-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const cardData = [
  {
    title: "Course Name",
    value: "Physics",
    icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    bg: "bg-blue-100",
  },
  {
    title: "Exams Created",
    value: 5,
    icon: <FileText className="h-8 w-8 text-green-500" />,
    bg: "bg-green-100",
  },
  {
    title: "Questions Added",
    value: 150,
    icon: <HelpCircle className="h-8 w-8 text-yellow-500" />,
    bg: "bg-yellow-100",
  },
  {
    title: "Subscribed Users",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <nav className="w-full p-4 bg-white shadow-md flex items-center justify-between">
        <a
          href="/"
          className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Teacher Dashboard
        </a>
        <div className="flex items-center gap-4">
          <a
            href="/logout"
            className="text-gray-800 hover:text-red-500 transition-colors"
          >
            Logout
          </a>
          <IconButton onClick={handleMenu} size="small">
            <AccountCircleIcon className="text-gray-700" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
          </Menu>
        </div>
      </nav>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
            {cardData.map((card, idx) => (
              <div
                key={idx}
                className="w-full max-w-md rounded-3xl shadow-md transform transition-all duration-500 ease-in-out hover:scale-105 cursor-pointer group"
              >
                <Card className="group-hover:bg-blue-600 transition-colors duration-500 ease-in-out">
                  <CardContent className="p-6 flex flex-col items-start gap-4 transition-colors duration-500 ease-in-out">
                    <div className="transition-colors duration-500 ease-in-out">
                      {card.icon}
                    </div>
                    <Typography
                      variant="subtitle2"
                      className="text-gray-700 transition-colors duration-500 ease-in-out"
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-900 transition-colors duration-500 ease-in-out"
                    >
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
