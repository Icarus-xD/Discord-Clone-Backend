import jwt, { Secret } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

const config = process.env;

const verifyTokenSocket = (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  const token = socket.handshake.auth.token;

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY as Secret);
    // @ts-ignore
    socket.user = decoded;
    
  } catch (error) {
    const socketError = new Error('Not Authorized');

    return next(socketError);
  }

  next();
};

export default verifyTokenSocket;