import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../../../api/message";
import { showLoader, hideLoader } from "./../../../redux/loaderSlice";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

export default function ChatArea() {
    const { selectedChat, user } = useSelector((state) => state.userReducer);
    const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [allMessage, setAllMessage] = useState("");

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
            const response = await getAllMessages(selectedChat._id)
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

    useEffect(()=>{
        getMessages()
    },[selectedChat])

    return (
        <>
            {selectedChat && (
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {selectedUser.firstname + " " + selectedUser.lastname}
                    </div>
                    <div className="main-chat-area">CHAT AREA</div>
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
