import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../../../api/message";
import { showLoader, hideLoader } from "./../../../redux/loaderSlice";
import { clearUnreadMessageCount } from "../../../api/chat";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import moment from "moment";
import store from "../../../redux/store";
import { setAllChats } from "../../../redux/userSlice";

export default function ChatArea({ socket }) {
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

            socket.emit("send-message", {
                ...formattedMessage,
                members: selectedChat.members.map((m) => m._id),
                read: false,
                createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
            });

            const response = await createNewMessage(formattedMessage);

            if (response.success) {
                toast.success("Message sent!");
                setMessage("");

                // Use the latest allChats from Redux store
                const latestAllChats = store.getState().userReducer.allChats;

                const updatedChats = latestAllChats.map((chat) =>
                    chat._id === selectedChat._id
                        ? { ...chat, lastMessage: response.data } // use backend message with _id
                        : chat
                );

                // Move the chat to top
                const latestChat = updatedChats.find(
                    (chat) => chat._id === selectedChat._id
                );
                const otherChats = updatedChats.filter(
                    (chat) => chat._id !== selectedChat._id
                );

                dispatch(setAllChats([latestChat, ...otherChats]));
            } else {
                toast.error(response.message);
            }
        } catch (error) {
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
            socket.emit("clear-unread-message", {
                chatId: selectedChat._id,
                members: selectedChat.members.map((m) => m._id),
            });
            const response = await clearUnreadMessageCount(selectedChat._id);

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
        socket.on("receive-message", (message) => {
            const selectedChat = store.getState().userReducer.selectedChat;
            if (selectedChat._id === message.chatId) {
                setAllMessage((p) => [...p, message]);
            }
            if (
                selectedChat._id === message.chatId &&
                message.sender !== user._id
            ) {
                clearUnreadMessage();
            }
        });

        socket.on("message-count-cleared", (data) => {
            const selectedChat = store.getState().userReducer.selectedChat;
            const allChats = store.getState().userReducer.allChats;

            if(selectedChat._id === data.chatId){
                //updating unread message count in chat object
                const updatedChats = allChats.map(chat=>{
                    if(chat._id === data.chatId){
                        return { ...chat, unreadMessageCount: 0 };
                    }
                    return chat;
                })

                dispatch(setAllChats(updatedChats))

                // updating read property in message object
                setAllMessage(p=>{
                    return p.map(msg=>{
                        return {...msg,read:true}
                    })
                })
            }
        });
    }, [selectedChat]);

    useEffect(() => {
        const msgContainer = document.getElementById("main-chat-area");
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, [allMessage]);

    return (
        <>
            {selectedChat && (
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {selectedUser.firstname + " " + selectedUser.lastname}
                    </div>
                    <div className="main-chat-area" id="main-chat-area">
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
                                                    <i
                                                        className="fa fa-check-circle"
                                                        aria-hidden="true"
                                                        style={{
                                                            color: "#0ea7e9ff",
                                                            marginLeft: "5px",
                                                        }}
                                                    ></i>
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
