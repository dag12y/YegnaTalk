import "./../css/loader.css";
import { GridLoader, HashLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className="loader-overlay">
            <div className="loader-content">
                <GridLoader color="#fff" size={30} />
            </div>
        </div>
    );
}
