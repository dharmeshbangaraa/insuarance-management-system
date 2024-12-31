import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import RegistrationPage from './components/Registration Page/Register';
import LoginPage from './components/Login Page/Login';

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<RegistrationPage />} />
            <Route path="/success" element={<LoginPage/>} />
        </Routes>
    </Router>
);
}

export default App
