import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Index";
import Login from "./pages/login/Index";
import Signup from "./pages/signup/Index";

export default function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/Signup" element={<Signup/>}></Route>
                    <Route path="/Login" element={<Login/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
