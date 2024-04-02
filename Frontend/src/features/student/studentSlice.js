import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import studentService from "./studentService";

export const studentProfile = createAsyncThunk(
  "student/profile",
  async () => {
    try {
      const response = await studentService.getAll();
      sessionStorage.setItem('userData', JSON.stringify(response.student));
      return response;
    } catch (error) {
      console.error("Error fetching student profile:", error);
      throw error;
    }
  }
);

export const getTimetable = createAsyncThunk(
  "student/timetable",
  async (data) => {
    try {
      const timetable = await studentService.timetable(data);
      sessionStorage.setItem("imgUrl", JSON.stringify(timetable.data));
      return timetable.data;
    } catch (error) {
      console.error("Error fetching timetable:", error);
      throw error;
    }
  }
);

export const updatePassword = createAsyncThunk(
  "student/updatePassword",
  async (password) => {
    try {
      await studentService.updatePassword(password);
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }
);

export const updateName = createAsyncThunk(
  "student/updateName",
  async (details) => {
    try {
      const res = await studentService.updateName(details);
      return res;
    } catch (error) {
      console.error('Error updating name:', error);
      throw error;
    }
  }
);

export const attendance = createAsyncThunk(
  "student/attendance",
  async()=>{
    try{
      const res = await studentService.getAttendance();
      return res.data;

    }catch(error){
      console.error('error in geting attendance ');
      throw error;
    }
  }
)

const studentSlice = createSlice({
  name: "student",
  initialState: {
    userData: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    errorMessage: "",
    allAttendance:""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(studentProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(studentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userData = action.payload;
      })
      .addCase(studentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updatePassword.fulfilled, (state,action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userData = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })
      .addCase(updateName.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updateName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userData = action.payload;
      })
      .addCase(updateName.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })
      // attendance storiing in payload 
      .addCase(attendance.pending, (state, action)=>{
        console.log("Error occured "+ action.payload);
      })
      .addCase(attendance.fulfilled, (state,action)=>{
        state.allAttendance = action.payload.data;
      })
      .addCase(attendance.rejected, ()=>{
        console.log("Try again");
      })
  },
});

export default studentSlice.reducer;
