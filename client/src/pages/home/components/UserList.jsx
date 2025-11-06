import { useSelector } from "react-redux";

export default function UserList({ search }) {
    const { allUsers, allChats } = useSelector((state) => state.userReducer);
    const lowerSearch = search.toLowerCase();

    const filteredUsers = allUsers.filter((user) => {
        if (!search.trim()) {
            return allChats.some((chat) => chat.members.includes(user._id));
        }

        return (
            user.firstname?.toLowerCase().includes(lowerSearch) ||
            user.lastname?.toLowerCase().includes(lowerSearch)
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
                            {!allChats.find((chat) =>
                                chat.members.includes(user._id)
                            ) && (
                                <div className="user-start-chat">
                                    <button className="user-start-chat-btn">
                                        Start Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
