import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const friendInvitationSchema = new mongoose.Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('FriendInvitation', friendInvitationSchema);