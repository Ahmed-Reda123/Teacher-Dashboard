import { createSlice } from "@reduxjs/toolkit";
import { getAllMaterials } from "../Apis/materials";

const materialSlice = createSlice({
    name:'material',
    initialState:{
        materials:[],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) =>{
        builder
        .addCase(getAllMaterials.pending, (state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllMaterials.fulfilled, (state, action) =>{
            state.loading = false;
            state.materials = action.payload.data;
        })
        .addCase(getAllMaterials.rejected, (state, action) =>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})
export default materialSlice.reducer;