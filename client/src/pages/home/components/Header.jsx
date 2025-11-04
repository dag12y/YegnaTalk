import "../../../css/home.css";
import { useSelector } from "react-redux";

export default function Header() {
    const { user } = useSelector((state) => state.userReducer);

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

    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true"></i>
                <span className="brand-name">Yegna Talk</span>
            </div>
            <div className="app-user-profile">
                <div className="logged-user-name">{getFullName()}</div>
                <div className="logged-user-profile-pic">{getInitials()}</div>
            </div>
        </div>
    );
}
