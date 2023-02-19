import { Request, Response } from 'express';
import { updateFriends, updateFriendsPendingInvitations } from '../../socketHandlers/updates/friends';

const FriendInvitation = require('../../models/friendInvitation');
const User = require('../../models/user');

const postAccept = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { id } = req.body;

    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.status(401).send('Error occured. Please try again.');
    }

    const { senderId, receiverId } = invitation;

    const sender = await User.findById(senderId);
    sender.friends = [ ...sender.friends, receiverId ];

    const receiver = await User.findById(receiverId);
    receiver.friends = [ ...receiver.friends, senderId ];
    
    await sender.save();
    await receiver.save();

    await FriendInvitation.findByIdAndDelete(id);

    updateFriends(senderId.toString());
    updateFriends(receiverId.toString());

    updateFriendsPendingInvitations(receiverId.toString());

    return res.status(200).send('Friend successfully added');
  } catch (err) {
    console.log(err);

    return res.status(500).send('Something went wrong. Please try again.')
  }
};

export default postAccept;