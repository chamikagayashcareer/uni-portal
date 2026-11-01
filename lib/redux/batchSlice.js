import { createSlice } from "@reduxjs/toolkit";

export const batchSlice = createSlice({
    name: "batch",
    initialState: {
        value: []
    },
    reducers: {
        updateBatch: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { updateBatch } = batchSlice.actions;

export default batchSlice.reducer;