import { configureStore } from "@reduxjs/toolkit";
import { setUser } from "../features/auth/authSlice";

export const store = configureStore({
  reducer: setUser , 
});
