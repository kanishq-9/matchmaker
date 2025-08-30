import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";


export default function App(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace/>} />
        </Routes>
        </BrowserRouter>
    )
}