import { useState } from "react";
import Search from "./Search";
import UserList from "./UserList";

export default function SideBar({socket,onlineUsers}) {
    const [search, setSearch] = useState("");
    return (
        <div className="app-sidebar">
            <Search search={search} setSearch={setSearch} />
            <UserList
                search={search}
                socket={socket}
                onlineUsers={onlineUsers}
            />
        </div>
    );
}
