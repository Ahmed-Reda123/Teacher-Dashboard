import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../../redux/Apis/Login";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loginError, loginLoading, isAuthintecated } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
    if (isAuthintecated) {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Paper elevation={6} className="py-12 px-4 w-full max-w-2xl rounded-xl">
        <div className="text-center mb-4">
          <h2
            className="text-main text-2xl"
          >
            تسجيل الدخول إلي لوحة تحكم المدرس
          </h2>
        </div>

        <form onSubmit={handleSubmit} dir="rtl">
          <div className="email-field mb-3">
            <TextField
              label="البريد الإلكتروني"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pass-field">
            <TextField
              label="كلمة المرور"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
          </div>
          {loginError && (
            <p className="text-red-500 text-center my-4">{loginError || "Error"}</p>
          )}
          <div className="pt-2">
            <button
              className="bg-[#09122C] cursor-pointer p-2 w-full rounded-md  text-white"
            >
              {loginLoading ? "جاري الحميل..." : "تسجيل الدخول"}
            </button>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export default Login;
