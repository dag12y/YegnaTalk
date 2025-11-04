import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/index.js";
import { getLoggedUser } from "../api/user.js";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../redux/loaderSlice.js";

export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function getLoggedInUser() {
        try {
            dispatch(showLoader());
            const response = await getLoggedUser();
            dispatch(hideLoader());
            if (response.success) {
                setUser(response.data);
            } else {
                navigate("/login");
            }
        } catch {
            dispatch(hideLoader());

            navigate("/login");
        }
    }

    useEffect(() => {
        async function verify() {
            try {
                await axiosInstance.get("/api/protected");
                await getLoggedInUser();
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }

        verify();
    }, [navigate]);

    return (
        <>
            {user ? <p>name: {user.firstname}</p> : <p>Loading user...</p>}
            {children}
        </>
    );
}
