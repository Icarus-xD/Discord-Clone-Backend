import { Server, Socket } from 'socket.io';
import { addNewConnected } from '../serverStore';
import { updateFriends, updateFriendsPendingInvitations } from './updates/friends';
import { updateRooms } from './updates/rooms';

const newConnectionHandler = async (socket: Socket, io: Server) => {
  // @ts-ignore
  const userDetails = socket.user;

  addNewConnected({
    socketId: socket.id, 
    userId: userDetails.userId,
  });

  updateFriendsPendingInvitations(userDetails.userId);
  updateFriends(userDetails.userId);
  setTimeout(() => updateRooms(socket.id), 500);
};

export default newConnectionHandler;