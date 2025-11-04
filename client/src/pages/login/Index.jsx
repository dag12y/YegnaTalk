import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../api/auth";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice.js";
import { useSelector } from "react-redux";

export default function Login() {
    const { loading } = useSelector((state) => state.loaderReducer);

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            dispatch(showLoader());
            const response = await login(user);
            dispatch(hideLoader());
            if (response.success) {
                toast.success(response.message);
                localStorage.setItem("token", response.token);
                window.location.href = "/";
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
                    <h1>Login Here</h1>
                </div>
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
                <div className="card_terms">
                    <span>
                        Don't have an account yet?
                        <Link to="/signup">Signup Here</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
