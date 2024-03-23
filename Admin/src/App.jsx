import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserFromSessionStorage } from './features/auth/authSlice'; 

import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import LayoutD from './Components/layout';
import Create_Student from './Pages/Create_Student';
import Create_Teacher from './Pages/Create_Teacher';
import Update_Student from './Pages/Update_Student';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch action to set user data from session storage
    dispatch(setUserFromSessionStorage());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<LayoutD />}>
          <Route index element={<Dashboard />} />
          <Route path="create-student" element={<Create_Student />} />
          <Route path="create-teacher" element={<Create_Teacher />} />
          <Route path="update-student" element={<Update_Student />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
