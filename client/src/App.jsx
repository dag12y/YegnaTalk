import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/home/Index";
import Login from "./pages/login/Index";
import Signup from "./pages/signup/Index";

export default function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}
