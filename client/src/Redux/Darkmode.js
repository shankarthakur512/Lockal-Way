// src/redux/slices/darkModeSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Check if the user has a saved dark mode preference in localStorage
// const initialDarkMode = localStorage.getItem("darkMode") === "true";

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState: {
    isDarkMode: false, 
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    //   localStorage.setItem("darkMode", state.isDarkMode); // Persist the dark mode preference
    },
    enableDarkMode: (state) => {
      state.isDarkMode = true;
    //   localStorage.setItem("darkMode", true); // Persist the dark mode preference
    },
    disableDarkMode: (state) => {
      state.isDarkMode = false;
    //   localStorage.setItem("darkMode", false); // Persist the dark mode preference
    },
  },
});

// Export the actions
export const { toggleDarkMode, enableDarkMode, disableDarkMode } = darkModeSlice.actions;

// Export the reducer
export default darkModeSlice.reducer;
