import { getActiveRooms, getSocketServerInstance } from '../../serverStore';

export const updateRooms = (toSpecidiedTargetId: string | null = null) => {
  const io = getSocketServerInstance();
  const activeRooms = getActiveRooms();

  if (toSpecidiedTargetId) {
    io?.to(toSpecidiedTargetId).emit('active-rooms', {
      activeRooms,
    });
  } else {
    io?.emit('active-rooms', {
      activeRooms,
    })
  }
};