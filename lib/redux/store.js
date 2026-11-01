// lib/store.js
import { configureStore } from '@reduxjs/toolkit';
import departmentReducer from '../redux/departmentSlice';
import courseReducer from '../redux/courseSlice'
import batchReducer from '../redux/batchSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            departments: departmentReducer,
            courses: courseReducer,
            batches: batchReducer
        },
    });
};