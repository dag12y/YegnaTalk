import { useState } from "react";
import Search from "./Search";

export default function SideBar() {
    const [search, setSearch] = useState("");
    return (
        <div className="app-sidebar">
            <Search search={search} setSearch={setSearch} />
        </div>
    );
}
