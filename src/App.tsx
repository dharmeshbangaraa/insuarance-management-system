import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
// import RegistrationPage from './components/Registration Page/Register';
import LoginPage from './components/Login Page/Login';
import Homepage from './components/Home Page/Homepage';
import RegistrationPage from './components/Registration Page/Register';
import MyProfile from './components/My Profile/MyProfile';

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/" element={<LoginPage/>} />
            <Route path="/home" element={<Homepage/>} />
            <Route path="/myprofile" element={<MyProfile/>} />
        </Routes>
    </Router>
);
}

export default App
