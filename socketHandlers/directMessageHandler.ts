import { Socket } from 'socket.io';
import { IAuthSocket } from '../socketServer';
import { updateChatHistory } from './updates/chat';

const Message = require('../models/message');
const Conversation = require('../models/conversation');

export interface IDirectMessage {
  receiverId: string;
  content: string;
}

const directMessageHandler = async (socket: IAuthSocket, data: IDirectMessage) => {
  try {
    // @ts-ignore
    const { userId } = socket.user;

    const { receiverId, content } = data;

    const message = await Message.create({
      content,
      author: userId,
      date: new Date(),
      type: 'DIRECT',
    });

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] }
    });

    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();

      updateChatHistory(conversation._id.toString());
    } else {
      const newConversation = await Conversation.create({
        participants: [userId, receiverId],
        messages: [message],
      });

      updateChatHistory(newConversation._id.toString());
    } 
  } catch (err) {
    console.log(err);
  }
};

export default directMessageHandler;