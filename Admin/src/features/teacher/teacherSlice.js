import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import teacherService from './teacherService';

export const createTeacher = createAsyncThunk(
  'teacher/createTeacher',
  async (teacherData, { rejectWithValue }) => {
    try {
      const createdTeacher = await teacherService.createTeacher(teacherData);
      return createdTeacher;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return rejectWithValue({ message: 'Teacher is already registered' });
      } else {
        return rejectWithValue(error.response.data.message);
      }
    }
  }
);

const initialState = {
  creating: false,
  error: null,
  teacher: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling createTeacher pending state
    builder.addCase(createTeacher.pending, (state) => {
      state.creating = true;
      state.error = null;
    });

    // Handling createTeacher fulfilled state
    builder.addCase(createTeacher.fulfilled, (state, action) => {
      state.creating = false;
      state.teacher = action.payload;
    });

    // Handling createTeacher rejected state
    builder.addCase(createTeacher.rejected, (state, action) => {
      state.creating = false;
      state.error = action.payload ? action.payload.error : 'Failed to create teacher';
    });
  },
});

export default teacherSlice.reducer;
