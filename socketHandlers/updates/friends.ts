import { getActiveConnections, getSocketServerInstance } from '../../serverStore';

const User = require('../../models/user');
const FriendInvitation = require('../../models/friendInvitation');

interface IFriendsListItem {
  _id: string;
  email: string;
  username: string;
}

export const updateFriendsPendingInvitations = async (userId: string) => {
  try {
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate('senderId', '_id email username');

    const receiverList = getActiveConnections(userId);
    
    const io = getSocketServerInstance();

    receiverList.forEach((receiverSocketId) => {
      io?.to(receiverSocketId).emit('friends-invitations', {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateFriends = async (userId: string) => {
  try {
    const receiverList = getActiveConnections(userId);

    const user = await User.findById(userId, { 
      _id: 1, 
      friends: 1 
    }).populate('friends', '_id username email');

    let friendsList: any[] = [];
    if (user) {
      friendsList = user.friends.map((f: IFriendsListItem) => ({
        id: f._id,
        email: f.email,
        username: f.username,
      }));
    }


    const io = getSocketServerInstance();

    receiverList.forEach(receiverId => {
      io?.to(receiverId).emit('friends-list', {
        friends: friendsList.length ? friendsList : [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};