import { createSlice } from '@reduxjs/toolkit';

export const departmentSlice = createSlice({
    name: 'department',
    initialState: {
        value: [],
    },
    reducers: {
        updateDepartments: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Export the generated actions
export const { updateDepartments } = departmentSlice.actions;

// Export the reducer to be included in the store
export default departmentSlice.reducer;