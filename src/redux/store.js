import { configureStore } from "@reduxjs/toolkit";
import courseReducer from './Slices/courseSlice';
import loginReducer from './Slices/LoginSlice';
const store = configureStore({
    reducer: {
        course: courseReducer,
        auth: loginReducer
    }
})
export default store;