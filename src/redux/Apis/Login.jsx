import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const LoginUser = createAsyncThunk('/login',async({email,password},{rejectWithValue})=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASEURL}/api/auth/login`,{
            email,password
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue("Something went wrong");
    }
})