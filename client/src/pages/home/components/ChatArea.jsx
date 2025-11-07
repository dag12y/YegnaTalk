import { useSelector } from "react-redux";

export default function ChatArea() {
    const { selectedChat,user } = useSelector((state) => state.userReducer);
    const selectedUser = selectedChat.members.find(u=>u._id!==user._id);
    return (
        <>
            {selectedChat && (
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {selectedUser.firstname + ' '+ selectedUser.lastname}
                    </div>
                    <div>
                        CHAT AREA
                    </div>
                    <div>
                         SEND MESSAGE 
                    </div>
                </div>
            )}
        </>
    );
}
