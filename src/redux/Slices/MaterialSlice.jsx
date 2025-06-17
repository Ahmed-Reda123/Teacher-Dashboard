// redux/Slices/teacherMaterialSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getTeacherMaterial } from "../Apis/Material";


const initialState = {
  teacherMaterials: [],
  totalDocs: 0,
  loading: false,
  error: null,
};

const teacherMaterialSlice = createSlice({
  name: "teacherMaterial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeacherMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherMaterials = action.payload.data;
        state.totalDocs = action.payload.totalDocs;
      })
      .addCase(getTeacherMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teacherMaterialSlice.reducer;
