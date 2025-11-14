import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "./../../../api/chat.js";
import { hideLoader, showLoader } from "./../../../redux/loaderSlice.js";
import { setAllChats, setSelectedChat } from "./../../../redux/userSlice.js";
import moment from "moment";
import { useEffect } from "react";
import store from "./../../../redux/store.js";

export default function UserList({ search, socket ,onlineUsers}) {
    const {
        allUsers,
        allChats,
        user: currentUser,
        selectedChat,
    } = useSelector((state) => state.userReducer);

    const dispatch = useDispatch();
    const lowerSearch = search.toLowerCase();

    const filteredUsers = allUsers.filter((user) => {
        if (!search.trim()) {
            return allChats.some((chat) =>
                chat.members?.map((m) => m._id).includes(user._id)
            );
        }

        return (
            user.firstname?.toLowerCase().includes(lowerSearch) ||
            user.lastname?.toLowerCase().includes(lowerSearch)
        );
    });

    useEffect(() => {
        socket.on("receive-message", (message) => {
            const selectedChat = store.getState().userReducer.selectedChat;
            let allChats = store.getState().userReducer.allChats;

            if (selectedChat?._id !== message.chatId) {
                const updatedChats = allChats.map((chat) => {
                    if (chat._id === message.chatId) {
                        return {
                            ...chat,
                            unreadMessageCount:
                                (chat?.unreadMessageCount || 0) + 1,
                            lastMessage: message,
                        };
                    }
                    return chat;
                });
                allChats=updatedChats;
            }
            const latestChat = allChats.find(chat=>chat._id===message.chatId)
            const otherChats = allChats.filter(chat=>chat._id !== message.chatId)
            allChats=[latestChat,...otherChats]
            dispatch(setAllChats(allChats));
        });
    }, [socket, dispatch]);

    async function handleNewChat(searchedUserId) {
        try {
            dispatch(showLoader());
            const response = await createNewChat([
                currentUser._id,
                searchedUserId,
            ]);
            dispatch(hideLoader());

            if (response.success) {
                toast.success(response.message);
                const newChat = response.data;
                const updatedChat = [...allChats, newChat];
                dispatch(setAllChats(updatedChat));
                dispatch(setSelectedChat(newChat));
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
        }
    }

    function openChat(selectedUserId) {
        const chat = allChats.find(
            (chat) =>
                chat.members.some((m) => m._id === currentUser._id) &&
                chat.members.some((m) => m._id === selectedUserId)
        );
        if (chat) {
            dispatch(setSelectedChat(chat));
        }
    }

    const isSelectedChat = (user) =>
        selectedChat
            ? selectedChat.members.map((u) => u._id).includes(user._id)
            : false;

    function getLastMessageTimestamps(userId) {
        const chat = allChats.find(
            (chat) =>
                chat.members.some((m) => m._id === userId) &&
                chat.members.some((m) => m._id === currentUser._id)
        );

        if (!chat?.lastMessage) return "";
        return moment(chat.lastMessage.createdAt).format("hh:mm A");
    }

    function getLastMessage(userId) {
        const chat = allChats.find(
            (chat) =>
                chat.members.some((m) => m._id === userId) &&
                chat.members.some((m) => m._id === currentUser._id)
        );
        if (!chat?.lastMessage) return "";

        const isCurrentUserSender = chat.lastMessage.sender === currentUser._id;
        const prefix = isCurrentUserSender ? "You: " : "";
        return `${prefix}${chat.lastMessage.text}`;
    }

    function getUnreadMessageCount(userId) {
        const chat = allChats.find((chat) =>
            chat.members.map((m) => m._id).includes(userId)
        );
        if (
            chat &&
            chat.unreadMessageCount &&
            chat.lastMessage.sender !== currentUser._id
        ) {
            return chat.unreadMessageCount;
        }
        return "";
    }

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const chatA = allChats.find(
            (chat) =>
                chat.members.some((m) => m._id === a._id) &&
                chat.members.some((m) => m._id === currentUser._id)
        );
        const chatB = allChats.find(
            (chat) =>
                chat.members.some((m) => m._id === b._id) &&
                chat.members.some((m) => m._id === currentUser._id)
        );

        const timeA = chatA?.lastMessage?.createdAt
            ? new Date(chatA.lastMessage.createdAt).getTime()
            : 0;
        const timeB = chatB?.lastMessage?.createdAt
            ? new Date(chatB.lastMessage.createdAt).getTime()
            : 0;

        return timeB - timeA;
    });

    if (filteredUsers.length === 0) {
        return <div>No users found</div>;
    }

    return (
        <>
            {sortedUsers.map((obj) => {
                let user = obj;
                if (obj.members) {
                    user = obj.members.find((m) => m._id !== currentUser._id);
                }
                return (
                    <div
                        key={user._id}
                        className="user-search-filter"
                        onClick={() => openChat(user._id)}
                    >
                        <div
                            className={
                                !isSelectedChat(user)
                                    ? "filtered-user"
                                    : "selected-user"
                            }
                        >
                            <div className="filter-user-display">
                                {user.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt="profile pic"
                                        className="user-profile-image"
                                        style={
                                            onlineUsers.includes(user._id)
                                                ? { border: "green 3px solid" }
                                                : {}
                                        }
                                    />
                                ) : (
                                    <div
                                        className="user-default-profile-pic"
                                        style={
                                            onlineUsers.includes(user._id)
                                                ? { border: "#4ade80 4px solid" }
                                                : {}
                                        }
                                    >
                                        {user.firstname[0]}
                                        {user.lastname[0]}
                                    </div>
                                )}

                                <div className="filter-user-details">
                                    <div className="user-display-name">
                                        {user.firstname} {user.lastname}
                                    </div>
                                    <div className="user-display-email">
                                        {getLastMessage(user._id) || user.email}
                                    </div>
                                </div>

                                <div>
                                    {getUnreadMessageCount(user._id) && (
                                        <div className="unread-message-counter">
                                            {getUnreadMessageCount(user._id)}
                                        </div>
                                    )}
                                    <div className="last-message-timestamp">
                                        {getLastMessageTimestamps(user._id)}
                                    </div>
                                </div>

                                {!allChats.find((chat) =>
                                    chat.members
                                        .map((m) => m._id)
                                        .includes(user._id)
                                ) && (
                                    <div className="user-start-chat">
                                        <button
                                            className="user-start-chat-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNewChat(user._id);
                                            }}
                                        >
                                            Start Chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
