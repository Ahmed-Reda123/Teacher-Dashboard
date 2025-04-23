import { createSlice } from "@reduxjs/toolkit";
import { LoginUser } from "../Apis/Login";

const loginSlice = createSlice({
    name : 'login',
    initialState : {
        loginLoading : false,
        loginError : null,
        token :null,
        isAuthintecated : !!localStorage.getItem("token"),
    },
    extraReducers :(builder)=>{
        builder
        .addCase(LoginUser.pending,(state)=>{
            state.loginLoading = true;
            state.loginError = null;
        })
        .addCase(LoginUser.fulfilled,(state,action)=>{
            state.loginLoading = false;
            state.token = action.payload.token;
            state.isAuthintecated = true;
            localStorage.setItem("token",action.payload.token);
        })
        .addCase(LoginUser.rejected,(state,action)=>{
            state.loginLoading = false;
            state.loginError =action.payload;
        })
    }
});
export default loginSlice.reducer;