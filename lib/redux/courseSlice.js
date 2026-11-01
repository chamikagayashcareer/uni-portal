import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
    name: "course",
    initialState: {
        value: []
    },
    reducers: {
        updateCourses: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { updateCourses } = courseSlice.actions;

export default courseSlice.reducer;