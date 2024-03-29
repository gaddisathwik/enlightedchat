import {useAuthContext} from "../../context/authContext"
import { useConversationsContext } from "../../context/conversationsContext"
import { extractTime } from "../../utils/extractTime"


const Message = ({message}) => {

  const {currentUser} = useAuthContext()

  const {selectedConversation} = useConversationsContext()

  const fromMe = message.senderId === currentUser._id

  const formattedTime = extractTime(message.createdAt)
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const displayPic = fromMe ? currentUser.displayPic : selectedConversation.displayPic
  const bgcolor = fromMe ? "bg-green-700" : ""
  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
            <img src = {displayPic} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bgcolor}`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  )
}

export default Message