import { useSelector } from "react-redux";
import "../../css/home.css";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import {io} from 'socket.io-client'

export default function Home() {
    const {selectedChat} = useSelector(state=>state.userReducer);
    const socket = io('http://localhost:5000')

    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <SideBar/>
                {selectedChat && <ChatArea/>}
            </div>
        </div>
    );
}
