import { Socket } from 'socket.io';
import { getActiveRoom, joinActiveRoom } from '../serverStore';
import { updateRooms } from './updates/rooms';

export interface IRoomJoin {
  roomId: string;
}

const roomJoinHandler = (socket: Socket, data: IRoomJoin) => {
  const { roomId } = data;

  const participantDetails = {
    // @ts-ignore
    userId: socket.user.userId,
    socketId: socket.id,
  };

  const roomDetails = getActiveRoom(roomId);

  joinActiveRoom(roomId, participantDetails);

  roomDetails?.participants?.forEach((participant) => {
    if (participant.socketId !== participantDetails.socketId) {
      socket.to(participant.socketId).emit('conn-prepare', {
        connUserSocketId: participantDetails.socketId,   
      });
    }
  });

  updateRooms();
};

export default roomJoinHandler;