import { createSlice } from "@reduxjs/toolkit";



const initialState = {
isPageLoading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    changeLoading: (state, action) => {
   state.isPageLoading = action.payload;
    },
    
  },
});

export const { changeLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
