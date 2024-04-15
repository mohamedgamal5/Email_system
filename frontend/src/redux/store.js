import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { emailReducer } from "./slices/emailSlice";
import { profileReducer } from "./slices/profileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    profile: profileReducer,
  },
});

export default store;
