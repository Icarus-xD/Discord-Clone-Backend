import { IAuthSocket } from '../socketServer';
import { updateChatHistory } from './updates/chat';

const Conversation = require('../models/conversation');

const directChatHistoryHandler = async (socket: IAuthSocket, data: any) => {
  try {
    // @ts-ignore
    const { userId } = socket.user;
    const { receiverId } = data;

    const conversation = await Conversation.findOne({
      participants: {$all: [userId, receiverId]},
      type: 'DIRECT',
    });

    if (conversation) {
      updateChatHistory(conversation._id.toString(), socket.id);
    }
  } catch (err) {
    console.log(err);
  }
};

export default directChatHistoryHandler;