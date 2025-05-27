import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCourses } from '../Apis/course';


const courseSlice = createSlice({
  name: 'course',
  initialState: {
    courses: [],
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
      });
  },
});

export default courseSlice.reducer;
