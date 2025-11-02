import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../api/auth";

export default function Login() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await login(user)
            if (response.success) {
                alert(response.message);
                localStorage.setItem("token", response.token);
                window.location.href = "/";
            } else {
                alert(response.message);
            }

        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong. Please try again.");
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
                        <button>Login</button>
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
