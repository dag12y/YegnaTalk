import { useSelector } from "react-redux";
import "../../css/home.css";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { io } from "socket.io-client";
import { useEffect } from "react";

export default function Home() {
    const { selectedChat,user } = useSelector((state) => state.userReducer);
    const socket = io("http://localhost:5000");

    useEffect(() => {
        if(user){

            socket.emit('join-room',user._id)
            socket.emit("send-message", {
                text: "hi dave",
                recipient: "",
            });
            socket.on("receive-message",data=>{
                console.log(data);
                
            });
        }
    }, [user]);

    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <SideBar />
                {selectedChat && <ChatArea />}
            </div>
        </div>
    );
}
