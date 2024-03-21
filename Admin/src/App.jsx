import './App.css'
// import LayoutD from './Components/layout'
import  Login  from './Pages/login';
import Dashboard from './Pages/dashboard';
import { BrowserRouter as Router , Routes, Route } from "react-router-dom";

function App() {
  

  return (
      <Router>
      <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/admin' element={<Dashboard/>} />
    </Routes>
    </Router>
  )
}

export default App
