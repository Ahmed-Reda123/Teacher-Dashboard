import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCourses, getOneCourse } from '../Apis/course';


const courseSlice = createSlice({
  name: 'course',
  initialState: {
    courses: [],
    oneCourse : {},
    loading : false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data;
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading= false;
        state.error = action.payload;
      })
      .addCase(getOneCourse.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(getOneCourse.fulfilled,(state,action)=>{
        state.loading = false;
        state.oneCourse = action.payload;
      })
      .addCase(getOneCourse.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
