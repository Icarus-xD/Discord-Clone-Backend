import { Request, Response } from 'express';
import { updateFriendsPendingInvitations } from '../../socketHandlers/updates/friends';

const FriendInvitation = require('../../models/friendInvitation');
const User = require('../../models/user');

const postInvite = async (req: Request, res: Response) => {
  const { targetEmail } = req.body;

  const { userId, email } = req.body.user;

  if ((email as string).toLowerCase() === (targetEmail as string).toLowerCase()) {
    return res.status(409).send("Sorry. You can't become friend with yourself.");
  }

  const targetUser = await User.findOne({
    email: (targetEmail as string).toLowerCase(),
  });

  if (!targetUser) {
    return res.status(404).send(`Friend of ${targetEmail} has not been found. Please check email.`);
  }

  const invitationReceived = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id
  });

  if (invitationReceived) {
    return res.status(409).send('Invitation has been already sent.');
  }

  const usersFriends = targetUser.friends.find((id: string) => id.toString() === userId)

  if (usersFriends) {
    return res.status(409).send('Friend already added. Please check friends list.');
  }

  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  updateFriendsPendingInvitations(targetUser._id.toString());

  return res.status(201).send('Invitation has been sent.');
};

export default postInvite;