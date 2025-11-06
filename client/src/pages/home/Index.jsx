import "../../css/home.css";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

export default function Home() {
    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <SideBar/>
                <ChatArea/>
            </div>
        </div>
    );
}
