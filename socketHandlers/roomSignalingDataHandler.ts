import { SignalData } from 'simple-peer';
import { Socket } from 'socket.io';

export interface IRoomSignalingData {
  signal: SignalData,
  connUserSocketId: string;
}

export const roomSignalingDataHandler = (socket: Socket, data: IRoomSignalingData) => {
  const { connUserSocketId, signal } = data;

  const signalingData: IRoomSignalingData = { signal, connUserSocketId: socket.id };

  socket.to(connUserSocketId).emit('conn-signal', signalingData);
};