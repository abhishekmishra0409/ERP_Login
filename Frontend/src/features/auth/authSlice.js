import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Async thunk for student login
export const studentLogin = createAsyncThunk(
  "auth/studentLogin",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData, "student");
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for teacher login
export const teacherLogin = createAsyncThunk(
  "auth/teacherLogin",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData, "teacher");
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for student logout
export const studentLogout = createAsyncThunk(
  "auth/studentLogout",
  async (_, thunkAPI) => {
    try {
      await authService.logout("student");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for teacher logout
export const teacherLogout = createAsyncThunk(
  "auth/teacherLogout",
  async (_, thunkAPI) => {
    try {
      await authService.logout("teacher");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    student: {
      user: null,
      isError: false,
      isLoading: false,
      isSuccess: false,
      errorMessage: "",
    },
    teacher: {
      user: null,
      isError: false,
      isLoading: false,
      isSuccess: false,
      errorMessage: "",
    },
  },
  reducers: {
    setStudentUser: (state, action) => {
      state.student.user = action.payload;
    },
    setTeacherUser: (state, action) => {
      state.teacher.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Student login reducers
      .addCase(studentLogin.pending, (state) => {
        state.student.isLoading = true;
        state.student.isError = false;
      })
      .addCase(studentLogin.fulfilled, (state, action) => {
        state.student.isLoading = false;
        state.student.isSuccess = true;
        state.student.user = action.payload;
      })
      .addCase(studentLogin.rejected, (state, action) => {
        state.student.isLoading = false;
        state.student.isError = true;
        state.student.errorMessage = action.payload;
      })
      // Teacher login reducers
      .addCase(teacherLogin.pending, (state) => {
        state.teacher.isLoading = true;
        state.teacher.isError = false;
      })
      .addCase(teacherLogin.fulfilled, (state, action) => {
        state.teacher.isLoading = false;
        state.teacher.isSuccess = true;
        state.teacher.user = action.payload;
      })
      .addCase(teacherLogin.rejected, (state, action) => {
        state.teacher.isLoading = false;
        state.teacher.isError = true;
        state.teacher.errorMessage = action.payload;
      })
      // Student logout reducers
      .addCase(studentLogout.pending, (state) => {
        state.student.isLoading = true;
        state.student.isError = false;
      })
      .addCase(studentLogout.fulfilled, (state) => {
        state.student.isLoading = false;
        state.student.user = null;
      })
      .addCase(studentLogout.rejected, (state, action) => {
        state.student.isLoading = false;
        state.student.isError = true;
        state.student.errorMessage = action.payload;
      })
      // Teacher logout reducers
      .addCase(teacherLogout.pending, (state) => {
        state.teacher.isLoading = true;
        state.teacher.isError = false;
      })
      .addCase(teacherLogout.fulfilled, (state) => {
        state.teacher.isLoading = false;
        state.teacher.user = null;
      })
      .addCase(teacherLogout.rejected, (state, action) => {
        state.teacher.isLoading = false;
        state.teacher.isError = true;
        state.teacher.errorMessage = action.payload;
      });
  },
});

export const { setStudentUser, setTeacherUser } = authSlice.actions;

export default authSlice.reducer;
