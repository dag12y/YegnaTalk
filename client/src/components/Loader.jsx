import "./../css/loader.css";
import { BeatLoader, GridLoader, HashLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className="loader-overlay">
            <div className="loader-content">
                <BeatLoader color="#fff" size={25} />
            </div>
        </div>
    );
}
