import { useNavigate } from "react-router-dom";
import "../../../css/home.css";
import { useSelector } from "react-redux";

export default function Header({socket}) {
    const { user } = useSelector((state) => state.userReducer);
    const navigate =useNavigate()
    

    function getFullName() {
        if (!user) return "";
        const fname = user.firstname
            ? user.firstname.charAt(0).toUpperCase() +
              user.firstname.slice(1).toLowerCase()
            : "";
        const lname = user.lastname
            ? user.lastname.charAt(0).toUpperCase() +
              user.lastname.slice(1).toLowerCase()
            : "";
        return `${fname} ${lname}`.trim();
    }

    function getInitials() {
        if (!user) return "";
        const f = user.firstname ? user.firstname.charAt(0).toUpperCase() : "";
        const l = user.lastname ? user.lastname.charAt(0).toUpperCase() : "";
        return `${f}${l}`;
    }

    function signout(){
        localStorage.removeItem('token');
        navigate('/login')
        socket.emit('sign-out',user._id)
    }

    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true"></i>
                <span className="brand-name">Yegna Talk</span>
            </div>
            <div className="app-user-profile">
                {!user?.profile && (
                    <div
                        className="logged-user-profile-pic"
                        onClick={() => navigate("/profile")}
                    >
                        {getInitials()}
                    </div>
                )}

                {user?.profile && (
                    <img
                        src={user?.profile}
                        alt="profile pic"
                        className="logged-user-profile-image"
                        onClick={() => navigate("/profile")}
                    />
                )}
                <div className="logged-user-name">{getFullName()}</div>
                <button className="signout-button">
                    <i className="fa-solid fa-arrow-right-from-bracket signout-btn" onClick={signout}></i>
                </button>
            </div>
        </div>
    );
}
