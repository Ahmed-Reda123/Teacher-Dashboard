import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const LoginUser = createAsyncThunk(
  "/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      if(response.data.data.role !== "TEACHER" && response.data.data.role !=="ADMIN"){
        console.log("role",response.data.data.role);
        
        return rejectWithValue("غير مصرح بالدخول")
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue("خطأ في البريد الالكتروني او كلمة مرور غير صحيحة!");
    }
  }
);
