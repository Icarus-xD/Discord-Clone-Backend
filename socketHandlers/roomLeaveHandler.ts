import { Socket } from 'socket.io';
import { getActiveRoom, leaveActiveRoom } from '../serverStore';
import { updateRooms } from './updates/rooms';

export interface IRoomLeave {
  roomId: string;
}

const roomLeaveHandler = (socket: Socket, data: IRoomLeave) => {
  const { roomId } = data;

  const activeRoom = getActiveRoom(roomId);

  if (activeRoom) {
    leaveActiveRoom(roomId, socket.id);

    const updatedActiveRoom = getActiveRoom(roomId);

    if (updatedActiveRoom) {
      updatedActiveRoom.participants?.forEach((participant) => {
        socket.to(participant.socketId).emit('room-participant-left', {
          connUserSocketId: socket.id,
        });
      });
    }

    updateRooms();
  }
};

export default roomLeaveHandler;