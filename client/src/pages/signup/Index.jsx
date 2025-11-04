import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../../api/auth";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice.js";
import { useSelector } from "react-redux";

export default function Signup() {
    const { loading } = useSelector((state) => state.loaderReducer);

    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });
    const dispatch = useDispatch();

    async function handleFormSubmit(e) {
        e.preventDefault();
        try {
            dispatch(showLoader());
            const response = await signup(user);
            dispatch(hideLoader());
            if (response.success) {
                toast.success(response.message);
                window.location.href = "/login";
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    }

    return (
        <div className="container">
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
                <div className="card_title">
                    <h1>Create Account</h1>
                </div>
                <div className="form">
                    <form onSubmit={handleFormSubmit}>
                        <div className="column">
                            <input
                                type="text"
                                placeholder="First Name"
                                autoComplete="off"
                                value={user.firstname}
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        firstname: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                autoComplete="off"
                                value={user.lastname}
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        lastname: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            autoComplete="off"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="off"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>
                </div>
                <div className="card_terms">
                    <span>
                        Already have an account?{" "}
                        <Link to="/login">Login Here</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
