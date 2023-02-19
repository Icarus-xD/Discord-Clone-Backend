import { Socket } from 'socket.io';
import { getActiveRooms, removeConnectedUser } from '../serverStore';
import roomLeaveHandler from './roomLeaveHandler';


const disconnectHandler = (socket: Socket) => {
  const activeRooms = getActiveRooms();

  activeRooms.forEach(room => {
    const userInRoom = room.participants.some(participant => participant.socketId === socket.id);

    if (userInRoom) {
      roomLeaveHandler(socket, { roomId: room.roomId });
    }
  });

  removeConnectedUser(socket.id);
};

export default disconnectHandler;