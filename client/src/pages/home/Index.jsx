import { useSelector } from "react-redux";
import "../../css/home.css";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
const socket = io("http://localhost:5000");

export default function Home() {
    const { selectedChat,user } = useSelector((state) => state.userReducer);
    const [onlineUsers,setOnlineUsers]=useState([])

    useEffect(() => {
        if(user){
            socket.emit('join-room',user._id);
            socket.emit('user-logged-in',user._id);
            socket.on('online-users',onlineUsers=>{
                setOnlineUsers(onlineUsers)
            })
            socket.on("online-users-updated", (onlineUsers) => {
                setOnlineUsers(onlineUsers);
            });
        }
    }, [user]);

    return (
        <div className="home-page">
            <Header socket={socket}/>
            <div className="main-content">
                <SideBar socket={socket} onlineUsers={onlineUsers}/>
                {selectedChat && <ChatArea socket={socket} onlineUsers={onlineUsers}/>}
            </div>
        </div>
    );
}
