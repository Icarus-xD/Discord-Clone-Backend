import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { registerSocketServer } from './socketServer';
import authRoutes from './routes/authRoutes';
import friendInvitationRoutes from './routes/friendInvitationRoutes';

dotenv.config();


const PORT = process.env.PORT || process.env.API_PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/friend-invitation', friendInvitationRoutes);

const server = http.createServer(app);
registerSocketServer(server); 

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.log('Database connection failed. Server not started.');
    console.error(error);
  });