import "../../css/home.css";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

export default function Home() {
    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <SideBar/>
            </div>
        </div>
    );
}
