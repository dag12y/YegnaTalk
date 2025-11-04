import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/index.js";
import { getLoggedUser } from "../api/user.js";

export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    async function getLoggedInUser() {
        try {
            const response = await getLoggedUser();
            if (response.success) {
                setUser(response.data);
            } else {
                navigate("/login");
            }
        } catch {
            navigate("/login");
        }
    }


    useEffect(() => {
        async function verify() {
            try {
                await axiosInstance.get("/api/protected");
                getLoggedInUser();
                setLoading(false);
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }

        verify();
    }, [navigate]);

    if (loading) return <p>Checking authentication...</p>;

    return (
        <>
            {user ? <p>name: {user.firstname}</p> : <p>Loading user...</p>}
            {children}
        </>
    );
}
