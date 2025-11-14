import "./../../css/profile.css";
import { useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Profile() {
    const { user } = useSelector((state) => state.userReducer);
    const [image, setImage] = useState("");

    useEffect(() => {
        if (user?.profile) {
            setImage(user.profile);
        }
    }, [user]);

    function getInitials() {
        if (!user) return "";
        const f = user.firstname ? user.firstname.charAt(0).toUpperCase() : "";
        const l = user.lastname ? user.lastname.charAt(0).toUpperCase() : "";
        return `${f}${l}`;
    }

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

    function onFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
        };
    }

    return (
        <div className="profile-page-container">
            <div className="profile-pic-container">
                {image ? (
                    <img
                        src={image}
                        alt="Profile Pic"
                        className="user-profile-pic-upload"
                    />
                ) : (
                    <div className="user-default-profile-avatar">
                        {getInitials()}
                    </div>
                )}
            </div>

            <div className="profile-info-container">
                <div className="user-profile-name">
                    <h1>{getFullName()}</h1>
                </div>
                <div>
                    <b>Email: </b>
                    {user?.email}
                </div>
                <div>
                    <b>Account Created: </b>
                    {moment(user?.createdAt).format("MMM DD, YYYY")}
                </div>
                <div className="select-profile-pic-container">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileSelect}
                    />
                </div>
            </div>
        </div>
    );
}
