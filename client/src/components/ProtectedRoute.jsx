import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/index"; // adjust path if needed

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function verify() {
            try {
                await axiosInstance.get("/api/protected");
                setLoading(false);
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }

        verify();
    }, [navigate]);

    if (loading) return <p>Checking authentication...</p>;

    return <>{children}</>;
}
