// redux/Apis/teacherMaterial.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTeacherMaterial = createAsyncThunk(
  "teacherMaterial/getTeacherMaterial",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/teacher-materials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "حدث خطأ أثناء جلب البيانات"
      );
    }
  }
);
