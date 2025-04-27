import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './Slices/LoginSlice';
const store = configureStore({
    reducer: {
        auth: loginReducer
    }
})
export default store;