import {toast} from 'react-hot-toast'
import { useDispatch, useSelector } from "react-redux";
import {createNewChat} from './../../../api/chat.js'
import {hideLoader, showLoader} from './../../../redux/loaderSlice.js'
import {setAllChats,setSelectedChat} from './../../../redux/userSlice.js'

export default function UserList({ search }) {
    const { allUsers, allChats ,user:currentUser} = useSelector((state) => state.userReducer);
    const lowerSearch = search.toLowerCase();
    const dispatch = useDispatch()

    const filteredUsers = allUsers.filter((user) => {
        if (!search.trim()) {
            return allChats.some((chat) => chat.members.includes(user._id));
        }

        return (
            user.firstname?.toLowerCase().includes(lowerSearch) ||
            user.lastname?.toLowerCase().includes(lowerSearch)
        );
    });

    if (filteredUsers.length === 0) {
        return <div>No users found</div>;
    }

    async function handleNewChat(searchedUserId){
        dispatch(showLoader);
        let response = await createNewChat([currentUser._id,searchedUserId]);
        dispatch(hideLoader)
        try {
            if(response.success){
                toast.success(response.message);
                const newChat = response.data;
                const updatedChat = [...allChats,newChat];
                dispatch(setAllChats(updatedChat))
                dispatch(setSelectedChat(newChat))
            }
        } catch (error) {
            toast.error(response.message);
            hideLoader();
        }
    }

    function openChat(selectedUserId){
        const chat = allChats.find(chat=>
            chat.members.includes(currentUser._id) &&
            chat.members.includes(selectedUserId)
        )

        if(chat){
            dispatch(setSelectedChat(chat))
        }
    }

    return (
        <>
            {filteredUsers.map((user) => (
                <div key={user._id} className="user-search-filter" onClick={()=>openChat(user._id)}>
                    <div className="filtered-user">
                        <div className="filter-user-display">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="profile pic"
                                    className="user-profile-image"
                                />
                            ) : (
                                <div className="user-default-profile-pic">
                                    {user.firstname[0]}
                                    {user.lastname[0]}
                                </div>
                            )}

                            <div className="filter-user-details">
                                <div className="user-display-name">
                                    {user.firstname} {user.lastname}
                                </div>
                                <div className="user-display-email">
                                    {user.email}
                                </div>
                            </div>
                            {!allChats.find((chat) =>
                                chat.members.includes(user._id)
                            ) && (
                                <div className="user-start-chat">
                                    <button className="user-start-chat-btn" onClick={()=>handleNewChat(user._id)}>
                                        Start Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
