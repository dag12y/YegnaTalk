import { useSelector } from "react-redux";
import "../../css/home.css";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { io } from "socket.io-client";
import { useEffect } from "react";
const socket = io("http://localhost:5000");

export default function Home() {
    const { selectedChat,user } = useSelector((state) => state.userReducer);

    useEffect(() => {
        if(user){

            socket.emit('join-room',user._id)
           
        }
    }, [user]);

    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <SideBar socket={socket}/>
                {selectedChat && <ChatArea socket={socket}/>}
            </div>
        </div>
    );
}
