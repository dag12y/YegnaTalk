import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../../api/auth";

export default function Signup() {
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    async function handleFormSubmit(e) {
        e.preventDefault();
        try {
            const response = await signup(user);

            alert(response.message);
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
                        <button>Sign Up</button>
                    </form>
                </div>
                <div className="card_terms">
                    <span>
                        Already have an account?
                        <Link to="/login">Login Here</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
