import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/home/Index";
import Login from "./pages/login/Index";
import Signup from "./pages/signup/Index";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";

export default function App() {
    const { loader } = useSelector((state) => state.loaderReducer);

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            {loader && <Loader />}

            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
