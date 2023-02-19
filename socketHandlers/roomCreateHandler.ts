import { Socket } from 'socket.io';
import { addNewActiveRoom } from '../serverStore';
import { updateRooms } from './updates/rooms';

const roomCreateHandler = (socket: Socket) => {
  const socketId = socket.id;
  // @ts-ignore
  const userId = socket.user.userId;

  const roomDetails = addNewActiveRoom(userId, socketId);

  socket.emit('room-create', {
    roomDetails,
  });

  updateRooms();
};

export default roomCreateHandler;