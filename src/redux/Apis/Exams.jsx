import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllExams = createAsyncThunk(
  "exams/getAllExams",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BASEURL}/api/exams${id ? `?id=${id}` : ""}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getExamQuestions = createAsyncThunk(
    "/exam/questions",async(id,{rejectWithValue})=>{
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/questions/all/exams/${id}`,{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue("حدث خطأ اثناء جلب البيانات")
        }
    }
)