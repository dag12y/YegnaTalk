import { useSelector } from "react-redux"

export default function ChatArea() {
  const { selectedChat } = useSelector((state) => state.userReducer);
  return (
    <div>
      {selectedChat && <div>{selectedChat._id}</div>}
    </div>
  )
}
