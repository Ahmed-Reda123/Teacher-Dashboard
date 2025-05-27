import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllMaterials =createAsyncThunk(
    "/materials/getallmaterials",
    async(_, {rejectWithValue}) =>{
        try{
            const token = localStorage.getItem("token")
            const response = await axios.get(
                `${import.meta.env.VITE_BASEURL}/api/materials`,
                {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
        }catch(error){
            return rejectWithValue(error.message || "Error Fetching Materials")
        }
    }
)