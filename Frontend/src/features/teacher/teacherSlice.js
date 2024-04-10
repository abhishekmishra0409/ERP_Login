import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import teacherService from './teacherservice';

export const fetchBatches = createAsyncThunk(
  'teacher/fetchBatches',
  async () => {
    try {
      const response = await teacherService.getBatches();
      return response;
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw error;
    }
  }
);

export const fetchStudentsByBatch = createAsyncThunk(
  'teacher/fetchStudentsByBatch',
  async (batchId) => {
    try {
      const response = await teacherService.getStudentByBatch(batchId);
      return response;
    } catch (error) {
      console.error('Error fetching students by batch:', error);
      throw error;
    }
  }
);

export const uploadTimeTable = createAsyncThunk(
  'teacher/uploadTimeTable',
  async (formData) => {
    try {
      const response = await teacherService.uploadTimeTable(formData);
      return response;
    } catch (error) {
      console.error('Error uploading time table:', error);
      throw error;
    }
  }
);

export const postMarks = createAsyncThunk(
  'teacher/postMarks',
  async (marksData) => {
    try {
      const response = await teacherService.postMarks(marksData);
      return response;
    } catch (error) {
      console.error('Error posting marks:', error);
      throw error;
    }
  }
);

export const sendYourMsg = createAsyncThunk(
  "teacher/send-message",
  async (sendMessage) => {
    try{
        const res = await teacherService.sendMsg(sendMessage);
        // console.log(res);
          return res;
    }catch(error){
      console.error("Error occurred "+error);
      throw error;
    }
  }
)

export const getYourMsg = createAsyncThunk(
  "teacher/get-message",
  async() =>{
    try{
      const res = await teacherService.getMsg();
      // console.log(res);
        return res;
    }catch(error){
      console.error(error);
      throw error;
    }
  }
)

export const deleteMsg = createAsyncThunk(
  "teacher/delete-message",
  async(_id) =>{
    try{
    const dlt = await teacherService.dltMsg(_id);
      // console.log(dlt);
      return dlt;
    }catch(error){
      console.error(error);
      throw error;
    }
  }
)
const initialState = {
  batches: [],
  students: [],
  isLoading: false,
  isError: false,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.batches = action.payload;
      })
      .addCase(fetchBatches.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(fetchStudentsByBatch.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchStudentsByBatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudentsByBatch.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(uploadTimeTable.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(uploadTimeTable.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadTimeTable.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(postMarks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(postMarks.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(postMarks.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default teacherSlice.reducer;
