import { useSelector } from "react-redux";
import "../../css/home.css";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

export default function Home() {
    const {selectedChat} = useSelector(state=>state.userReducer);
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
