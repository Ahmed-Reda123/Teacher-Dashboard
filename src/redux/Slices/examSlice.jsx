import { createSlice } from "@reduxjs/toolkit";
import { getAllExams, getExamQuestions } from "../Apis/Exams";


const initialState = {
  exams: [],
  totalDocs: 0,
  count: 0,
  loading: false,
  error: null,
  examQuestions : []
};

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload.data;
        state.totalDocs = action.payload.totalDocs;
        state.count = action.payload.count;
      })
      .addCase(getAllExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch exams";
      })
      .addCase(getExamQuestions.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(getExamQuestions.fulfilled,(state,action)=>{
        state.examQuestions = action.payload.data;
        state.loading = false;
      })
      .addCase(getExamQuestions.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload
      })
  },
});

export default examsSlice.reducer;
