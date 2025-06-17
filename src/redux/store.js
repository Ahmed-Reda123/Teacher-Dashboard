import { configureStore } from "@reduxjs/toolkit";
import courseReducer from './Slices/courseSlice';
import loginReducer from './Slices/LoginSlice';
import materialReducer from './Slices/MaterialSlice';
import examReducer from './Slices/examSlice.jsx';
const store = configureStore({
    reducer: {
        course: courseReducer,
        auth: loginReducer,
        material: materialReducer,
        exams : examReducer
    }
})
export default store;