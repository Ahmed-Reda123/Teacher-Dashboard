import { configureStore } from "@reduxjs/toolkit";
import courseReducer from './Slices/courseSlice';
import loginReducer from './Slices/LoginSlice';
import materialReducer from './Slices/materialSlice';
const store = configureStore({
    reducer: {
        course: courseReducer,
        auth: loginReducer,
        material: materialReducer
    }
})
export default store;