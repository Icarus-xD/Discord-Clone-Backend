import { Socket } from 'socket.io';

export interface IRoomInitializeConnection {
  connUserSocketId: string;
}

export const roomInitalizeConnectionHandler = (socket: Socket, data: IRoomInitializeConnection) => {
  const { connUserSocketId } = data;

  const initData = { connUserSocketId: socket.id };
  socket.to(connUserSocketId).emit('conn-init', initData);
};