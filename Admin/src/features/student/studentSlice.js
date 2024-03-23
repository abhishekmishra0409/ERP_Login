import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import studentService from './studentService';


export const createStudent = createAsyncThunk(
    'student/createStudent',
    async (studentData, { rejectWithValue }) => {
      try {
        const createdStudent = await studentService.createStudent(studentData);
        return createdStudent;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          
          return rejectWithValue({ message: 'Student is already registered' });
        } else {
          
          return rejectWithValue(error.response.data.message);
        }
      }
    }
  );

export const updateStudent = createAsyncThunk(
  'student/updateStudent',
  async ({ studentId, updatedData }, { rejectWithValue }) => {
    try {
      const updatedStudent = await studentService.updateStudent(studentId, updatedData);
      return updatedStudent;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



const initialState = {
  creating: false,
  updating: false,
  error: null,
  student: null,
};

// Student slice
const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling createStudent pending state
    builder.addCase(createStudent.pending, (state) => {
      state.creating = true;
      state.error = null;
    });

    // Handling createStudent fulfilled state
    builder.addCase(createStudent.fulfilled, (state, action) => {
      state.creating = false;
      state.student = action.payload;
    });

    // Handling createStudent rejected state
    builder.addCase(createStudent.rejected, (state, action) => {
      state.creating = false;
      state.error = action.payload ? action.payload.error : 'Failed to create student';
    });

    // Handling updateStudent pending state
    builder.addCase(updateStudent.pending, (state) => {
      state.updating = true;
      state.error = null;
    });

    // Handling updateStudent fulfilled state
    builder.addCase(updateStudent.fulfilled, (state, action) => {
      state.updating = false;
      state.student = action.payload;
    });

    // Handling updateStudent rejected state
    builder.addCase(updateStudent.rejected, (state, action) => {
      state.updating = false;
      state.error = action.payload ? action.payload.error : 'Failed to update student';
    });
  },
});

export default studentSlice.reducer;
