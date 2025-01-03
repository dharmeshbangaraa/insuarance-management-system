import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
// import RegistrationPage from './components/Registration Page/Register';
import LoginPage from './components/Login Page/Login';
import Homepage from './components/Home Page/Homepage';

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/success" element={<LoginPage/>} />
        </Routes>
    </Router>
);
}

export default App
