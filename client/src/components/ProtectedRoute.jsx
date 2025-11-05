import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/index.js";
import { getLoggedUser,getAllUsers } from "../api/user.js";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../redux/loaderSlice.js";
import { setUser,setAllUsers } from "../redux/userSlice.js";


export default function ProtectedRoute({ children }) {
    const {user,allUsers} = useSelector(state=>state.userReducer)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function getLoggedInUser() {
        try {
            dispatch(showLoader());
            const response = await getLoggedUser();
            dispatch(hideLoader());
            if (response.success) {
                dispatch(setUser(response.data));
            } else {
                navigate("/login");
            }
        } catch {
            dispatch(hideLoader());

            navigate("/login");
        }
    }

    async function getSearchedUsers() {
        try {
            dispatch(showLoader());
            const response = await getAllUsers();
            dispatch(hideLoader());

            if (response.success) {
                dispatch(setAllUsers(response.data));
            } else {
                navigate("/login");
            }
        } catch (error) {
            dispatch(hideLoader());
            console.log(error);
            
        }
    }

    useEffect(() => {
        async function verify() {
            try {
                await axiosInstance.get("/api/protected");
                await getLoggedInUser();
                await getSearchedUsers();
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
        
        verify();
    }, [navigate]);

    return (
        <>
            {children}
        </>
    );
}
