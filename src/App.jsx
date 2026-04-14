import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import User from './components/User/User';
import Auth from './components/Auth/Auth';
import { Box } from '@mui/material';

function App() {
    return (
        // Box kullanarak arkaplanı (bgcolor) doğrudan MUI temasına bağladık
        <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }} className="App">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/users/:userId" element={<User />} />
                    <Route path="/auth" element={
                        localStorage.getItem("currentUser") != null ? <Navigate to="/" replace /> : <Auth />
                    } />
                </Routes>
            </BrowserRouter>
        </Box>
    );
}

export default App;