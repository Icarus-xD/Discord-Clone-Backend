import { Server } from 'socket.io';
import { v4 } from 'uuid';

interface IUser {
  socketId: string;
  userId: string;
}

interface ActiveRoom {
  roomId: string;
  roomCreator: IUser;
  participants: IUser[];
}

type OnlineUsers = IUser[];

let io: Server | null = null;

const connectedUsers = new Map<string, { userId: string }>();

let activeRooms: ActiveRoom[] = [];

export const setSocketServerInstance = (ioInstance: Server) => {
  io = ioInstance;
};

export const getSocketServerInstance = () => {
  return io;
};

export const addNewConnected = ({ socketId, userId }: IUser) => {
  connectedUsers.set(socketId, { userId });

  // console.log('new connected user');
};

export const removeConnectedUser = (socketId: string) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);

    console.log('disconnected user');
    console.log(connectedUsers)
  }
};

export const getActiveConnections = (userId: string) => {
  const activeConnections: string[] = [];
  
  connectedUsers.forEach((value, key) => {
    
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });

  return activeConnections;
};

export const getOnlineUsers = () => {
  const onlineUsers: OnlineUsers = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({
      socketId: key,
      userId: value.userId,
    });
  });

  return onlineUsers;
};

export const getActiveRooms = () => {
  return activeRooms;
};

export const getActiveRoom = (roomId: string) => {

  const activeRoom = activeRooms.find(room => room.roomId === roomId);

  if (activeRoom) {
    return { ...activeRoom };
  }

  return null;
};

export const addNewActiveRoom = (userId: string, socketId: string) => {
  const newActiveRoom: ActiveRoom = {
    roomId: v4(),
    roomCreator: { userId, socketId },
    participants: [
      { userId, socketId }
    ],
  };

  activeRooms.push(newActiveRoom);

  return newActiveRoom;
};

export const joinActiveRoom = (roomId: string, newParticipant: IUser) => {
  const room = activeRooms.find(room => room.roomId === roomId) as ActiveRoom;
  activeRooms = activeRooms.filter((room) => room.roomId !== roomId);

  const updatedRoom: ActiveRoom = {
    ...room,
    participants: [...room.participants, newParticipant],
  };

  activeRooms.push(updatedRoom);
};

export const leaveActiveRoom = (roomId: string, participantsSocketId: string) => {
  const activeRoom = activeRooms.find(room => room.roomId === roomId);

  if (activeRoom) {
    const copyOfActiveRoom: ActiveRoom = {...activeRoom };

    copyOfActiveRoom.participants = copyOfActiveRoom.participants.filter(
      participant => participant.socketId !== participantsSocketId
    );

    activeRooms = activeRooms.filter(room => room.roomId !== roomId);

    if (copyOfActiveRoom.participants.length) {
      activeRooms.push(copyOfActiveRoom);
    }
  }
};