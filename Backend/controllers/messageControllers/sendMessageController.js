import Conversation from "../../models/conversationModel.js"
import Message from "../../models/messageModel.js"
import { getReceiverSocketId } from "../../socket/socket.js"
import { io } from "../../socket/socket.js"

export const sendMessage = async (req, res) => {

    try {

        const {message} = req.body
        const {id: receiverId} = req.params

        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            fromTo: {
                $all: [senderId, receiverId]
            }
        })

        if(!conversation) {

            conversation = await Conversation.create({
                fromTo: [senderId, receiverId]
            })

        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })


        if(newMessage) {

            conversation.messages.push(newMessage._id)

        }

        await Promise.all([
            conversation.save(),
            newMessage.save()
        ])


        const receiverSocketId = getReceiverSocketId(receiverId)

        if(receiverSocketId) {

            io.to(receiverSocketId).emit("newMessage", newMessage)

        }

        res.status(201).json({
            newMessage
        })
        
    } catch (e) {
        
        res.status(500).json({
            error: `Internal server error due to ${e}`
        })

    }

}