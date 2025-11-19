import { useState } from "react";
import { Link } from "react-router-dom";
import { signup, sendOtp, verifyOtp } from "../../api/auth";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";

export default function Signup() {
    const { loading } = useSelector((state) => state.loaderReducer);

    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const dispatch = useDispatch();

    // SEND OTP
    async function handleSendOtp() {
        if (!user.email) {
            return toast.error("Please enter an email first");
        }

        try {
            dispatch(showLoader());
            const response = await sendOtp(user.email);
            dispatch(hideLoader());

            if (response.success) {
                toast.success("OTP sent to your email");
                setOtpSent(true);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error("Failed to send OTP");
        }
    }

    // VERIFY OTP
    async function handleVerifyOtp() {
        if (!otp) return toast.error("Enter the OTP");

        try {
            dispatch(showLoader());
            const response = await verifyOtp(user.email, otp);
            dispatch(hideLoader());

            if (response.success) {
                toast.success("Email verified");
                setOtpVerified(true);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error("OTP verification failed");
        }
    }

    // SIGNUP
    async function handleFormSubmit(e) {
        e.preventDefault();

        if (!otpVerified) {
            return toast.error("Please verify your email before signing up");
        }

        try {
            dispatch(showLoader());
            const response = await signup(user);
            dispatch(hideLoader());

            if (response.success) {
                toast.success("Account created successfully");
                window.location.href = "/login";
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error("Something went wrong");
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

                <form onSubmit={handleFormSubmit}>
                    <div className="form">
                        <div className="column">
                            <input
                                type="text"
                                placeholder="First Name"
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
                                value={user.lastname}
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        lastname: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {/* EMAIL + SEND OTP */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={user.email}
                                onChange={(e) =>
                                    setUser({ ...user, email: e.target.value })
                                }
                            />

                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="otp-btn"
                            >
                                {otpSent ? "Resend OTP" : "Send OTP"}
                            </button>
                        </div>

                        {/* OTP INPUT */}
                        {otpSent && (
                            <div style={{ marginTop: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    className="otp-verify-btn"
                                >
                                    Verify OTP
                                </button>
                            </div>
                        )}

                        {/* PASSWORD */}
                        <input
                            type="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                        />

                        <button
                            type="submit"
                            disabled={loading || !otpVerified}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </div>
                </form>

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
