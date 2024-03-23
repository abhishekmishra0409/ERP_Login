import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

export const setUserFromSessionStorage = () => async (dispatch) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("userData"));
    if (user) {
      dispatch(setUser(user));
    }
  } catch (error) {
    console.error("Error setting user from session storage:", error);
  }
};
const initialState = {
  user: null,
  orders: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const login = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
      try {
        const response = await authService.login(userData);
        if (!response) {
          return thunkAPI.rejectWithValue("Incorrect email or password.");
        }
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue("Login failed. Please try again later.");
      }
    }
  );
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  });


export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (buildeer) => {
    buildeer
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "success";
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
        state.message = action.payload;
      })
      
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;