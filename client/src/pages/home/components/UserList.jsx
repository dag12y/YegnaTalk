import { useSelector } from "react-redux";

export default function UserList({ search }) {
    const { allUsers } = useSelector((state) => state.userReducer);

    // if search is empty, show nothing
    if (!search || search.trim() === "") {
        return null;
    }

    const filteredUsers = allUsers.filter((user) => {
        return (
            user.firstname.toLowerCase().includes(search.toLowerCase()) ||
            user.lastname.toLowerCase().includes(search.toLowerCase())
        );
    });

    if (filteredUsers.length === 0) {
        return <div>No users found</div>;
    }

    return (
        <>
            {filteredUsers.map((user) => (
                <div key={user._id} className="user-search-filter">
                    <div className="filtered-user">
                        <div className="filter-user-display">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="profile pic"
                                    className="user-profile-image"
                                />
                            ) : (
                                <div className="user-default-profile-pic">
                                    {user.firstname[0]}
                                    {user.lastname[0]}
                                </div>
                            )}

                            <div className="filter-user-details">
                                <div className="user-display-name">
                                    {user.firstname} {user.lastname}
                                </div>
                                <div className="user-display-email">
                                    {user.email}
                                </div>
                            </div>
                            <div className="user-start-chat">
                                <button className="user-start-chat-btn">
                                    Start Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
