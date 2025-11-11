import { useState } from "react";
import Search from "./Search";
import UserList from "./UserList";

export default function SideBar({socket}) {
    const [search, setSearch] = useState("");
    return (
        <div className="app-sidebar">
            <Search search={search} setSearch={setSearch} />
            <UserList search={search} socket={socket}/>
        </div>
    );
}
