import http from 'http';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import authSocket from './middleware/authSocket';
import { getOnlineUsers, setSocketServerInstance } from './serverStore';
import disconnectHandler from './socketHandlers/disconnectHandler';
import newConnectionHandler from './socketHandlers/newConnectionHandler';
import directMessageHandler, { IDirectMessage } from './socketHandlers/directMessageHandler';
import directChatHistoryHandler from './socketHandlers/directChatHistoryHandler';
import roomCreateHandler from './socketHandlers/roomCreateHandler';
import roomJoinHandler, { IRoomJoin } from './socketHandlers/roomJoinHandler';
import roomLeaveHandler, { IRoomLeave } from './socketHandlers/roomLeaveHandler';
import { IRoomInitializeConnection, roomInitalizeConnectionHandler } from './socketHandlers/roomInitalizeConnectionHandler';
import { IRoomSignalingData, roomSignalingDataHandler } from './socketHandlers/roomSignalingDataHandler';

const config = process.env;

export interface IAuthSocket extends Socket {
  user: string | JwtPayload;
}

export const registerSocketServer = (server: http.Server) => {
  const io: Server = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  setSocketServerInstance(io);

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  const emitOnlineUsers = () => {
    const onlineUsers = getOnlineUsers();

    io.emit('online-users', { onlineUsers });
  };

  io.on('connection', (socket: Socket) => {
    // console.log('User connected');
    // console.log(socket.id);

    newConnectionHandler(socket, io);

    emitOnlineUsers();

    socket.on('direct-message', (data: IDirectMessage) => {
      directMessageHandler(socket as IAuthSocket, data);
    });

    socket.on('direct-chat-history', (data) => {
      directChatHistoryHandler(socket as IAuthSocket, data);
    });

    socket.on('room-create', () => {
      roomCreateHandler(socket);
    });

    socket.on('room-join', (data: IRoomJoin) => {
      roomJoinHandler(socket, data);
    });

    socket.on('room-leave', (data: IRoomLeave) => {
      roomLeaveHandler(socket, data);
    });

    socket.on('conn-init', (data: IRoomInitializeConnection) => {
      roomInitalizeConnectionHandler(socket, data);
    });

    socket.on('conn-signal', (data: IRoomSignalingData) => {
      roomSignalingDataHandler(socket, data);
    });

    socket.on('disconnect', () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 8000);
};