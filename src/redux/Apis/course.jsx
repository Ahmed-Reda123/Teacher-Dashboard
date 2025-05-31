import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllCourses = createAsyncThunk(
  "/course/getallcourses",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching courses");
    }
  }
);
export const getOneCourse = createAsyncThunk(
  "/course/getonecourse",async({id},{rejectWithValue})=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/courses/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "حدث خطأ في جلب الدورة");
    }
  }
)