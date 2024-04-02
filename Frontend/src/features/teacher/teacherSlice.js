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
     
  },
});

export default teacherSlice.reducer;
