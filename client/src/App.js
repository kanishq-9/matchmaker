import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Home from './pages/Home';
import UserDetails from "./pages/UserDetails";


export default function App(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path=":id" element={<UserDetails />} />
            <Route path="*" element={<Navigate to="/login" replace/>} />
        </Routes>
        </BrowserRouter>
    )
}