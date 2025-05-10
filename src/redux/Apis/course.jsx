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
