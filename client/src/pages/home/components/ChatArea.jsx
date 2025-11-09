import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../../../api/message";
import { showLoader, hideLoader } from "./../../../redux/loaderSlice";
import { clearUnreadMessageCount } from "../../../api/chat";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import moment from "moment";

export default function ChatArea() {
    const { selectedChat, user, allChats } = useSelector(
        (state) => state.userReducer
    );
    const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [allMessage, setAllMessage] = useState([]);

    async function sendMessage() {
        try {
            if (!message.trim()) {
                toast.error("Message cannot be empty");
                return;
            }

            const formattedMessage = {
                chatId: selectedChat._id,
                sender: user._id,
                text: message,
            };

            dispatch(showLoader());
            const response = await createNewMessage(formattedMessage);
            dispatch(hideLoader());

            if (response.success) {
                toast.success("Message sent!");
                setMessage("");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
        }
    }

    async function getMessages() {
        try {
            dispatch(showLoader());
            const response = await getAllMessages(selectedChat._id);
            dispatch(hideLoader());

            if (response.success) {
                setAllMessage(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
        }
    }

    async function clearUnreadMessage() {
        try {
            dispatch(showLoader());
            const response = await clearUnreadMessageCount(selectedChat._id);
            dispatch(hideLoader());

            if (response.success) {
                allChats.map((chat) => {
                    if (chat._id === selectedChat._id) {
                        return response.data;
                    }
                    return chat;
                });
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
        }
    }

    function formatTime(timestamps) {
        const now = moment();
        const diff = now.diff(moment(timestamps), "days");

        if (diff < 1) {
            return `Today ${moment(timestamps).format("hh:mm A")}`;
        } else if (diff == 1) {
            return `Yesterday ${moment(timestamps).format("hh:mm A")}`;
        } else {
            return moment(timestamps).format("MMM D, hh:mm A");
        }
    }

    useEffect(() => {
        getMessages();
       if (
           selectedChat?.lastMessage &&
           selectedChat.lastMessage.sender !== user._id
       ) {
           clearUnreadMessage();
       }

    }, [selectedChat]);

    return (
        <>
            {selectedChat && (
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {selectedUser.firstname + " " + selectedUser.lastname}
                    </div>
                    <div className="main-chat-area">
                        {allMessage.map((msg) => {
                            const isCurrentUserSender = msg.sender === user._id;
                            return (
                                <div
                                    key={msg._id || msg.createdAt}
                                    className={`message-container ${
                                        isCurrentUserSender
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div className="message-wrapper">
                                        <div
                                            className={
                                                isCurrentUserSender
                                                    ? "send-message"
                                                    : "received-message"
                                            }
                                        >
                                            {msg.text}
                                        </div>
                                        <div className="messages-timestamps">
                                            {formatTime(msg.createdAt)}
                                            {isCurrentUserSender &&
                                                msg.read && (
                                                    <i className="fa fa-check-circle" aria-hidden='true' style={{color:'#0ea7e9ff', marginLeft:'5px'}}></i>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="send-message-div">
                        <textarea
                            className="send-message-input"
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={1}
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                        />

                        <button
                            className="fa fa-paper-plane send-message-btn"
                            aria-hidden="true"
                            onClick={sendMessage}
                        ></button>
                    </div>{" "}
                </div>
            )}
        </>
    );
}
