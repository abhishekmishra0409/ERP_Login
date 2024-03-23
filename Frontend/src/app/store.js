import {configureStore} from '@reduxjs/toolkit';
import { setStudentUser,setTeacherUser } from '../features/auth/authSlice';

export const store = configureStore({
    reducer:    setStudentUser,setTeacherUser
})